/**
 * Playwright-based browser adapter implementation
 */

import { chromium, firefox, webkit, Browser, Page, BrowserContext } from 'playwright';
import type {
  BrowserAdapter,
  BrowserConfig,
  BrowserSession,
  PageObservation,
  Action,
  ActionResult,
  BrowserType,
  NavigationOptions,
  ObservationOptions,
  PageInfo
} from '@ora/browser-core';
import {
  DEFAULT_BROWSER_CONFIG,
  DEFAULT_ACTION_TIMEOUT,
  DEFAULT_NAVIGATION_TIMEOUT
} from '@ora/browser-core';

interface PlaywrightSession extends BrowserSession {
  browser: Browser;
  context: BrowserContext;
  pages: Map<string, Page>;
}

export class PlaywrightAdapter implements BrowserAdapter {
  protected browserType: BrowserType;

  constructor(browserType: BrowserType = 'chromium') {
    this.browserType = browserType;
  }

  async launch(config: BrowserConfig): Promise<BrowserSession> {
    const mergedConfig = { ...DEFAULT_BROWSER_CONFIG, ...config };
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    let browser: Browser;
    switch (mergedConfig.browserType) {
      case 'firefox':
        browser = await firefox.launch({
          headless: mergedConfig.headless,
          args: mergedConfig.userAgent ? [`--user-agent=${mergedConfig.userAgent}`] : []
        });
        break;
      case 'webkit':
        browser = await webkit.launch({
          headless: mergedConfig.headless
        });
        break;
      case 'chromium':
      default:
        browser = await chromium.launch({
          headless: mergedConfig.headless,
          args: mergedConfig.userAgent ? [`--user-agent=${mergedConfig.userAgent}`] : []
        });
        break;
    }

    const contextOptions: any = {
      viewport: mergedConfig.viewport,
      userAgent: mergedConfig.userAgent
    };

    if (mergedConfig.proxy) {
      contextOptions.proxy = {
        server: mergedConfig.proxy.server,
        username: mergedConfig.proxy.username,
        password: mergedConfig.proxy.password,
        bypass: mergedConfig.proxy.bypass
      };
    }

    if (mergedConfig.downloadPath) {
      contextOptions.acceptDownloads = true;
    }

    const context = await browser.newContext(contextOptions);

    const session: PlaywrightSession = {
      id: sessionId,
      browserType: mergedConfig.browserType,
      browser,
      context,
      pages: new Map(),
      activePageId: '',
      config: mergedConfig,
      createdAt: Date.now(),
      lastUsedAt: Date.now()
    };

    // Create initial page
    const page = await context.newPage();
    const pageId = `page_${Date.now()}`;
    session.pages.set(pageId, page);
    session.activePageId = pageId;

    return session;
  }

  async navigate(
    session: BrowserSession,
    url: string,
    options?: NavigationOptions
  ): Promise<void> {
    const ps = session as PlaywrightSession;
    const page = this.getActivePage(ps);

    if (!page) {
      throw new Error('No active page available');
    }

    const timeout = options?.timeout || DEFAULT_NAVIGATION_TIMEOUT;
    const waitUntil = options?.waitUntil || 'domcontentloaded';

    await page.goto(url, {
      timeout,
      waitUntil,
      referer: options?.referer
    });

    ps.lastUsedAt = Date.now();
  }

