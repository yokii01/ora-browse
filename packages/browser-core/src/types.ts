/**
 * Core types for ORA Browse browser automation
 */

// Browser types
export type BrowserType = 'chromium' | 'firefox' | 'webkit';

// Bounding box for element positioning
export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

// Viewport configuration
export interface Viewport {
  width: number;
  height: number;
  deviceScaleFactor?: number;
  isMobile?: boolean;
  hasTouch?: boolean;
}

// Browser session configuration
export interface BrowserConfig {
  browserType: BrowserType;
  headless?: boolean;
  viewport?: Viewport;
  userAgent?: string;
  proxy?: ProxyConfig;
  userDataDir?: string;
  timeout?: number;
  downloadPath?: string;
}

// Proxy configuration
export interface ProxyConfig {
  server: string;
  username?: string;
  password?: string;
  bypass?: string;
}

// Normalized element representation
export interface ElementInfo {
  id: string;
  role: string;
  tag: string;
  text: string;
  ariaLabel?: string;
  placeholder?: string;
  value?: string;
  boundingBox?: BoundingBox;
  visible: boolean;
  enabled: boolean;
  clickable: boolean;
  editable: boolean;
  selector: string;
  frameId?: string;
  confidence: number;
  children?: ElementInfo[];
}

// Page observation result
export interface PageObservation {
  url: string;
  title: string;
  elements: ElementInfo[];
  screenshot?: ScreenshotData;
  timestamp: number;
  loading: boolean;
  error?: string;
}

// Screenshot data
export interface ScreenshotData {
  base64: string;
  mimeType: string;
  width: number;
  height: number;
}

// Action types
export type ActionType =
  | 'navigate'
  | 'click'
  | 'type'
  | 'fill'
  | 'press'
  | 'scroll'
  | 'hover'
  | 'select'
  | 'wait'
  | 'extract'
  | 'screenshot'
  | 'upload'
  | 'download'
  | 'switch_tab'
  | 'new_tab'
  | 'close_tab'
  | 'go_back'
  | 'go_forward';

// Element selector
export interface ElementSelector {
  id?: string;
  selector?: string;
  role?: string;
  text?: string;
  frameId?: string;
}

// Action options
export interface ActionOptions {
  delay?: number;
  timeout?: number;
  button?: 'left' | 'middle' | 'right';
  clickCount?: number;
  modifiers?: Array<'Shift' | 'Control' | 'Alt' | 'Meta'>;
  waitForNavigation?: boolean;
  newTab?: boolean;
}

// Standardized action
export interface Action {
  type: ActionType;
  target?: ElementSelector;
  value?: string;
  options?: ActionOptions;
  metadata?: Record<string, unknown>;
}

// Action execution result
export interface ActionResult {
  success: boolean;
  executionTime: number;
  resultingURL?: string;
  pageStateChanged: boolean;
  error?: string;
  screenshotRef?: string;
  extractedData?: unknown;
  newElements?: ElementInfo[];
}

// Verification status
export enum VerificationStatus {
  VERIFIED = 'verified',
  PARTIALLY_VERIFIED = 'partially_verified',
  FAILED = 'failed',
  UNKNOWN = 'unknown'
}

// Verification result
export interface VerificationResult {
  status: VerificationStatus;
  confidence: number;
  evidence: string[];
  discrepancies: string[];
  message?: string;
}

// Task context
export interface TaskContext {
  taskId: string;
  userTask: string;
  subtasks: Subtask[];
  currentSubtaskIndex: number;
  steps: TaskStep[];
  startTime: number;
  endTime?: number;
  status: TaskStatus;
  result?: unknown;
  error?: string;
  browserType: BrowserType;
  sessionId?: string;
}

// Subtask definition
export interface Subtask {
  id: string;
  description: string;
  status: SubtaskStatus;
  completedAt?: number;
  error?: string;
}

// Subtask status
export type SubtaskStatus = 'pending' | 'in_progress' | 'completed' | 'failed' | 'skipped';

// Task step
export interface TaskStep {
  stepNumber: number;
  observation: PageObservation;
  action: Action;
  result: ActionResult;
  verification?: VerificationResult;
  timestamp: number;
  screenshotRef?: string;
  retryCount?: number;
}

// Task status
export type TaskStatus = 'pending' | 'planning' | 'running' | 'completed' | 'failed' | 'cancelled';

// Browser session
export interface BrowserSession {
  id: string;
  browserType: BrowserType;
  pages: PageInfo[];
  activePageId: string;
  config: BrowserConfig;
  createdAt: number;
  lastUsedAt: number;
}

// Page information
export interface PageInfo {
  id: string;
  url: string;
  title: string;
  isReady: boolean;
}

// Workflow definition
export interface Workflow {
  id: string;
  name: string;
  description?: string;
  steps: WorkflowStep[];
  createdAt: number;
  updatedAt: number;
  executionCount: number;
}

// Workflow step
export interface WorkflowStep {
  action: Action;
  expectedState?: ExpectedState;
  fallbackSelectors?: string[];
}

// Expected state for workflow verification
export interface ExpectedState {
  urlPattern?: string;
  elementPresent?: string;
  textContains?: string;
}

// LLM message
export interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// LLM response
export interface LLMResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

// Event types for WebSocket streaming
export type EventType =
  | 'task_started'
  | 'planning'
  | 'browser_started'
  | 'page_loaded'
  | 'observing'
  | 'thinking'
  | 'action_planned'
  | 'action_started'
  | 'action_completed'
  | 'verification_started'
  | 'verification_completed'
  | 'retrying'
  | 'task_completed'
  | 'task_failed';

// WebSocket event
export interface WebSocketEvent<T = unknown> {
  type: EventType;
  payload: T;
  timestamp: number;
  taskId: string;
}

// Security policy
export interface SecurityPolicy {
  domainAllowlist: string[];
  domainBlocklist: string[];
  maxSteps: number;
  maxRetries: number;
  allowedActions: ActionType[];
  downloadAllowed: boolean;
  uploadAllowed: boolean;
}

// Audit log entry
export interface AuditLogEntry {
  id: string;
  eventType: string;
  taskId?: string;
  sessionId?: string;
  details: Record<string, unknown>;
  timestamp: number;
}
