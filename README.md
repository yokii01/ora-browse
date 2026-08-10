# ORA Browse

**Autonomous AI Browser Platform for Hermes**

ORA Browse is a production-quality open-source browser automation platform designed as the browser-execution engine for the Hermes AI agent. It enables understanding, navigation, interaction, information extraction, multi-step task execution, failure recovery, and task verification.

## Core Philosophy

> **Goal → Plan → Observe → Reason → Act → Observe → Verify → Recover → Complete**

ORA Browse is NOT just "LLM + browser.click()". Every important action includes:
1. **Observation** - Understanding the current page state
2. **Reasoning** - Deciding what to do next
3. **Action Selection** - Choosing the right action
4. **Execution** - Performing the action
5. **Result Inspection** - Checking what happened
6. **Verification** - Confirming the expected outcome
7. **Recovery** - Self-healing when things go wrong

## Features

### Multi-Browser Support
- **Chromium** - Primary automation browser (default)
- **Firefox** - Compatibility/fallback browser
- **WebKit** - Safari/WebKit compatibility testing

All browsers are interchangeable through a unified adapter layer.

### AI-Powered Agent
- Natural language task understanding
- Automatic task decomposition into subtasks
- Page observation and element identification
- Action planning and execution
- Self-healing on failures
- State verification

### Standardized Actions
- `navigate` - Navigate to URLs
- `click` - Click elements
- `type` / `fill` - Input text
- `press` - Press keys
- `scroll` - Scroll pages
- `hover` - Hover over elements
- `select` - Select options
- `wait` - Wait for conditions
- `extract` - Extract structured data
- `screenshot` - Capture screenshots
- `upload` / `download` - File handling
- Tab management (`new_tab`, `close_tab`, `switch_tab`)
- Navigation (`go_back`, `go_forward`)

### Verification Engine
Never trust blind execution. After important actions, verify:
- URL changes
- Expected elements present
- Text content matches
- Form state updated
- Visual confirmation

Verification results: `VERIFIED`, `PARTIALLY_VERIFIED`, `FAILED`, `UNKNOWN`

### Workflow Recording
Turn successful browser tasks into reusable workflows:
1. Record user-performed actions
2. Save with deterministic selectors
3. Replay with AI-powered recovery on failures

### Security First
- Secret isolation (no credentials to LLM)
- Encrypted credential storage
- Domain allowlists/blocklists
- Action permissions
- Session isolation
- Audit logging
- Rate limiting
- SSRF protection

### Multiple Integration Methods
- **REST API** - HTTP endpoints for task execution
- **WebSocket** - Live event streaming
- **MCP** - Model Context Protocol integration for Hermes

## Quick Start

### Prerequisites
- Node.js >= 20
- pnpm >= 9
- Playwright browsers (auto-installed)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/ora-browse.git
cd ora-browse

# Install dependencies
pnpm install

# Install Playwright browsers
pnpm exec playwright install

# Set up environment
cp .env.example .env
# Edit .env with your LLM provider configuration

# Start development
pnpm dev
```

### Basic Usage

#### Via REST API

```bash
curl -X POST http://localhost:3001/api/browser/task \
  -H "Content-Type: application/json" \
  -d '{
    "task": "Find three Data Analyst internships in Chennai",
    "browser": "chromium",
    "maxSteps": 30
  }'
```

#### Via WebSocket

```javascript
const ws = new WebSocket('ws://localhost:3001/ws');

ws.send(JSON.stringify({
  type: 'start_task',
  payload: {
    task: 'Search for Python tutorials on Wikipedia',
    browser: 'chromium'
  }
}));

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Event:', data.type, data.payload);
};
```

#### Programmatically

```typescript
import { AgentRuntime } from '@ora/agent-runtime';
import { BrowserAdapterFactory } from '@ora/browser-adapters';

const runtime = new AgentRuntime({
  llmProvider: 'openai',
  apiKey: process.env.OPENAI_API_KEY
});

const result = await runtime.executeTask({
  task: 'Find the latest news about AI',
  browser: 'chromium',
  maxSteps: 20
});