  async observe(session: BrowserSession, options?: ObservationOptions): Promise<PageObservation> {
    const ps = session as PlaywrightSession;
    const page = this.getActivePage(ps);

    if (!page) {
      throw new Error('No active page available');
    }

    const timestamp = Date.now();

    try {
      // Wait for page to be ready
      await page.waitForLoadState('domcontentloaded', {
        timeout: options?.maxElements ? 5000 : 15000
      });

      const url = page.url();
      const title = await page.title();
      const loading = false;

      // Extract elements using accessibility tree and DOM
      const elements = await this.extractElements(page, options);

      // Capture screenshot if requested
      let screenshot: any;
      if (options?.includeScreenshot) {
        const buffer = await page.screenshot({
          fullPage: options.screenshotFullPage,
          type: 'png'
        });
        screenshot = {
          base64: buffer.toString('base64'),
          mimeType: 'image/png',
          width: elements[0]?.boundingBox?.width || 1280,
          height: elements[0]?.boundingBox?.height || 720
        };
      }

      ps.lastUsedAt = Date.now();

      return {
        url,
        title,
        elements,
        screenshot,
        timestamp,
        loading,
        error: undefined
      };
    } catch (error) {
      return {
        url: page.url(),
        title: await page.title().catch(() => 'Unknown'),
        elements: [],
        timestamp,
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown observation error'
      };
    }
  }

  private async extractElements(page: Page, options?: ObservationOptions): Promise<any[]> {
    // Use JavaScript to extract element information
    const elements = await page.evaluate(() => {
      const interactiveSelectors = [
        'a[href]',
        'button',
        'input',
        'select',
        'textarea',
        '[role="button"]',
        '[role="link"]',
        '[role="textbox"]',
        '[role="checkbox"]',
        '[role="radio"]',
        '[role="combobox"]',
        '[role="listbox"]',
        '[role="menuitem"]',
        '[role="tab"]',
        '[onclick]',
        '[onkeydown]',
        '[tabindex]:not([tabindex="-1"])'
      ];

      const selector = interactiveSelectors.join(', ');
      const allElements = document.querySelectorAll(selector);

      const elements: any[] = [];
      let idCounter = 0;

      allElements.forEach((el: Element) => {
        const rect = el.getBoundingClientRect();
        const style = window.getComputedStyle(el);

        // Skip invisible elements
        if (rect.width === 0 || rect.height === 0 || style.display === 'none' || style.visibility === 'hidden') {
          return;
        }

        const role = el.getAttribute('role') || this.getInferredRole(el);
        const text = (el as HTMLElement).innerText?.slice(0, 200) || '';
        const ariaLabel = el.getAttribute('aria-label') || el.getAttribute('aria-labelledby') || '';
        const placeholder = (el as HTMLInputElement).placeholder || '';
        const value = (el as HTMLInputElement).value || '';

        elements.push({
          id: `el_${idCounter++}`,
          role: role || 'generic',
          tag: el.tagName.toLowerCase(),
          text: text.slice(0, 100),
          ariaLabel: ariaLabel.slice(0, 100),
          placeholder: placeholder.slice(0, 100),
          value: value.slice(0, 100),
          boundingBox: {
            x: Math.round(rect.x),
            y: Math.round(rect.y),
            width: Math.round(rect.width),
            height: Math.round(rect.height)
          },
          visible: true,
          enabled: !(el as HTMLButtonElement).disabled,
          clickable: true,
          editable: ['INPUT', 'TEXTAREA'].includes(el.tagName),
          selector: this.generateSelector(el as HTMLElement),
          confidence: 0.9
        });
      });

      return elements.slice(0, options?.maxElements || 100);
    });

    return elements;
  }

  private getInferredRole(el: Element): string {
    const tag = el.tagName.toLowerCase();
    const roleMap: Record<string, string> = {
      a: 'link',
      button: 'button',
      input: 'textbox',
      select: 'combobox',
      textarea: 'textbox',
      h1: 'heading',
      h2: 'heading',
      h3: 'heading',
      h4: 'heading',
      h5: 'heading',
      h6: 'heading',
      img: 'img',
      table: 'table',
      ul: 'list',
      ol: 'list',
      li: 'listitem'
    };
    return roleMap[tag] || '';
  }

  private generateSelector(el: HTMLElement): string {
    if (el.id) {
      return `#${el.id}`;
    }
    if (el.className && typeof el.className === 'string' && el.className.trim()) {
      const classes = el.className.split(' ').filter(Boolean).slice(0, 2).join('.');
      if (classes) {
        return `${el.tagName.toLowerCase()}.${classes}`;
      }
    }
    // Fallback to tag
    return el.tagName.toLowerCase();
  }

