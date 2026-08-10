/**
 * ORA Browse v1.5 - Enhanced Core Types
 * Production-ready autonomous AI browser platform
 */

// ============================================================================
// BROWSER TYPES & CONFIGURATION
// ============================================================================

export type BrowserType = 'chromium' | 'firefox' | 'webkit';
export type BrowserChannel = 'chrome' | 'chrome-beta' | 'msedge' | 'msedge-beta' | 'msedge-dev';
export type DeviceEmulation = 'iPhone' | 'iPad' | 'Pixel' | 'Galaxy' | 'custom';

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Viewport {
  width: number;
  height: number;
  deviceScaleFactor?: number;
  isMobile?: boolean;
  hasTouch?: boolean;
}

export interface BrowserConfig {
  browserType: BrowserType;
  channel?: BrowserChannel;
  headless?: boolean | 'new';
  viewport?: Viewport;
  userAgent?: string;
  proxy?: ProxyConfig;
  userDataDir?: string;
  timeout?: number;
  downloadPath?: string;
  locale?: string;
  timezoneId?: string;
  geolocation?: Geolocation;
  permissions?: string[];
  colorScheme?: 'light' | 'dark' | 'no-preference';
  reducedMotion?: 'reduce' | 'no-preference';
  forcedColors?: 'active' | 'none' | 'no-preference';
  recordHar?: HarOptions;
  recordVideo?: VideoOptions;
  tracing?: TracingOptions;
  serviceWorkers?: 'allow' | 'block';
  ignoreHTTPSErrors?: boolean;
  javaScriptEnabled?: boolean;
  bypassCSP?: boolean;
  isPersistent?: boolean;
  slowMo?: number;
  devtools?: boolean;
  env?: Record<string, string>;
  extraHttpHeaders?: Record<string, string>;
  httpCredentials?: HttpCredentials;
  storageState?: StorageState;
}

export interface ProxyConfig {
  server: string;
  username?: string;
  password?: string;
  bypass?: string;
}

export interface Geolocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export interface HarOptions {
  path: string;
  content?: 'embed' | 'attach' | 'omit';
  mode?: 'full' | 'minimal';
  urlFilter?: RegExp | string;
}

export interface VideoOptions {
  dir: string;
  size?: { width: number; height: number };
}

export interface TracingOptions {
  screenshots?: boolean;
  snapshots?: boolean;
  sources?: boolean;
  title?: string;
}

export interface HttpCredentials {
  username: string;
  password: string;
  origin?: string;
}

export interface StorageState {
  cookies: Cookie[];
  origins: OriginStorage[];
}

export interface Cookie {
  name: string;
  value: string;
  domain: string;
  path: string;
  expires?: number;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: 'Strict' | 'Lax' | 'None';
}

export interface OriginStorage {
  origin: string;
  localStorage: { name: string; value: string }[];
}

// ============================================================================
// ELEMENT INFORMATION & OBSERVATION
// ============================================================================

export interface ElementInfo {
  id: string;
  role: string;
  tag: string;
  text: string;
  ariaLabel?: string;
  ariaDescription?: string;
  ariaRoleDescription?: string;
  placeholder?: string;
  value?: string;
  boundingBox?: BoundingBox;
  visible: boolean;
  enabled: boolean;
  clickable: boolean;
  editable: boolean;
  selector: string;
  xpath?: string;
  cssSelector?: string;
  frameId?: string;
  confidence: number;
  children?: ElementInfo[];
  attributes?: Record<string, string>;
  styles?: Partial<CSSStyleDeclaration>;
  tabIndex?: number;
  accessKey?: string;
  lang?: string;
  dir?: 'ltr' | 'rtl';
  isShadowRoot?: boolean;
  shadowHostSelector?: string;
  inputType?: string;
  checked?: boolean;
  selected?: boolean;
  disabled?: boolean;
  required?: boolean;
  readOnly?: boolean;
  multiple?: boolean;
  options?: SelectOption[];
  src?: string;
  alt?: string;
  href?: string;
  target?: string;
  rel?: string;
  title?: string;
  name?: string;
  id_attr?: string;
  class?: string;
  dataAttributes?: Record<string, string>;
  innerText?: string;
  innerHTML?: string;
  outerHTML?: string;
}

