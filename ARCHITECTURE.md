# ORA Browse — Architecture & Implementation Plan

## Executive Summary

ORA Browse is a production-quality autonomous AI browser platform designed as the browser-execution engine for the Hermes AI agent. It enables understanding, navigation, interaction, information extraction, multi-step task execution, failure recovery, and task verification.

## Core Design Principles

1. **Goal → Plan → Observe → Reason → Act → Observe → Verify → Recover → Complete**
2. Never blindly execute LLM-generated clicks
3. Every important action has observation, reasoning, execution, and verification
4. Prefer deterministic actions; use AI only where reasoning is required
5. Browser engine is interchangeable; all operations go through abstraction layer
6. Security-first: no credentials to LLM, domain policies, session isolation
7. Open-source-first, locally runnable, no mandatory paid cloud services

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         HERMES AGENT                             │
│                    (via REST API / MCP / WebSocket)              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API LAYER                                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │ REST API    │  │ WebSocket   │  │ MCP Server              │  │
│  │ /browser/*  │  │ Event Stream│  │ browser_* tools         │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    ORCHESTRATION LAYER                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │ Task        │  │ Session     │  │ Security                │  │
│  │ Manager     │  │ Manager     │  │ Policy Engine           │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     AGENT RUNTIME                                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │ Planner     │  │ Action      │  │ Verification            │  │
│  │ (Task       │  │ Planner     │  │ Engine                  │  │
│  │  Decomposition)│ │ (Select    │  │ (State Validation)      │  │
│  └─────────────┘  │  Actions)   │  └─────────────────────────┘  │
│                   └─────────────┘                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   OBSERVATION ENGINE                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │ DOM Parser  │  │ Accessibility│  │ Element                │  │
│  │             │  │ Tree Reader │  │ Normalizer              │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
│  ┌─────────────┐  ┌─────────────┐                               │
│  │ Screenshot  │  │ Page State  │                               │
│  │ Capture     │  │ Extractor   │                               │
│  └─────────────┘  └─────────────┘                               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    ACTION ENGINE                                 │
│  Standardized Actions: click, type, navigate, scroll, etc.      │
│  Each action: Plan → Execute → Result → Verify                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                 BROWSER ABSTRACTION LAYER                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │ Browser     │  │ Chromium    │  │ FirefoxAdapter          │  │
│  │ Adapter     │──│ Adapter     │  │ WebKitAdapter           │  │
│  │ Interface   │  │             │  │                         │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
│                    (Playwright-based)                            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BROWSER ENGINES                               │
│         Chromium │ Firefox │ WebKit                              │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                   SUPPORTING SERVICES                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │ LLM         │  │ Workflow    │  │ History &               │  │
│  │ Provider    │  │ Recorder    │  │ Telemetry               │  │
│  │ Abstraction │  │ Engine      │  │                         │  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Project Structure

```
ora-browse/
├── apps/
│   ├── web/                          # React UI application
│   │   ├── src/
│   │   │   ├── components/           # UI components
│   │   │   ├── pages/                # Application pages
│   │   │   ├── hooks/                # React hooks
│   │   │   ├── stores/               # State management
│   │   │   └── utils/                # Frontend utilities
│   │   ├── package.json
│   │   └── vite.config.js
│   │
│   └── api/                          # Node.js API server
│       ├── src/
│       │   ├── routes/               # REST API routes
│       │   ├── websocket/            # WebSocket handlers
│       │   ├── mcp/                  # MCP server
│       │   └── middleware/           # Auth, security, logging
│       ├── package.json
│       └── server.js
│
├── packages/
│   ├── browser-core/                 # Core browser interfaces
│   │   ├── src/
│   │   │   ├── types.ts              # TypeScript types
│   │   │   ├── interfaces.ts         # Core interfaces
│   │   │   └── constants.ts          # Constants
│   │   └── package.json
│   │
│   ├── browser-adapters/             # Browser engine adapters
│   │   ├── src/
│   │   │   ├── BrowserAdapter.ts     # Base adapter interface
│   │   │   ├── PlaywrightAdapter.ts  # Playwright implementation
│   │   │   ├── ChromiumAdapter.ts    # Chromium-specific
│   │   │   ├── FirefoxAdapter.ts     # Firefox-specific
│   │   │   └── WebKitAdapter.ts      # WebKit-specific
│   │   └── package.json
│   │
│   ├── agent-runtime/                # Agent runtime engine
│   │   ├── src/
│   │   │   ├── AgentRuntime.ts       # Main agent loop
│   │   │   ├── TaskContext.ts        # Task state management
│   │   │   └── ExecutionEngine.ts    # Action execution
│   │   └── package.json
│   │
│   ├── planner/                      # Task planning
│   │   ├── src/
│   │   │   ├── Planner.ts            # Task decomposition
│   │   │   ├── SubtaskManager.ts     # Subtask tracking
│   │   │   └── strategies/           # Planning strategies
│   │   └── package.json
│   │
│   ├── observation/                  # Page observation
│   │   ├── src/
│   │   │   ├── ObservationEngine.ts  # Main observation
│   │   │   ├── DOMParser.ts          # DOM extraction
│   │   │   ├── AccessibilityTree.ts  # A11y tree reading
│   │   │   ├── ElementNormalizer.ts  # Element normalization
│   │   │   └── ScreenshotCapture.ts  # Screenshots
│   │   └── package.json
│   │
│   ├── actions/                      # Action system
│   │   ├── src/
│   │   │   ├── ActionSchema.ts       # Action definitions
│   │   │   ├── ActionExecutor.ts     # Action execution
│   │   │   ├── actions/              # Individual actions
│   │   │   │   ├── click.ts
│   │   │   │   ├── type.ts
│   │   │   │   ├── navigate.ts
│   │   │   │   ├── scroll.ts
│   │   │   │   └── ...
│   │   │   └── ActionResult.ts       # Result types
│   │   └── package.json
│   │
│   ├── verification/                 # Verification engine
│   │   ├── src/
│   │   │   ├── VerificationEngine.ts # Main verification
│   │   │   ├── validators/           # State validators
│   │   │   └── VerifierConfig.ts     # Verification config
│   │   └── package.json
│   │
│   ├── workflow-engine/              # Workflow recording/replay
│   │   ├── src/
│   │   │   ├── WorkflowRecorder.ts   # Record workflows
│   │   │   ├── WorkflowPlayer.ts     # Replay workflows
│   │   │   ├── DeterministicExecutor.ts
│   │   │   └── AIRecovery.ts         # AI-based recovery
│   │   └── package.json
│   │
│   ├── session-manager/              # Browser session management
│   │   ├── src/
│   │   │   ├── SessionManager.ts     # Session lifecycle
│   │   │   ├── BrowserProfile.ts     # Browser profiles
│   │   │   ├── CookieManager.ts      # Cookie handling
│   │   │   └── StorageManager.ts     # Local/session storage
│   │   └── package.json
│   │
│   ├── llm/                          # LLM provider abstraction
│   │   ├── src/
│   │   │   ├── LLMProvider.ts        # Provider interface
│   │   │   ├── OpenAIAdapter.ts      # OpenAI-compatible
│   │   │   ├── LocalModelAdapter.ts  # Local models
│   │   │   └── OpenRouterAdapter.ts  # OpenRouter
│   │   └── package.json
│   │
│   ├── mcp/                          # MCP integration
│   │   ├── src/
│   │   │   ├── MCPServer.ts          # MCP server
│   │   │   ├── Tools.ts              # MCP tools
│   │   │   └── Protocol.ts           # MCP protocol
│   │   └── package.json
│   │
│   ├── security/                     # Security layer
│   │   ├── src/
│   │   │   ├── PolicyEngine.ts       # Domain policies
│   │   │   ├── SecretIsolation.ts    # Credential protection
│   │   │   ├── AuditLogger.ts        # Audit logging
│   │   │   └── RateLimiter.ts        # Rate limiting
│   │   └── package.json
│   │
│   ├── extraction/                   # Information extraction
│   │   ├── src/
│   │   │   ├── ExtractionEngine.ts   # Structured extraction
│   │   │   ├── SchemaValidator.ts    # Output validation
│   │   │   └── transformers/         # Data transformers
│   │   └── package.json
│   │
│   └── shared/                       # Shared utilities
│       ├── src/
│       │   ├── logger.ts             # Logging
│       │   ├── events.ts             # Event system
│       │   ├── retry.ts              # Retry logic
│       │   ├── telemetry.ts          # Observability
│       │   └── utils.ts              # Common utilities
│       └── package.json
│
├── tests/
│   ├── unit/                         # Unit tests
│   ├── integration/                  # Integration tests
│   ├── browser/                      # Browser tests
│   │   ├── chromium/
│   │   ├── firefox/
│   │   └── webkit/
│   └── benchmarks/                   # Agent benchmarks
│       ├── scenarios/                # Test scenarios
│       └── runner.ts                 # Benchmark runner
│
├── docs/
│   ├── architecture.md
│   ├── api-reference.md
│   ├── getting-started.md
│   ├── workflows.md
│   └── security.md
│
├── docker/
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── browser-deps.sh
│
├── package.json                      # Root package (monorepo)
├── pnpm-workspace.yaml               # pnpm workspace config
├── tsconfig.base.json                # Base TypeScript config
├── .env.example                      # Environment template
├── README.md                         # Project documentation
└── LICENSE                           # Open source license
```

---

## Component Specifications

### 1. Browser-Core Package

**Purpose**: Define core interfaces and types used across all packages.

**Key Interfaces**:
- `BrowserSession` - Browser session representation
- `PageState` - Current page state
- `ElementInfo` - Normalized element representation
- `ActionResult` - Action execution result
- `TaskContext` - Task execution context

### 2. Browser-Adapters Package

**Purpose**: Abstract browser engine differences.

**Architecture**:
```typescript
interface BrowserAdapter {
  launch(config: BrowserConfig): Promise<BrowserSession>;
  navigate(session: BrowserSession, url: string): Promise<void>;
  observe(session: BrowserSession): Promise<PageObservation>;
  execute(session: BrowserSession, action: Action): Promise<ActionResult>;
  close(session: BrowserSession): Promise<void>;
}

class PlaywrightAdapter implements BrowserAdapter {
  // Playwright-based implementation
}

class ChromiumAdapter extends PlaywrightAdapter {
  // Chromium-specific optimizations
}

class FirefoxAdapter extends PlaywrightAdapter {
  // Firefox-specific handling
}

class WebKitAdapter extends PlaywrightAdapter {
  // WebKit-specific handling
}
```

### 3. Agent-Runtime Package

**Purpose**: Main agent execution loop.

**Agent Loop**:
```
1. Receive task
2. Create TaskContext
3. Initialize browser session
4. LOOP:
   a. Observe current page state
   b. Check if task complete
   c. Plan next action(s)
   d. Execute action
   e. Verify result
   f. Handle failures (retry/recover)
   g. Update task state
5. Cleanup session
6. Return result
```

### 4. Planner Package

**Purpose**: Decompose complex tasks into subtasks.

**Planning Strategies**:
- Linear planning (sequential steps)
- Branching planning (conditional paths)
- Parallel planning (independent subtasks)
- Search-based planning (explore then extract)

### 5. Observation Engine

**Purpose**: Extract structured page information efficiently.

**Observation Pipeline**:
```
1. Get accessibility tree (preferred)
2. Parse interactive elements
3. Extract visible text
4. Identify element roles/labels
5. Normalize element representations
6. Optionally capture screenshot
7. Compile compact representation for LLM
```

**Element Representation**:
```typescript
interface ElementInfo {
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
}
```

### 6. Actions Package

**Purpose**: Define and execute standardized browser actions.

**Action Schema**:
```typescript
interface Action {
  type: ActionType;
  target?: ElementSelector;
  value?: string;
  options?: ActionOptions;
}

type ActionType =
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

interface ActionResult {
  success: boolean;
  executionTime: number;
  resultingURL?: string;
  pageStateChanged: boolean;
  error?: string;
  screenshotRef?: string;
  extractedData?: any;
}
```

### 7. Verification Engine

**Purpose**: Validate that actions achieved intended results.

**Verification Types**:
- URL verification (expected URL pattern)
- DOM verification (expected elements present)
- Text verification (expected text content)
- State verification (form submitted, item added)
- Screenshot verification (visual comparison)

**Verification Result**:
```typescript
enum VerificationStatus {
  VERIFIED = 'verified',
  PARTIALLY_VERIFIED = 'partially_verified',
  FAILED = 'failed',
  UNKNOWN = 'unknown'
}

interface VerificationResult {
  status: VerificationStatus;
  confidence: number;
  evidence: string[];
  discrepancies: string[];
}
```

### 8. Workflow Engine

**Purpose**: Record and replay browser workflows.

**Workflow Recording**:
```
1. User initiates recording
2. Capture each action with context
3. Store selectors + fallbacks
4. Save workflow definition
```

**Workflow Replay**:
```
1. Load workflow
2. Execute deterministically
3. On failure:
   a. Attempt selector recovery
   b. If fails, invoke AI recovery
   c. Update workflow if successful
4. Report result
```

### 9. Session Manager

**Purpose**: Manage browser sessions securely.

**Features**:
- Isolated browser contexts
- Persistent sessions (cookies, storage)
- Multiple tabs/pages per session
- Browser profiles
- Proxy configuration
- Incognito/private contexts

### 10. LLM Provider

**Purpose**: Abstract model providers.

**Supported Providers**:
- OpenAI-compatible APIs
- Local models (Ollama, LM Studio)
- OpenRouter
- Configurable custom providers

**Model Separation**:
- Planner model (reasoning)
- Action model (selection)
- Extraction model (structured output)
- Verification model (validation)

### 11. MCP Integration

**Purpose**: Enable Hermes integration via MCP.

**MCP Tools**:
- `browser_open` - Open browser session
- `browser_navigate` - Navigate to URL
- `browser_click` - Click element
- `browser_type` - Type text
- `browser_scroll` - Scroll page
- `browser_extract` - Extract data
- `browser_screenshot` - Capture screenshot
- `browser_tabs` - Manage tabs
- `browser_wait` - Wait for condition
- `browser_download` - Download file
- `browser_upload` - Upload file
- `browser_execute_task` - Execute natural language task

### 12. Security Layer

**Purpose**: Protect sensitive data and enforce policies.

**Security Features**:
- Secret isolation (no credentials to LLM)
- Encrypted credential storage
- Domain allowlists/blocklists
- Action permissions
- Download/upload restrictions
- Session isolation
- Audit logging
- Rate limiting
- SSRF protection
- Safe URL validation

### 13. Observability

**Purpose**: Complete execution tracing.

**Traced Events**:
- Task lifecycle (started, planning, completed, failed)
- Browser events (launched, navigated, loaded)
- Observation events (observing, elements found)
- Action events (planned, started, completed, failed)
- Verification events (started, completed, result)
- Recovery events (retrying, recovered, gave up)

**Stored Data**:
- Structured logs
- Screenshots at key points
- Timing information
- Errors and stack traces
- Browser console errors
- Network errors

---

## API Contracts

### REST API

```
POST /api/browser/task
{
  "task": "Find three Data Analyst internships in Chennai",
  "browser": "chromium",
  "maxSteps": 30,
  "timeout": 300000,
  "options": {
    "viewport": { "width": 1280, "height": 720 },
    "proxy": "...",
    "userAgent": "...",
    "headless": true
  }
}

Response:
{
  "taskId": "uuid",
  "status": "completed|running|failed",
  "result": { ... },
  "steps": [ ... ],
  "evidence": [ ... ],
  "screenshots": [ ... ]
}

GET /api/browser/task/:id
GET /api/browser/tasks
DELETE /api/browser/task/:id
POST /api/browser/task/:id/replay
POST /api/browser/task/:id/export
```

### WebSocket Events

```
Client → Server:
{ "type": "start_task", payload: { ... } }
{ "type": "cancel_task", payload: { taskId } }

Server → Client:
{ "type": "task_started", payload: { taskId, timestamp } }
{ "type": "planning", payload: { plan, subtasks } }
{ "type": "browser_started", payload: { browser, session } }
{ "type": "page_loaded", payload: { url, title } }
{ "type": "observing", payload: { elementsCount } }
{ "type": "thinking", payload: { reasoning } }
{ "type": "action_planned", payload: { action } }
{ "type": "action_started", payload: { action } }
{ "type": "action_completed", payload: { result } }
{ "type": "verification_started", payload: { checks } }
{ "type": "verification_completed", payload: { status } }
{ "type": "retrying", payload: { attempt, reason } }
{ "type": "task_completed", payload: { result } }
{ "type": "task_failed", payload: { error, lastStep } }
```

---

## Database Schema (SQLite for local storage)

```sql
-- Tasks
CREATE TABLE tasks (
  id TEXT PRIMARY KEY,
  user_task TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  browser TEXT NOT NULL,
  status TEXT NOT NULL,
  duration_ms INTEGER,
  result JSON,
  verification_status TEXT,
  error TEXT
);

-- Task Steps
CREATE TABLE task_steps (
  id TEXT PRIMARY KEY,
  task_id TEXT REFERENCES tasks(id),
  step_number INTEGER,
  action_type TEXT,
  action_data JSON,
  result JSON,
  verification_status TEXT,
  screenshot_path TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Workflows
CREATE TABLE workflows (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  steps JSON NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP,
  execution_count INTEGER DEFAULT 0
);

-- Sessions
CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  profile_name TEXT,
  browser_type TEXT,
  cookies_encrypted BLOB,
  local_storage_encrypted BLOB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_used_at TIMESTAMP
);

-- Audit Log
CREATE TABLE audit_log (
  id TEXT PRIMARY KEY,
  event_type TEXT,
  task_id TEXT,
  session_id TEXT,
  details JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Implementation Phases

### Phase 1: Foundation (Week 1)
- [ ] Set up monorepo structure
- [ ] Implement browser-core types
- [ ] Implement browser-adapters (Playwright base)
- [ ] Basic navigation and observation
- [ ] Simple action executor

### Phase 2: Agent Runtime (Week 2)
- [ ] Agent execution loop
- [ ] Planner implementation
- [ ] Verification engine
- [ ] Self-healing/retry logic
- [ ] Session manager

### Phase 3: API & Integration (Week 3)
- [ ] REST API
- [ ] WebSocket streaming
- [ ] MCP server
- [ ] LLM provider abstraction
- [ ] Security layer

### Phase 4: UI (Week 4)
- [ ] Main application layout
- [ ] Live browser view
- [ ] Agent activity panel
- [ ] Task history
- [ ] Settings

### Phase 5: Advanced Features (Week 5)
- [ ] Workflow recorder
- [ ] Information extraction
- [ ] Multi-tab support
- [ ] File handling
- [ ] iframe/shadow DOM

### Phase 6: Testing & Hardening (Week 6)
- [ ] Unit tests
- [ ] Integration tests
- [ ] Browser compatibility tests
- [ ] Benchmark suite
- [ ] Performance optimization
- [ ] Security review

---

## Risk Analysis

### Technical Risks
1. **Browser compatibility**: Different browsers may render/behavior differently
   - Mitigation: Thorough testing, browser-specific adapters

2. **Dynamic websites**: Modern sites change frequently
   - Mitigation: Robust selectors, AI recovery, visual matching

3. **Rate limits/blocks**: Websites may block automation
   - Mitigation: Respect robots.txt, rate limiting, proper user agents

4. **LLM reliability**: Models may produce incorrect actions
   - Mitigation: Verification layer, deterministic preferences, bounded retries

5. **Memory/performance**: Long-running sessions may leak
   - Mitigation: Session cleanup, memory monitoring, resource limits

### Security Risks
1. **Credential exposure**: Accidental sending to LLM
   - Mitigation: Secret isolation, prompt sanitization

2. **SSRF**: Arbitrary URL access
   - Mitigation: URL validation, domain policies

3. **Malicious downloads**: Untrusted file downloads
   - Mitigation: Download restrictions, sandboxing

4. **Session hijacking**: Unauthorized session access
   - Mitigation: Session isolation, authentication

---

## Success Metrics

### Reliability
- Task Success Rate > 85%
- Action Success Rate > 95%
- Recovery Rate > 70%
- Verification Accuracy > 90%

### Performance
- Average Steps per Task < 15
- Average Latency per Step < 3s
- LLM Calls per Task < 10
- Memory Usage < 500MB per session

### Quality
- Zero critical security vulnerabilities
- Full test coverage for core modules
- Documentation completeness > 90%
- Cross-browser compatibility (Chromium, Firefox, WebKit)

---

## Next Steps

1. Initialize monorepo with pnpm workspaces
2. Set up TypeScript configuration
3. Implement browser-core package
4. Implement browser-adapters with Playwright
5. Build basic agent runtime
6. Create API server
7. Build UI
8. Add tests and benchmarks
9. Document thoroughly
10. Release as open source
