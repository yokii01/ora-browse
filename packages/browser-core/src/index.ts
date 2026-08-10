/**
 * ORA Browse v1.5 - Core Package Exports
 * Production-ready autonomous AI browser platform
 */

// Export all types from v2 (enhanced types)
export * from './types-v2';

// Re-export original types for backward compatibility
export * from './types';
export * from './interfaces';
export * from './constants';

// Version info
export const VERSION = '1.5.0';
export const PACKAGE_NAME = '@ora/browser-core';
