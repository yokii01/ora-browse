/**
 * ORA Browse v1.5 - Core Package Exports
 * Production-ready autonomous AI browser platform
 */

// Canonical public API: enhanced v2 types only.
export * from './types-v2';

// Browser adapter interfaces (exclude PageInfo which is already in types-v2)
export type {
  BrowserAdapter,
  NavigationOptions,
  ObservationOptions,
  BrowserAdapterFactory
} from './interfaces';

// Re-export non-conflicting values from interfaces
export { } from './interfaces';

// Shared constants
export * from './constants';

// Version info
export const VERSION = '1.5.0';
export const PACKAGE_NAME = '@ora/browser-core';