export interface SelectOption {
  value: string;
  label: string;
  index: number;
  selected: boolean;
  disabled: boolean;
}

export interface PageObservation {
  url: string;
  title: string;
  elements: ElementInfo[];
  interactiveElements: ElementInfo[];
  screenshot?: ScreenshotData;
  accessibilityTree?: AccessibilityNode;
  timestamp: number;
  loading: boolean;
  loadState: LoadState;
  error?: string;
  consoleMessages: ConsoleMessage[];
  networkRequests: NetworkRequest[];
  domVersion: number;
  scrollPosition: ScrollPosition;
  viewportRatio: number;
  elementCount: number;
  interactiveElementCount: number;
  formFields: FormField[];
  links: LinkInfo[];
  images: ImageInfo[];
  headings: HeadingInfo[];
  tables: TableInfo[];
  iframes: FrameInfo[];
  metadata: PageMetadata;
}

export interface AccessibilityNode {
  role: string;
  name?: string;
  description?: string;
  value?: string | number;
  checked?: boolean;
  pressed?: boolean;
  expanded?: boolean;
  selected?: boolean;
  focused?: boolean;
  hidden?: boolean;
  disabled?: boolean;
  required?: boolean;
  invalid?: boolean;
  autocomplete?: string;
  hasPopup?: string;
  level?: number;
  multiline?: boolean;
  readonly?: boolean;
  children?: AccessibilityNode[];
}

export interface LoadState {
  domContentLoaded: boolean;
  load: boolean;
  networkIdle: boolean;
}

export interface ConsoleMessage {
  type: 'log' | 'debug' | 'info' | 'error' | 'warning' | 'dir' | 'dirxml' | 'table' | 'clear' | 'startGroup' | 'startGroupCollapsed' | 'endGroup' | 'assert' | 'profile' | 'profileEnd' | 'count' | 'timeEnd';
  text: string;
  args: string[];
  location: {
    url: string;
    lineNumber: number;
    columnNumber: number;
  };
  timestamp: number;
}

export interface NetworkRequest {
  url: string;
  method: string;
  status?: number;
  statusText?: string;
  headers?: Record<string, string>;
  postData?: string;
  resourceType: string;
  timing?: NetworkTiming;
  error?: string;
}

export interface NetworkTiming {
  startTime: number;
  domainLookupStart: number;
  domainLookupEnd: number;
  connectStart: number;
  connectEnd: number;
  requestStart: number;
  responseStart: number;
  responseEnd: number;
}

export interface ScreenshotData {
  base64: string;
  mimeType: string;
  width: number;
  height: number;
  fullPage?: boolean;
  clip?: BoundingBox;
  quality?: number;
  omitBackground?: boolean;
  scale?: 'css' | 'device';
  caret?: 'hide' | 'initial';
  animations?: 'disabled' | 'allow';
}

export interface ScrollPosition {
  scrollX: number;
  scrollY: number;
  scrollHeight: number;
  scrollWidth: number;
  clientHeight: number;
  clientWidth: number;
}

export interface FormField {
  id: string;
  name: string;
  type: string;
  label?: string;
  placeholder?: string;
  value?: string;
  required: boolean;
  disabled: boolean;
  selector: string;
}

export interface LinkInfo {
  id: string;
  text: string;
  href: string;
  title?: string;
  target?: string;
  rel?: string;
  selector: string;
  isExternal: boolean;
}

export interface ImageInfo {
  id: string;
  src: string;
  alt?: string;
  title?: string;
  width?: number;
  height?: number;
  naturalWidth?: number;
  naturalHeight?: number;
  selector: string;
  loading: 'eager' | 'lazy';
}

export interface HeadingInfo {
  id: string;
  level: number;
  text: string;
  selector: string;
}

export interface TableInfo {
  id: string;
  rows: number;
  columns: number;
  headers: string[];
  selector: string;
  caption?: string;
}

export interface FrameInfo {
  id: string;
  name?: string;
  url: string;
  title?: string;
  selector: string;
  contentFrameId?: string;
}

export interface PageMetadata {
  description?: string;
  keywords?: string;
  author?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterCard?: string;
  canonicalUrl?: string;
  language?: string;
  charset?: string;
  generator?: string;
  publishedTime?: string;
  modifiedTime?: string;
}

