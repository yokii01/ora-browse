/**
 * Browser-specific adapters
 */

import { PlaywrightAdapter } from './PlaywrightAdapter';
import type { BrowserType } from '@ora/browser-core';

/**
 * Chromium adapter - optimized for Chrome/Chromium
 */
export class ChromiumAdapter extends PlaywrightAdapter {
  constructor() {
    super('chromium');
  }
}

/**
 * Firefox adapter - optimized for Firefox
 */
export class FirefoxAdapter extends PlaywrightAdapter {
  constructor() {
    super('firefox');
  }
}

/**
 * WebKit adapter - optimized for Safari/WebKit
 */
export class WebKitAdapter extends PlaywrightAdapter {
  constructor() {
    super('webkit');
  }
}

/**
 * Browser adapter factory
 */
export class BrowserAdapterFactory {
  static createAdapter(browserType: string): PlaywrightAdapter {
    switch (browserType.toLowerCase()) {
      case 'firefox':
        return new FirefoxAdapter();
      case 'webkit':
        return new WebKitAdapter();
      case 'chromium':
      default:
        return new ChromiumAdapter();
    }
  }

  static getSupportedBrowsers(): string[] {
    return ['chromium', 'firefox', 'webkit'];
  }
}
