/**
 * Constants for ORA Browse
 */
import type { BrowserConfig, Viewport } from './types';
/**
 * Default browser configuration
 */
export declare const DEFAULT_BROWSER_CONFIG: BrowserConfig;
/**
 * Default viewport settings
 */
export declare const DEFAULT_VIEWPORT: Viewport;
/**
 * Supported browser types
 */
export declare const SUPPORTED_BROWSERS: readonly ["chromium", "firefox", "webkit"];
/**
 * Action type descriptions
 */
export declare const ACTION_DESCRIPTIONS: Record<string, string>;
/**
 * Element roles that are typically interactive
 */
export declare const INTERACTIVE_ROLES: string[];
/**
 * Interactive HTML tags
 */
export declare const INTERACTIVE_TAGS: string[];
/**
 * Maximum retry attempts for actions
 */
export declare const MAX_RETRY_ATTEMPTS = 3;
/**
 * Default action timeout in milliseconds
 */
export declare const DEFAULT_ACTION_TIMEOUT = 10000;
/**
 * Default navigation timeout in milliseconds
 */
export declare const DEFAULT_NAVIGATION_TIMEOUT = 30000;
/**
 * Default observation timeout in milliseconds
 */
export declare const DEFAULT_OBSERVATION_TIMEOUT = 15000;
/**
 * Role mappings from ARIA to human-readable
 */
export declare const ROLE_MAPPINGS: Record<string, string>;
/**
 * Key mappings for press action
 */
export declare const KEY_MAPPINGS: Record<string, string>;
/**
 * Wait conditions
 */
export declare const WAIT_CONDITIONS: readonly ["networkidle", "domcontentloaded", "load", "visible", "hidden", "enabled", "disabled"];
/**
 * Screenshot MIME types
 */
export declare const SCREENSHOT_MIME_TYPES: {
    readonly png: "image/png";
    readonly jpeg: "image/jpeg";
};
//# sourceMappingURL=constants.d.ts.map