// ============================================================================
// ACTION SYSTEM
// ============================================================================

export type ActionType =
  | 'navigate'
  | 'click'
  | 'dblclick'
  | 'rightclick'
  | 'type'
  | 'fill'
  | 'press'
  | 'scroll'
  | 'scrollIntoView'
  | 'hover'
  | 'select'
  | 'deselect'
  | 'check'
  | 'uncheck'
  | 'wait'
  | 'waitForLoad'
  | 'waitForNetwork'
  | 'waitForSelector'
  | 'waitForText'
  | 'waitForNavigation'
  | 'extract'
  | 'screenshot'
  | 'fullPageScreenshot'
  | 'elementScreenshot'
  | 'upload'
  | 'download'
  | 'switch_tab'
  | 'new_tab'
  | 'close_tab'
  | 'close_other_tabs'
  | 'go_back'
  | 'go_forward'
  | 'refresh'
  | 'stop'
  | 'evaluate'
  | 'injectScript'
  | 'setCookie'
  | 'deleteCookie'
  | 'clearCookies'
  | 'getCookies'
  | 'setLocalStorage'
  | 'getSessionStorage'
  | 'clearLocalStorage'
  | 'clearSessionStorage'
  | 'dragAndDrop'
  | 'focus'
  | 'blur'
  | 'selectText'
  | 'copyToClipboard'
  | 'pasteFromClipboard'
  | 'printToPdf'
  | 'emulateDevice'
  | 'emulateTimezone'
  | 'emulateLocale'
  | 'emulateGeolocation'
  | 'emulatePermissions'
  | 'setOffline'
  | 'setCacheEnabled'
  | 'setJavaScriptEnabled'
  | 'setUserAgent'
  | 'setExtraHttpHeaders'
  | 'authenticate'
  | 'interceptRequest'
  | 'mockResponse'
  | 'throttleNetwork'
  | 'throttleCPU'
  | 'startTracing'
  | 'stopTracing'
  | 'startRecording'
  | 'stopRecording'
  | 'highlightElement'
  | 'flashElement'
  | 'markElement'
  | 'compareScreenshots'
  | 'visualRegression'
  | 'accessibilityScan'
  | 'performanceMetrics'
  | 'lighthouseAudit'
  | 'seoAudit'
  | 'securityAudit';

export interface ElementSelector {
  selector?: string;
  xpath?: string;
  text?: string;
  role?: string;
  ariaLabel?: string;
  placeholder?: string;
  id?: string;
  index?: number;
  frameId?: string;
  strategy?: 'css' | 'xpath' | 'text' | 'role' | 'aria' | 'vision' | 'accessibility';
  strict?: boolean;
  timeout?: number;
}

export interface ActionOptions {
  delay?: number;
  timeout?: number;
  button?: 'left' | 'middle' | 'right';
  clickCount?: number;
  modifiers?: Array<'Shift' | 'Control' | 'Alt' | 'Meta'>;
  waitForNavigation?: boolean;
  waitUntil?: LoadStateEnum;
  newTab?: boolean;
  download?: boolean;
  upload?: boolean;
  noWaitAfter?: boolean;
  trial?: boolean;
  force?: boolean;
  position?: { x: number; y: number };
  scrollIntoView?: boolean;
  animate?: boolean;
  duration?: number;
  easing?: 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';
}

export type LoadStateEnum = 'load' | 'domcontentloaded' | 'networkidle' | 'commit';

export interface Action {
  id: string;
  type: ActionType;
  target?: ElementSelector;
  value?: string;
  values?: string[];
  options?: ActionOptions;
  metadata?: Record<string, unknown>;
  description?: string;
  expectedOutcome?: string;
  retryStrategy?: RetryStrategy;
  fallbackActions?: Action[];
  preConditions?: PreCondition[];
  postConditions?: PostCondition[];
}

export interface RetryStrategy {
  maxRetries: number;
  backoffMultiplier: number;
  minDelay: number;
  maxDelay: number;
  retryOnErrors?: string[];
  exponentialBackoff?: boolean;
}

export interface PreCondition {
  type: 'elementVisible' | 'elementEnabled' | 'urlMatches' | 'textPresent' | 'cookieExists' | 'localStorageValue';
  selector?: string;
  value?: string;
  timeout?: number;
}

