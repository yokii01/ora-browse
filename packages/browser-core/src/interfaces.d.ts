/**
 * Core interfaces for browser adapters
 */
import type { BrowserConfig, BrowserSession, PageObservation, Action, ActionResult, BrowserType } from './types';
/**
 * Browser adapter interface - abstracts browser engine differences
 */
export interface BrowserAdapter {
    /**
     * Launch a new browser session
     */
    launch(config: BrowserConfig): Promise<BrowserSession>;
    /**
     * Navigate to a URL
     */
    navigate(session: BrowserSession, url: string, options?: NavigationOptions): Promise<void>;
    /**
     * Observe the current page state
     */
    observe(session: BrowserSession, options?: ObservationOptions): Promise<PageObservation>;
    /**
     * Execute an action on the browser
     */
    execute(session: BrowserSession, action: Action): Promise<ActionResult>;
    /**
     * Get all open pages/tabs
     */
    getPages(session: BrowserSession): Promise<PageInfo[]>;
    /**
     * Switch to a specific page/tab
     */
    switchPage(session: BrowserSession, pageId: string): Promise<void>;
    /**
     * Create a new page/tab
     */
    newPage(session: BrowserSession): Promise<string>;
    /**
     * Close a specific page/tab
     */
    closePage(session: BrowserSession, pageId: string): Promise<void>;
    /**
     * Close the browser session
     */
    close(session: BrowserSession): Promise<void>;
    /**
     * Get the browser type
     */
    getBrowserType(): BrowserType;
}
/**
 * Navigation options
 */
export interface NavigationOptions {
    timeout?: number;
    waitUntil?: 'load' | 'domcontentloaded' | 'networkidle' | 'commit';
    referer?: string;
}
/**
 * Observation options
 */
export interface ObservationOptions {
    includeScreenshot?: boolean;
    screenshotFullPage?: boolean;
    maxElements?: number;
    includeIframes?: boolean;
    includeShadowDOM?: boolean;
}
/**
 * Page information
 */
export interface PageInfo {
    id: string;
    url: string;
    title: string;
    isReady: boolean;
}
/**
 * Browser adapter factory
 */
export interface BrowserAdapterFactory {
    createAdapter(browserType: string): BrowserAdapter;
    getSupportedBrowsers(): string[];
}
//# sourceMappingURL=interfaces.d.ts.map