  async execute(session: BrowserSession, action: Action): Promise<ActionResult> {
    const startTime = Date.now();
    const ps = session as PlaywrightSession;
    const page = this.getActivePage(ps);

    if (!page) {
      return {
        success: false,
        executionTime: 0,
        pageStateChanged: false,
        error: 'No active page available'
      };
    }

    try {
      let result: ActionResult;

      switch (action.type) {
        case 'navigate':
          result = await this.executeNavigate(page, action);
          break;
        case 'click':
          result = await this.executeClick(page, action);
          break;
        case 'type':
        case 'fill':
          result = await this.executeType(page, action);
          break;
        case 'press':
          result = await this.executePress(page, action);
          break;
        case 'scroll':
          result = await this.executeScroll(page, action);
          break;
        case 'hover':
          result = await this.executeHover(page, action);
          break;
        case 'select':
          result = await this.executeSelect(page, action);
          break;
        case 'wait':
          result = await this.executeWait(page, action);
          break;
        case 'screenshot':
          result = await this.executeScreenshot(page, action);
          break;
        case 'go_back':
          result = await this.executeGoBack(page);
          break;
        case 'go_forward':
          result = await this.executeGoForward(page);
          break;
        case 'new_tab':
          result = await this.executeNewTab(ps);
          break;
        case 'close_tab':
          result = await this.executeCloseTab(ps);
          break;
        case 'switch_tab':
          result = await this.executeSwitchTab(ps, action);
          break;
        default:
          result = {
            success: false,
            executionTime: Date.now() - startTime,
            pageStateChanged: false,
            error: `Unknown action type: ${action.type}`
          };
      }

      ps.lastUsedAt = Date.now();
      result.executionTime = Date.now() - startTime;
      return result;
    } catch (error) {
      return {
        success: false,
        executionTime: Date.now() - startTime,
        pageStateChanged: false,
        error: error instanceof Error ? error.message : 'Action execution failed'
      };
    }
  }