export interface PostCondition {
  type: 'urlChanged' | 'elementAppeared' | 'elementDisappeared' | 'textChanged' | 'navigationOccurred';
  selector?: string;
  value?: string;
  timeout?: number;
}

export interface ActionResult {
  success: boolean;
  executionTime: number;
  resultingURL?: string;
  pageStateChanged: boolean;
  error?: string;
  errorCode?: string;
  screenshotRef?: string;
  extractedData?: unknown;
  newElements?: ElementInfo[];
  actionId: string;
  retriesAttempted: number;
  warnings?: string[];
  performanceMetrics?: PerformanceMetrics;
  accessibilityIssues?: AccessibilityIssue[];
}

export interface PerformanceMetrics {
  fps?: number;
  cpuUsage?: number;
  jsHeapSize?: number;
  documentLoadTime?: number;
  domContentLoadedTime?: number;
  firstContentfulPaint?: number;
  largestContentfulPaint?: number;
  cumulativeLayoutShift?: number;
  totalBlockingTime?: number;
  timeToInteractive?: number;
}

export interface AccessibilityIssue {
  severity: 'critical' | 'serious' | 'moderate' | 'minor';
  rule: string;
  description: string;
  helpUrl: string;
  nodes: {
    selector: string;
    snippet?: string;
  }[];
}

// ============================================================================
// VERIFICATION SYSTEM
// ============================================================================

export enum VerificationStatus {
  VERIFIED = 'verified',
  PARTIALLY_VERIFIED = 'partially_verified',
  FAILED = 'failed',
  UNKNOWN = 'unknown',
  TIMEOUT = 'timeout',
  CANCELLED = 'cancelled',
}

export interface VerificationResult {
  status: VerificationStatus;
  confidence: number;
  evidence: EvidenceItem[];
  discrepancies: Discrepancy[];
  message?: string;
  verificationMethod: VerificationMethod;
  timestamp: number;
  duration: number;
}

export interface EvidenceItem {
  type: 'screenshot' | 'dom_snapshot' | 'text' | 'url' | 'element' | 'accessibility' | 'network';
  data: string | unknown;
  relevance: number;
  timestamp: number;
}

export interface Discrepancy {
  expected: string;
  actual: string;
  severity: 'critical' | 'major' | 'minor';
  field: string;
}

export type VerificationMethod = 'dom_check' | 'visual_check' | 'accessibility_check' | 'network_check' | 'combined';

export interface VerificationCriteria {
  urlPattern?: string;
  elementPresent?: string;
  elementAbsent?: string;
  textContains?: string[];
  textNotContains?: string[];
  statusCode?: number;
  responseTime?: number;
  screenshotSimilarity?: number;
  accessibilityScore?: number;
}

// ============================================================================
// TASK & PLANNING
// ============================================================================

export interface TaskContext {
  taskId: string;
  userTask: string;
  originalTask: string;
  subtasks: Subtask[];
  currentSubtaskIndex: number;
  steps: TaskStep[];
  startTime: number;
  endTime?: number;
  status: TaskStatus;
  result?: unknown;
  structuredResult?: StructuredResult;
  error?: string;
  browserType: BrowserType;
  sessionId?: string;
  userId?: string;
  priority: TaskPriority;
  tags: string[];
  metadata: Record<string, unknown>;
  parentTaskId?: string;
  childTaskIds: string[];
  dependencies: string[];
  allowedDomains: string[];
  blockedDomains: string[];
  maxSteps: number;
  maxRetries: number;
  budget?: TaskBudget;
}

export interface TaskBudget {
  maxTokens: number;
  maxLLMCalls: number;
  maxDuration: number;
  maxSteps: number;
}

export interface StructuredResult {
  items: Record<string, unknown>[];
  summary?: string;
  statistics?: Record<string, number>;
  errors?: string[];
  warnings?: string[];
  sources?: string[];
  extractionSchema?: Record<string, unknown>;
}

export interface Subtask {
  id: string;
  description: string;
  status: SubtaskStatus;
  completedAt?: number;
  error?: string;
  steps: TaskStep[];
  startedAt?: number;
  retryCount: number;
  skippedReason?: string;
}

