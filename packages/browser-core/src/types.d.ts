/**
 * Core types for ORA Browse browser automation
 */
export type BrowserType = 'chromium' | 'firefox' | 'webkit';
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
    headless?: boolean;
    viewport?: Viewport;
    userAgent?: string;
    proxy?: ProxyConfig;
    userDataDir?: string;
    timeout?: number;
    downloadPath?: string;
}
export interface ProxyConfig {
    server: string;
    username?: string;
    password?: string;
    bypass?: string;
}
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
export interface PageObservation {
    url: string;
    title: string;
    elements: ElementInfo[];
    screenshot?: ScreenshotData;
    timestamp: number;
    loading: boolean;
    error?: string;
}
export interface ScreenshotData {
    base64: string;
    mimeType: string;
    width: number;
    height: number;
}
export type ActionType = 'navigate' | 'click' | 'type' | 'fill' | 'press' | 'scroll' | 'hover' | 'select' | 'wait' | 'extract' | 'screenshot' | 'upload' | 'download' | 'switch_tab' | 'new_tab' | 'close_tab' | 'go_back' | 'go_forward';
export interface ElementSelector {
    id?: string;
    selector?: string;
    role?: string;
    text?: string;
    frameId?: string;
}
export interface ActionOptions {
    delay?: number;
    timeout?: number;
    button?: 'left' | 'middle' | 'right';
    clickCount?: number;
    modifiers?: Array<'Shift' | 'Control' | 'Alt' | 'Meta'>;
    waitForNavigation?: boolean;
    newTab?: boolean;
}
export interface Action {
    type: ActionType;
    target?: ElementSelector;
    value?: string;
    options?: ActionOptions;
    metadata?: Record<string, unknown>;
}
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
export declare enum VerificationStatus {
    VERIFIED = "verified",
    PARTIALLY_VERIFIED = "partially_verified",
    FAILED = "failed",
    UNKNOWN = "unknown"
}
export interface VerificationResult {
    status: VerificationStatus;
    confidence: number;
    evidence: string[];
    discrepancies: string[];
    message?: string;
}
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
export interface Subtask {
    id: string;
    description: string;
    status: SubtaskStatus;
    completedAt?: number;
    error?: string;
}
export type SubtaskStatus = 'pending' | 'in_progress' | 'completed' | 'failed' | 'skipped';
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
export type TaskStatus = 'pending' | 'planning' | 'running' | 'completed' | 'failed' | 'cancelled';
export interface BrowserSession {
    id: string;
    browserType: BrowserType;
    pages: PageInfo[];
    activePageId: string;
    config: BrowserConfig;
    createdAt: number;
    lastUsedAt: number;
}
export interface PageInfo {
    id: string;
    url: string;
    title: string;
    isReady: boolean;
}
export interface Workflow {
    id: string;
    name: string;
    description?: string;
    steps: WorkflowStep[];
    createdAt: number;
    updatedAt: number;
    executionCount: number;
}
export interface WorkflowStep {
    action: Action;
    expectedState?: ExpectedState;
    fallbackSelectors?: string[];
}
export interface ExpectedState {
    urlPattern?: string;
    elementPresent?: string;
    textContains?: string;
}
export interface LLMMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}
export interface LLMResponse {
    content: string;
    usage?: {
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
    };
}
export type EventType = 'task_started' | 'planning' | 'browser_started' | 'page_loaded' | 'observing' | 'thinking' | 'action_planned' | 'action_started' | 'action_completed' | 'verification_started' | 'verification_completed' | 'retrying' | 'task_completed' | 'task_failed';
export interface WebSocketEvent<T = unknown> {
    type: EventType;
    payload: T;
    timestamp: number;
    taskId: string;
}
export interface SecurityPolicy {
    domainAllowlist: string[];
    domainBlocklist: string[];
    maxSteps: number;
    maxRetries: number;
    allowedActions: ActionType[];
    downloadAllowed: boolean;
    uploadAllowed: boolean;
}
export interface AuditLogEntry {
    id: string;
    eventType: string;
    taskId?: string;
    sessionId?: string;
    details: Record<string, unknown>;
    timestamp: number;
}
//# sourceMappingURL=types.d.ts.map