console.log(result);
```

## Architecture

```
┌─────────────────────────────────────────┐
│           HERMES AGENT                   │
│     (via REST API / MCP / WebSocket)     │
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│              API LAYER                    │
│   REST API │ WebSocket │ MCP Server      │
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│         ORCHESTRATION LAYER              │
│  Task Manager │ Session Manager │ Security│
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│            AGENT RUNTIME                 │
│   Planner │ Action Planner │ Verification│
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│         OBSERVATION ENGINE               │
│  DOM Parser │ A11y Tree │ Element Norm. │
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│           ACTION ENGINE                  │
│   Standardized Actions (click, type...)  │
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│       BROWSER ABSTRACTION LAYER          │
│   BrowserAdapter Interface               │
│   ┌──────────┬──────────┬──────────┐    │
│   │ Chromium │ Firefox  │ WebKit   │    │
│   └──────────┴──────────┴──────────┘    │
│         (Playwright-based)               │
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│         BROWSER ENGINES                  │
│      Chromium │ Firefox │ WebKit        │
└─────────────────────────────────────────┘
```

## Project Structure

```
ora-browse/
├── apps/
│   ├── web/              # React UI application
│   └── api/              # Node.js API server
├── packages/
│   ├── browser-core/     # Core types and interfaces
│   ├── browser-adapters/ # Browser engine adapters
│   ├── agent-runtime/    # Agent execution loop
│   ├── planner/          # Task planning
│   ├── observation/      # Page observation
│   ├── actions/          # Action system
│   ├── verification/     # Verification engine
│   ├── workflow-engine/  # Workflow recording/replay
│   ├── session-manager/  # Browser sessions
│   ├── llm/              # LLM provider abstraction
│   ├── mcp/              # MCP integration
│   ├── security/         # Security layer
│   ├── extraction/       # Information extraction
│   └── shared/           # Shared utilities
├── tests/
│   ├── unit/
│   ├── integration/
│   ├── browser/
│   └── benchmarks/
├── docs/
├── docker/
└── package.json
```

## Configuration

See `.env.example` for all configuration options:

```bash
# LLM Configuration
LLM_PROVIDER=openai
OPENAI_API_KEY=your-api-key-here

# Browser Configuration
DEFAULT_BROWSER=chromium
HEADLESS=true
DEFAULT_VIEWPORT_WIDTH=1280
DEFAULT_VIEWPORT_HEIGHT=720

# Security
DOMAIN_ALLOWLIST=*
MAX_TASK_STEPS=50
MAX_RETRY_ATTEMPTS=3

# API Configuration
API_PORT=3001
```

## API Reference

### REST Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/browser/task` | Execute a browser task |
| GET | `/api/browser/task/:id` | Get task status/result |
| GET | `/api/browser/tasks` | List all tasks |
| DELETE | `/api/browser/task/:id` | Delete a task |
| POST | `/api/browser/task/:id/replay` | Replay a task |
| POST | `/api/browser/workflow` | Create a workflow |
| GET | `/api/browser/workflows` | List workflows |

### WebSocket Events

**Client → Server:**
- `start_task` - Start a new task
- `cancel_task` - Cancel a running task

**Server → Client:**
- `task_started` - Task execution started
- `planning` - Planning subtasks
- `browser_started` - Browser launched
- `page_loaded` - Page loaded
- `observing` - Observing page
- `thinking` - Reasoning about next action
- `action_planned` - Action selected
- `action_started` - Action executing
- `action_completed` - Action finished
- `verification_started` - Verifying result
- `verification_completed` - Verification done
- `retrying` - Retrying failed action
- `task_completed` - Task finished successfully
- `task_failed` - Task failed

### MCP Tools

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

## Testing

```bash
# Run all tests
pnpm test

# Run browser-specific tests
pnpm test:browser:chromium
pnpm test:browser:firefox
pnpm test:browser:webkit

# Run benchmarks
pnpm benchmark
```

## Benchmarks

ORA Browse includes a comprehensive benchmark suite with realistic tasks:
- Google search
- Wikipedia extraction
- E-commerce product search
- Job search
- Documentation research
- Multi-page extraction
- Form interaction
- Pagination handling

Metrics tracked:
- Task Success Rate
- Action Success Rate
- Recovery Rate
- Verification Accuracy
- Average Steps
- Average Latency
- LLM Calls
- Failure Rate

## Contributing

Contributions are welcome! Please read our [Contributing Guide](docs/contributing.md) first.

## License

MIT License - see [LICENSE](LICENSE) for details.

## Acknowledgments

ORA Browse builds on ideas from many excellent open-source projects:
- [Playwright](https://playwright.dev/) - Browser automation
- [Stagehand](https://github.com/aiko-shiki/stagehand) - AI browser agent
- [Browser Use](https://github.com/browser-use/browser-use) - Browser automation concepts
- And many others in the open-source community

---

**ORA Browse** - Built for reliability, autonomy, and verification.