export type SubtaskStatus = 'pending' | 'in_progress' | 'completed' | 'failed' | 'skipped' | 'blocked';

export interface TaskStep {
  stepNumber: number;
  observation: PageObservation;
  reasoning?: ReasoningSummary;
  action: Action;
  result: ActionResult;
  verification?: VerificationResult;
  timestamp: number;
  screenshotRef?: string;
  retryCount?: number;
  llmCallId?: string;
  tokenUsage?: TokenUsage;
  duration: number;
  alternativeActionsConsidered?: AlternativeAction[];
}

export interface ReasoningSummary {
  summary: string;
  keyObservations: string[];
  decisionFactors: string[];
  confidence: number;
}

export interface AlternativeAction {
  action: Action;
  score: number;
  reason: string;
}

export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  cachedTokens?: number;
}

export type TaskStatus = 
  | 'pending' 
  | 'planning' 
  | 'running' 
  | 'paused' 
  | 'resuming'
  | 'completed' 
  | 'failed' 
  | 'cancelled'
  | 'timeout'
  | 'blocked';

export type TaskPriority = 'low' | 'normal' | 'high' | 'critical';

// ============================================================================
// BROWSER SESSION MANAGEMENT
// ============================================================================

export interface BrowserSession {
  id: string;
  browserType: BrowserType;
  channel?: BrowserChannel;
  pages: PageInfo[];
  activePageId: string;
  config: BrowserConfig;
  createdAt: number;
  lastUsedAt: number;
  status: SessionStatus;
  profileId?: string;
  storageState?: StorageState;
  contextId?: string;
  processId?: number;
  wsEndpoint?: string;
  metrics: SessionMetrics;
  extensions?: string[];
  plugins?: PluginInfo[];
}

export type SessionStatus = 'initializing' | 'ready' | 'busy' | 'error' | 'closed' | 'crashed';

export interface SessionMetrics {
  totalTasks: number;
  successfulTasks: number;
  failedTasks: number;
  totalSteps: number;
  averageStepDuration: number;
  memoryUsage: number;
  cpuUsage: number;
  uptime: number;
  crashCount: number;
}

export interface PageInfo {
  id: string;
  url: string;
  title: string;
  isReady: boolean;
  favicon?: string;
  loadedAt?: number;
  securityOrigin?: string;
}

export interface PluginInfo {
  name: string;
  version: string;
  enabled: boolean;
  path?: string;
}

// ============================================================================
// WORKFLOW ENGINE
// ============================================================================

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  version: string;
  steps: WorkflowStep[];
  createdAt: number;
  updatedAt: number;
  createdBy?: string;
  executionCount: number;
  successRate: number;
  averageDuration: number;
  tags: string[];
  category?: WorkflowCategory;
  isPublic: boolean;
  variables: WorkflowVariable[];
  triggers: WorkflowTrigger[];
  parameters: WorkflowParameter[];
  outputSchema?: Record<string, unknown>;
}

export type WorkflowCategory = 
  | 'data_extraction' 
  | 'form_filling' 
  | 'testing' 
  | 'monitoring' 
  | 'research'
  | 'ecommerce'
  | 'social_media'
  | 'automation'
  | 'custom';

export interface WorkflowStep {
  id: string;
  action: Action;
  expectedState?: ExpectedState;
  fallbackSelectors?: string[];
  recoveryStrategy?: RecoveryStrategy;
  condition?: StepCondition;
  loop?: LoopConfig;
  parallel?: boolean;
  timeout?: number;
  retryConfig?: RetryConfig;
  outputs?: OutputMapping[];
}

export interface ExpectedState {
  urlPattern?: string;
  elementPresent?: string;
  elementAbsent?: string;
  textContains?: string;
  textEquals?: string;
  statusCode?: number;
  responseTime?: number;
  screenshotHash?: string;
}

export interface RecoveryStrategy {
  type: 'retry' | 'fallback' | 'skip' | 'abort' | 'ai_heal';
  maxAttempts: number;
  fallbackActions?: Action[];
  aiHealingPrompt?: string;
}

export interface StepCondition {
  type: 'always' | 'if' | 'unless' | 'while' | 'forEach';
  expression?: string;
  selector?: string;
  value?: string;
}