  private async executeNavigate(page: Page, action: Action): Promise<ActionResult> {
    const url = action.value;
    if (!url) {
      return {
        success: false,
        executionTime: 0,
        pageStateChanged: false,
        error: 'No URL provided for navigation'
      };
    }

    const previousUrl = page.url();
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: DEFAULT_NAVIGATION_TIMEOUT });
    const newUrl = page.url();

    return {
      success: true,
      executionTime: 0,
      resultingURL: newUrl,
      pageStateChanged: newUrl !== previousUrl
    };
  }

  private async executeClick(page: Page, action: Action): Promise<ActionResult> {
    const target = action.target;
    if (!target) {
      return {
        success: false,
        executionTime: 0,
        pageStateChanged: false,
        error: 'No target specified for click'
      };
    }

    const selector = await this.findElement(page, target);
    if (!selector) {
      return {
        success: false,
        executionTime: 0,
        pageStateChanged: false,
        error: 'Target element not found'
      };
    }

    const previousUrl = page.url();
    await page.click(selector, {
      delay: action.options?.delay,
      button: action.options?.button || 'left',
      clickCount: action.options?.clickCount || 1
    });

    // Wait briefly for navigation if applicable
    try {
      await page.waitForLoadState('domcontentloaded', { timeout: 3000 });
    } catch {
      // Navigation didn't happen, which is fine
    }

    return {
      success: true,
      executionTime: 0,
      resultingURL: page.url(),
      pageStateChanged: page.url() !== previousUrl
    };
  }

  private async executeType(page: Page, action: Action): Promise<ActionResult> {
    const target = action.target;
    const value = action.value;

    if (!target) {
      return {
        success: false,
        executionTime: 0,
        pageStateChanged: false,
        error: 'No target specified for type'
      };
    }

    if (!value) {
      return {
        success: false,
        executionTime: 0,
        pageStateChanged: false,
        error: 'No value provided for type'
      };
    }

    const selector = await this.findElement(page, target);
    if (!selector) {
      return {
        success: false,
        executionTime: 0,
        pageStateChanged: false,
        error: 'Target element not found'
      };
    }

    await page.fill(selector, value);

    return {
      success: true,
      executionTime: 0,
      pageStateChanged: false
    };
  }

  private async executePress(page: Page, action: Action): Promise<ActionResult> {
    const key = action.value;
    if (!key) {
      return {
        success: false,
        executionTime: 0,
        pageStateChanged: false,
        error: 'No key specified for press'
      };
    }

    await page.keyboard.press(key);

    return {
      success: true,
      executionTime: 0,
      pageStateChanged: true
    };
  }

  private async executeScroll(page: Page, action: Action): Promise<ActionResult> {
    const direction = action.value || 'down';
    const amount = action.options?.delay || 300;

    await page.evaluate((dir: string, amt: number) => {
      const scrollAmount = dir === 'up' ? -amt : amt;
      window.scrollBy(0, scrollAmount);
    }, direction, amount);

    return {
      success: true,
      executionTime: 0,
      pageStateChanged: true
    };
  }

  private async executeHover(page: Page, action: Action): Promise<ActionResult> {
    const target = action.target;
    if (!target) {
      return {
        success: false,
        executionTime: 0,
        pageStateChanged: false,
        error: 'No target specified for hover'
      };
    }

    const selector = await this.findElement(page, target);
    if (!selector) {
      return {
        success: false,
        executionTime: 0,
        pageStateChanged: false,
        error: 'Target element not found'
      };
    }

    await page.hover(selector);

    return {
      success: true,
      executionTime: 0,
      pageStateChanged: false
    };
  }

  private async executeSelect(page: Page, action: Action): Promise<ActionResult> {
    const target = action.target;
    const value = action.value;

    if (!target || !value) {
      return {
        success: false,
        executionTime: 0,
        pageStateChanged: false,
        error: 'Target or value missing for select'
      };
    }

    const selector = await this.findElement(page, target);
    if (!selector) {
      return {
        success: false,
        executionTime: 0,
        pageStateChanged: false,
        error: 'Target element not found'
      };
    }

    await page.selectOption(selector, value);

    return {
      success: true,
      executionTime: 0,
      pageStateChanged: false
    };
  }

  private async executeWait(page: Page, action: Action): Promise<ActionResult> {
    const timeout = action.options?.timeout || 1000;
    await page.waitForTimeout(timeout);

    return {
      success: true,
      executionTime: timeout,
      pageStateChanged: false
    };
  }

  private async executeScreenshot(page: Page, action: Action): Promise<ActionResult> {
    const buffer = await page.screenshot({
      fullPage: action.options?.delay === -1,
      type: 'png'
    });

    return {
      success: true,
      executionTime: 0,
      pageStateChanged: false,
      extractedData: {
        base64: buffer.toString('base64'),
        mimeType: 'image/png'
      }
    };
  }

  private async executeGoBack(page: Page): Promise<ActionResult> {
    const previousUrl = page.url();
    await page.goBack({ waitUntil: 'domcontentloaded' });

    return {
      success: true,
      executionTime: 0,
      resultingURL: page.url(),
      pageStateChanged: page.url() !== previousUrl
    };
  }

  private async executeGoForward(page: Page): Promise<ActionResult> {
    const previousUrl = page.url();
    await page.goForward({ waitUntil: 'domcontentloaded' });

    return {
      success: true,
      executionTime: 0,
      resultingURL: page.url(),
      pageStateChanged: page.url() !== previousUrl
    };
  }

  private async executeNewTab(session: PlaywrightSession): Promise<ActionResult> {
    const page = await session.context.newPage();
    const pageId = `page_${Date.now()}`;
    session.pages.set(pageId, page);
    session.activePageId = pageId;

    return {
      success: true,
      executionTime: 0,
      pageStateChanged: true
    };
  }

  private async executeCloseTab(session: PlaywrightSession): Promise<ActionResult> {
    const page = this.getActivePage(session);
    if (!page) {
      return {
        success: false,
        executionTime: 0,
        pageStateChanged: false,
        error: 'No active page to close'
      };
    }

    await page.close();
    session.pages.delete(session.activePageId);

    // Switch to another page if available
    const remainingPages = Array.from(session.pages.entries());
    if (remainingPages.length > 0) {
      session.activePageId = remainingPages[0][0];
    }

    return {
      success: true,
      executionTime: 0,
      pageStateChanged: true
    };
  }

  private async executeSwitchTab(session: PlaywrightSession, action: Action): Promise<ActionResult> {
    const pageId = action.value;
    if (!pageId) {
      return {
        success: false,
        executionTime: 0,
        pageStateChanged: false,
        error: 'No page ID specified for switch_tab'
      };
    }

    if (!session.pages.has(pageId)) {
      return {
        success: false,
        executionTime: 0,
        pageStateChanged: false,
        error: `Page ${pageId} not found`
      };
    }

    session.activePageId = pageId;

    return {
      success: true,
      executionTime: 0,
      pageStateChanged: true
    };
  }

  private async findElement(page: Page, target: any): Promise<string | null> {
    if (target.selector) {
      return target.selector;
    }
    if (target.id) {
      return `#${target.id}`;
    }
    if (target.role) {
      const selector = `[role="${target.role}"]`;
      const exists = await page.$(selector);
      if (exists) return selector;
    }
    if (target.text) {
      // Try to find by text content
      const elements = await page.$$('*');
      for (const el of elements) {
        const text = await el.textContent();
        if (text?.includes(target.text)) {
          const selector = await el.evaluate((e: Element) => {
            if ((e as HTMLElement).id) return `#${(e as HTMLElement).id}`;
            return e.tagName.toLowerCase();
          });
          return selector;
        }
      }
    }
    return null;
  }

  getPages(session: BrowserSession): Promise<PageInfo[]> {
    const ps = session as PlaywrightSession;
    const pages: PageInfo[] = [];

    ps.pages.forEach((page, pageId) => {
      pages.push({
        id: pageId,
        url: page.url(),
        title: page.title(),
        isReady: !page.isClosed()
      });
    });

    return Promise.resolve(pages);
  }

  async switchPage(session: BrowserSession, pageId: string): Promise<void> {
    const ps = session as PlaywrightSession;
    if (!ps.pages.has(pageId)) {
      throw new Error(`Page ${pageId} not found`);
    }
    ps.activePageId = pageId;
  }

  async newPage(session: BrowserSession): Promise<string> {
    const ps = session as PlaywrightSession;
    const page = await ps.context.newPage();
    const pageId = `page_${Date.now()}`;
    ps.pages.set(pageId, page);
    ps.activePageId = pageId;
    return pageId;
  }

  async closePage(session: BrowserSession, pageId: string): Promise<void> {
    const ps = session as PlaywrightSession;
    const page = ps.pages.get(pageId);
    if (page) {
      await page.close();
      ps.pages.delete(pageId);
    }
  }

  async close(session: BrowserSession): Promise<void> {
    const ps = session as PlaywrightSession;

    // Close all pages
    for (const page of ps.pages.values()) {
      try {
        await page.close();
      } catch {
        // Ignore errors during cleanup
      }
    }

    // Close context
    try {
      await ps.context.close();
    } catch {
      // Ignore errors during cleanup
    }

    // Close browser
    try {
      await ps.browser.close();
    } catch {
      // Ignore errors during cleanup
    }
  }

  getBrowserType(): BrowserType {
    return this.browserType;
  }

  private getActivePage(session: PlaywrightSession): Page | null {
    if (!session.activePageId) {
      return null;
    }
    return session.pages.get(session.activePageId) || null;
  }
}
