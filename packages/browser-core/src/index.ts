/**
 * ORA Browse v1.5 - Core Package Exports
 * Production-ready autonomous AI browser platform
 */

// Canonical public API: enhanced v2 types.
export * from './types-v2';

// Legacy API under a namespace to prevent duplicate root exports.
export * as LegacyTypes from './types';

// Browser adapter interfaces and shared constants.
export * from './interfaces';
export * from './constants';

// Version info
export const VERSION = '1.5.0';
export const PACKAGE_NAME = '@ora/browser-core';