export interface LoopConfig {
  type: 'fixed' | 'until' | 'forEach' | 'while';
  count?: number;
  selector?: string;
  condition?: string;
  variable?: string;
}

export interface RetryConfig {
  maxRetries: number;
  delay: number;
  backoffMultiplier: number;
  retryOn?: string[];
}

export interface OutputMapping {
  name: string;
  source: 'action_result' | 'extraction' | 'expression';
  selector?: string;
  expression?: string;
}

export interface WorkflowVariable {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  defaultValue?: unknown;
  required: boolean;
  description?: string;
}

export interface WorkflowTrigger {
  type: 'manual' | 'schedule' | 'webhook' | 'event';
  schedule?: string;
  webhookUrl?: string;
  event?: string;
}

export interface WorkflowParameter {
  name: string;
  type: string;
  required: boolean;
  defaultValue?: unknown;
  description?: string;
  validation?: ValidationRule[];
}

export interface ValidationRule {
  type: 'min' | 'max' | 'pattern' | 'enum' | 'required';
  value?: unknown;
  message?: string;
}

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  status: ExecutionStatus;
  startedAt: number;
  completedAt?: number;
  result?: unknown;
  error?: string;
  stepsExecuted: number;
  stepsTotal: number;
  triggeredBy: string;
  parameters: Record<string, unknown>;
  logs: ExecutionLog[];
}

export type ExecutionStatus = 'pending' | 'running' | 'completed' | 'failed' | 'paused' | 'cancelled';

export interface ExecutionLog {
  timestamp: number;
  level: 'debug' | 'info' | 'warn' | 'error';
  stepId?: string;
  message: string;
  data?: unknown;
}

// ============================================================================
// LLM & AI INTEGRATION
// ============================================================================

export interface LLMProvider {
  id: string;
  name: string;
  type: LLMProviderType;
  baseUrl?: string;
  apiKey?: string;
  models: LLMModel[];
  capabilities: LLMSapabilities;
  rateLimits?: RateLimit;
}

export type LLMProviderType = 'openai' | 'anthropic' | 'google' | 'azure' | 'local' | 'openrouter' | 'ollama' | 'vllm' | 'custom';

export interface LLMModel {
  id: string;
  name: string;
  contextWindow: number;
  maxOutputTokens: number;
  supportsVision: boolean;
  supportsFunctionCalling: boolean;
  supportsStructuredOutput: boolean;
  costPerInputToken?: number;
  costPerOutputToken?: number;
}

export interface LLMSapabilities {
  chatCompletion: boolean;
  completion: boolean;
  embedding: boolean;
  vision: boolean;
  functionCalling: boolean;
  structuredOutput: boolean;
  streaming: boolean;
}

export interface RateLimit {
  requestsPerMinute: number;
  tokensPerMinute: number;
  burstLimit: number;
}

export interface LLMMessage {
  role: 'system' | 'user' | 'assistant' | 'tool' | 'function';
  content: string | LLMContentPart[];
  name?: string;
  toolCallId?: string;
  toolCalls?: ToolCall[];
}

export interface LLMContentPart {
  type: 'text' | 'image_url' | 'input_image';
  text?: string;
  image_url?: { url: string; detail?: 'auto' | 'low' | 'high' };
}

export interface ToolCall {
  id: string;
  type: 'function';
  function: {
    name: string;
    arguments: string;
  };
}

export interface LLMResponse {
  content: string;
  toolCalls?: ToolCall[];
  finishReason?: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    cachedTokens?: number;
  };
  model?: string;
  systemFingerprint?: string;
}

export interface LLMConfig {
  model: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  stop?: string[];
  responseFormat?: ResponseFormat;
  tools?: ToolDefinition[];
  toolChoice?: 'auto' | 'none' | 'required' | { type: 'function'; function: { name: string } };
}

export interface ResponseFormat {
  type: 'text' | 'json_object' | 'json_schema';
  json_schema?: Record<string, unknown>;
}

export interface ToolDefinition {
  type: 'function';
  function: {
    name: string;
    description: string;
    parameters: Record<string, unknown>;
    strict?: boolean;
  };
}

// ============================================================================
// MCP (MODEL CONTEXT PROTOCOL)
// ============================================================================

