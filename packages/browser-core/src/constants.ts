/**
 * Constants for ORA Browse
 */

import type { BrowserConfig, Viewport } from './types';

/**
 * Default browser configuration
 */
export const DEFAULT_BROWSER_CONFIG: BrowserConfig = {
  browserType: 'chromium',
  headless: true,
  viewport: {
    width: 1280,
    height: 720,
    deviceScaleFactor: 1,
    isMobile: false,
    hasTouch: false
  },
  timeout: 30000
};

/**
 * Default viewport settings
 */
export const DEFAULT_VIEWPORT: Viewport = {
  width: 1280,
  height: 720,
  deviceScaleFactor: 1,
  isMobile: false,
  hasTouch: false
};

/**
 * Supported browser types
 */
export const SUPPORTED_BROWSERS = ['chromium', 'firefox', 'webkit'] as const;

/**
 * Action type descriptions
 */
export const ACTION_DESCRIPTIONS: Record<string, string> = {
  navigate: 'Navigate to a URL',
  click: 'Click on an element',
  type: 'Type text into an input',
  fill: 'Fill an input with value',
  press: 'Press a key',
  scroll: 'Scroll the page',
  hover: 'Hover over an element',
  select: 'Select an option',
  wait: 'Wait for a condition',
  extract: 'Extract structured data',
  screenshot: 'Capture a screenshot',
  upload: 'Upload a file',
  download: 'Download a file',
  switch_tab: 'Switch to a different tab',
  new_tab: 'Open a new tab',
  close_tab: 'Close the current tab',
  go_back: 'Navigate back',
  go_forward: 'Navigate forward'
};

/**
 * Element roles that are typically interactive
 */
export const INTERACTIVE_ROLES = [
  'button',
  'link',
  'checkbox',
  'radio',
  'textbox',
  'combobox',
  'listbox',
  'menuitem',
  'tab',
  'switch',
  'slider',
  'spinbutton'
];

/**
 * Interactive HTML tags
 */
export const INTERACTIVE_TAGS = [
  'a',
  'button',
  'input',
  'select',
  'textarea',
  'summary',
  'details'
];

/**
 * Maximum retry attempts for actions
 */
export const MAX_RETRY_ATTEMPTS = 3;

/**
 * Default action timeout in milliseconds
 */
export const DEFAULT_ACTION_TIMEOUT = 10000;

/**
 * Default navigation timeout in milliseconds
 */
export const DEFAULT_NAVIGATION_TIMEOUT = 30000;

/**
 * Default observation timeout in milliseconds
 */
export const DEFAULT_OBSERVATION_TIMEOUT = 15000;

/**
 * Role mappings from ARIA to human-readable
 */
export const ROLE_MAPPINGS: Record<string, string> = {
  button: 'Button',
  link: 'Link',
  checkbox: 'Checkbox',
  radio: 'Radio button',
  textbox: 'Text input',
  combobox: 'Dropdown',
  listbox: 'List box',
  menuitem: 'Menu item',
  tab: 'Tab',
  tabpanel: 'Tab panel',
  dialog: 'Dialog',
  alert: 'Alert',
  status: 'Status message',
  log: 'Log',
  marquee: 'Marquee',
  timer: 'Timer',
  tree: 'Tree',
  treeitem: 'Tree item',
  grid: 'Grid',
  gridcell: 'Grid cell',
  row: 'Row',
  rowgroup: 'Row group',
  columnheader: 'Column header',
  rowheader: 'Row header',
  table: 'Table',
  list: 'List',
  listitem: 'List item',
  menu: 'Menu',
  menubar: 'Menu bar',
  separator: 'Separator',
  heading: 'Heading',
  img: 'Image',
  figure: 'Figure',
  caption: 'Caption',
  code: 'Code',
  mark: 'Marked text',
  strong: 'Strong emphasis',
  emphasis: 'Emphasis',
  deletion: 'Deleted text',
  insertion: 'Inserted text',
  paragraph: 'Paragraph',
  blockquote: 'Quote',
  note: 'Note',
  searchbox: 'Search box',
  spinbutton: 'Spin button',
  slider: 'Slider',
  scrollbar: 'Scrollbar',
  switch: 'Switch',
  toggle: 'Toggle',
  tooltip: 'Tooltip',
  progressbar: 'Progress bar',
  meter: 'Meter',
  form: 'Form',
  search: 'Search',
  navigation: 'Navigation',
  main: 'Main content',
  complementary: 'Sidebar',
  contentinfo: 'Footer',
  banner: 'Banner',
  region: 'Section',
  article: 'Article',
  application: 'Application',
  document: 'Document',
  presentation: 'Presentation',
  none: 'No role'
};

/**
 * Key mappings for press action
 */
export const KEY_MAPPINGS: Record<string, string> = {
  Enter: 'Enter',
  Space: 'Space',
  ArrowUp: 'ArrowUp',
  ArrowDown: 'ArrowDown',
  ArrowLeft: 'ArrowLeft',
  ArrowRight: 'ArrowRight',
  Escape: 'Escape',
  Tab: 'Tab',
  Backspace: 'Backspace',
  Delete: 'Delete',
  Home: 'Home',
  End: 'End',
  PageUp: 'PageUp',
  PageDown: 'PageDown',
  F1: 'F1',
  F2: 'F2',
  F3: 'F3',
  F4: 'F4',
  F5: 'F5',
  F6: 'F6',
  F7: 'F7',
  F8: 'F8',
  F9: 'F9',
  F10: 'F10',
  F11: 'F11',
  F12: 'F12'
};

/**
 * Wait conditions
 */
export const WAIT_CONDITIONS = [
  'networkidle',
  'domcontentloaded',
  'load',
  'visible',
  'hidden',
  'enabled',
  'disabled'
] as const;

/**
 * Screenshot MIME types
 */
export const SCREENSHOT_MIME_TYPES = {
  png: 'image/png',
  jpeg: 'image/jpeg'
} as const;