export interface MCPServer {
  name: string;
  version: string;
  tools: MCPTool[];
  resources?: MCPResource[];
  prompts?: MCPPrompt[];
}

export interface MCPTool {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  handler: (args: Record<string, unknown>) => Promise<MCPToolResult>;
}

export interface MCPToolResult {
  success: boolean;
  content: MCPContent[];
  error?: string;
}

export interface MCPContent {
  type: 'text' | 'image' | 'resource';
  text?: string;
  data?: string;
  mimeType?: string;
  resource?: {
    uri: string;
    mimeType: string;
  };
}

export interface MCPResource {
  uri: string;
  name: string;
  description?: string;
  mimeType: string;
}

export interface MCPPrompt {
  name: string;
  description: string;
  arguments?: MCPPromptArgument[];
  template: string;
}

export interface MCPPromptArgument {
  name: string;
  description: string;
  required: boolean;
  default?: string;
}

// ============================================================================
// EVENTS & STREAMING
// ============================================================================

export type EventType =
  | 'task_started'
  | 'planning_started'
  | 'planning_completed'
  | 'browser_started'
  | 'browser_ready'
  | 'page_loaded'
  | 'page_navigation'
  | 'observing'
  | 'observation_completed'
  | 'thinking'
  | 'reasoning_completed'
  | 'action_planned'
  | 'action_started'
  | 'action_completed'
  | 'action_failed'
  | 'verification_started'
  | 'verification_completed'
  | 'retrying'
  | 'retry_exhausted'
  | 'task_completed'
  | 'task_failed'
  | 'task_paused'
  | 'task_resumed'
  | 'task_cancelled'
  | 'workflow_started'
  | 'workflow_step'
  | 'workflow_completed'
  | 'workflow_failed'
  | 'session_created'
  | 'session_closed'
  | 'session_error'
  | 'error'
  | 'warning'
  | 'progress'
  | 'log';

export interface WebSocketEvent<T = unknown> {
  id: string;
  type: EventType;
  payload: T;
  timestamp: number;
  taskId?: string;
  sessionId?: string;
  workflowId?: string;
  stepNumber?: number;
}

export interface ProgressPayload {
  current: number;
  total: number;
  percentage: number;
  message: string;
  stage: string;
}

export interface ErrorPayload {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  stack?: string;
}

// ============================================================================
// SECURITY & POLICIES
// ============================================================================

export interface SecurityPolicy {
  id: string;
  name: string;
  domainAllowlist: string[];
  domainBlocklist: string[];
  urlPatterns: URLPattern[];
  maxSteps: number;
  maxRetries: number;
  maxDuration: number;
  allowedActions: ActionType[];
  blockedActions: ActionType[];
  downloadAllowed: boolean;
  downloadExtensions: string[];
  uploadAllowed: boolean;
  uploadExtensions: string[];
  maxDownloadSize: number;
  maxUploadSize: number;
  requireConfirmation: ActionType[];
  auditLogging: boolean;
  sensitiveDataProtection: boolean;
  credentialMasking: boolean;
  rateLimiting: RateLimitConfig;
  ipRestrictions: IPRestriction[];
  timeRestrictions: TimeRestriction[];
}

export interface URLPattern {
  pattern: string;
  action: 'allow' | 'block' | 'warn';
  methods?: string[];
}

export interface RateLimitConfig {
  requestsPerSecond: number;
  requestsPerMinute: number;
  requestsPerHour: number;
  burstSize: number;
}

export interface IPRestriction {
  cidr: string;
  action: 'allow' | 'block';
}

export interface TimeRestriction {
  daysOfWeek: number[];
  startTime: string;
  endTime: string;
  timezone: string;
  action: 'allow' | 'block';
}

export interface AuditLogEntry {
  id: string;
  eventType: string;
  taskId?: string;
  sessionId?: string;
  workflowId?: string;
  userId?: string;
  action?: string;
  target?: string;
  result: 'success' | 'failure' | 'blocked' | 'warning';
  details: Record<string, unknown>;
  metadata: Record<string, unknown>;
  timestamp: number;
  ipAddress?: string;
  userAgent?: string;
}

export interface SecretStore {
  id: string;
  name: string;
  type: 'environment' | 'vault' | 'aws_secrets' | 'gcp_secret_manager' | 'azure_key_vault';
  secrets: SecretEntry[];
}

export interface SecretEntry {
  key: string;
  encryptedValue: string;
  createdAt: number;
  updatedAt: number;
  expiresAt?: number;
  rotationPolicy?: RotationPolicy;
}

export interface RotationPolicy {
  interval: number;
  autoRotate: boolean;
  notificationEmail?: string;
}

// ============================================================================
// EXTRACTION & SCHEMA
// ============================================================================

export interface ExtractionSchema {
  name: string;
  description?: string;
  fields: FieldSchema[];
  itemSelector?: string;
  pagination?: PaginationConfig;
  transformations?: Transformation[];
  validation?: ValidationRule[];
}

export interface FieldSchema {
  name: string;
  type: FieldType;
  selector?: string;
  extractors: Extractor[];
  required: boolean;
  multiple?: boolean;
  defaultValue?: unknown;
  transformations?: Transformation[];
  validation?: ValidationRule[];
  description?: string;
}

export type FieldType = 'string' | 'number' | 'boolean' | 'date' | 'datetime' | 'email' | 'url' | 'phone' | 'currency' | 'percentage' | 'array' | 'object' | 'html' | 'markdown' | 'json';

export interface Extractor {
  type: 'text' | 'attribute' | 'html' | 'regex' | 'xpath' | 'computed';
  attribute?: string;
  regex?: string;
  expression?: string;
  group?: number;
}

export interface Transformation {
  type: 'trim' | 'lowercase' | 'uppercase' | 'capitalize' | 'replace' | 'remove' | 'split' | 'join' | 'parseDate' | 'parseNumber' | 'currency' | 'template' | 'conditional' | 'lookup';
  params?: Record<string, unknown>;
}

export interface PaginationConfig {
  type: 'scroll' | 'click' | 'url' | 'api';
  nextSelector?: string;
  urlTemplate?: string;
  maxPages?: number;
  stopCondition?: string;
  delay?: number;
}

export interface ExtractedData {
  schema: ExtractionSchema;
  items: Record<string, unknown>[];
  metadata: ExtractionMetadata;
  errors: ExtractionError[];
  warnings: string[];
}

export interface ExtractionMetadata {
  sourceUrl: string;
  extractedAt: number;
  itemCount: number;
  pageCount: number;
  duration: number;
  selectors: string[];
}

export interface ExtractionError {
  field?: string;
  itemIndex?: number;
  error: string;
  value?: unknown;
}

// ============================================================================
// UTILITIES & HELPERS
// ============================================================================

export interface CacheEntry<T> {
  key: string;
  value: T;
  createdAt: number;
  expiresAt?: number;
  hits: number;
  lastAccessedAt: number;
}

export interface CacheConfig {
  maxSize: number;
  defaultTTL: number;
  evictionPolicy: 'lru' | 'lfu' | 'fifo';
}

export interface QueueItem<T> {
  id: string;
  data: T;
  priority: number;
  createdAt: number;
  maxRetries: number;
  retryCount: number;
  timeout?: number;
}

export interface QueueConfig {
  concurrency: number;
  timeout: number;
  retryDelay: number;
  maxRetries: number;
}

export interface HealthCheck {
  status: 'healthy' | 'degraded' | 'unhealthy';
  checks: HealthCheckItem[];
  timestamp: number;
  uptime: number;
  version: string;
}

export interface HealthCheckItem {
  name: string;
  status: 'pass' | 'fail' | 'warn';
  message?: string;
  latency?: number;
}

export interface Metrics {
  timestamp: number;
  counters: Record<string, number>;
  gauges: Record<string, number>;
  histograms: Record<string, HistogramData>;
  summaries: Record<string, SummaryData>;
}

export interface HistogramData {
  count: number;
  sum: number;
  buckets: { [key: number]: number };
}

export interface SummaryData {
  count: number;
  sum: number;
  quantiles: { [key: number]: number };
}

// ============================================================================
// DEPRECATED TYPES (for backward compatibility)
// ============================================================================

/** @deprecated Use ElementInfo instead */
export type ElementData = ElementInfo;

/** @deprecated Use PageObservation instead */
export type ObservationResult = PageObservation;

/** @deprecated Use TaskContext instead */
export type Task = TaskContext;
