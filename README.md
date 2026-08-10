# ORA Browse v1.5.0 🌐

**Autonomous AI Browser Platform powered by NVIDIA NIM**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub Stars](https://img.shields.io/github/stars/yokii01/ora-browse)](https://github.com/yokii01/ora-browse)
[![CI/CD](https://github.com/yokii01/ora-browse/actions/workflows/ci.yml/badge.svg)](https://github.com/yokii01/ora-browse/actions)
[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yokii01/ora-browse)

## 🚀 Live Demo

**Coming Soon:** Deploy this repository to get your live instance!

- **GitHub Repository:** https://github.com/yokii01/ora-browse
- **GitHub Pages:** https://yokii01.github.io/ora-browse/ (after enabling in Settings → Pages)
- **Vercel Deploy:** [Click here to deploy](https://vercel.com/new/clone?repository-url=https://github.com/yokii01/ora-browse&env=NVIDIA_API_KEY,NVIDIA_BASE_URL,NVIDIA_MODEL)

## ✨ Features

### 🧠 AI-Powered Browser Automation
- **NVIDIA Nemotron-3-Ultra-550B** integration for intelligent task planning
- Autonomous task execution with self-healing capabilities
- Multi-step browser workflow automation
- Smart element identification and interaction

### 🌍 Multi-Browser Support
- Chromium (default)
- Firefox
- WebKit

### 🔧 172+ Modular Packages
- Browser core & adapters
- Agent runtime & planner
- Observation & verification engines
- Workflow recording & replay
- Security & session management
- MCP protocol support
- LLM abstractions

### 📊 Key Capabilities
- Natural language task understanding
- Page observation & element extraction
- Action planning & execution
- Verification & recovery
- Tab management
- File uploads/downloads
- Screenshot capture
- Structured data extraction
- Shadow DOM & iframe handling

## 🏃 Quick Start

### Local Development

```bash
git clone https://github.com/yokii01/ora-browse.git
cd ora-browse
pnpm install
pnpm run dev
```

### Environment Setup

Create `.env` file:

```env
NVIDIA_API_KEY=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
NVIDIA_BASE_URL=https://integrate.api.nvidia.com/v1
NVIDIA_MODEL=nvidia/nemotron-3-ultra-550b-a55b
PORT=3000
```

### Install Playwright Browsers

```bash
pnpm exec playwright install
```

## ☁️ Deploy Online

### Option 1: Vercel (Recommended)

1. Click [Deploy to Vercel](https://vercel.com/new/clone?repository-url=https://github.com/yokii01/ora-browse)
2. Add environment variables
3. Deploy!

Your live URL: `https://ora-browse.vercel.app`

### Option 2: GitHub Pages + Backend

1. Go to Settings → Pages
2. Enable GitHub Actions deployment
3. Deploy backend separately (Render, Railway, etc.)

Your live URL: `https://yokii01.github.io/ora-browse/`

### Option 3: Docker

```bash
docker-compose up -d
```

Access at: `http://localhost:3000`

### Other Platforms

- **Render:** https://render.com
- **Railway:** https://railway.app
- **Fly.io:** https://fly.io

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## 📦 Architecture

```
ora-browse/
├── apps/
│   ├── api/          # REST API & WebSocket server
│   └── web/          # React frontend
├── packages/
│   ├── browser-core/         # Core types & interfaces
│   ├── browser-adapters/     # Playwright adapters
│   ├── agent-runtime/        # AI agent engine
│   ├── planner/              # Task planning
│   ├── observation/          # Page observation
│   ├── actions/              # Browser actions
│   ├── verification/         # Result verification
│   ├── extraction/           # Data extraction
│   ├── workflow-engine/      # Workflow recording
│   ├── session-manager/      # Browser sessions
│   ├── security/             # Security modules
│   ├── llm/                  # LLM providers (NVIDIA NIM)
│   ├── mcp/                  # MCP protocol
│   └── ... (160+ more packages)
└── tests/
```

## 🛠️ Usage Examples

### Via API

```bash
curl -X POST http://localhost:3000/browser/task \
  -H "Content-Type: application/json" \
  -d '{
    "task": "Find Data Analyst internships in Chennai",
    "browser": "chromium",
    "max_steps": 30
  }'
```

### Via UI

1. Open the web interface
2. Enter your task in natural language
3. Select browser (Chromium/Firefox/WebKit)
4. Click "Run"
5. Watch live execution with verification

### Programmatic Usage

```typescript
import { createBrowser } from '@ora/browser-adapters';
import { AgentRuntime } from '@ora/agent-runtime';

const browser = await createBrowser('chromium');
const agent = new AgentRuntime({
  browser,
  llmProvider: 'nvidia',
  model: 'nvidia/nemotron-3-ultra-550b-a55b'
});

const result = await agent.executeTask(
  'Extract top 5 products from example.com'
);
```

## 🔗 Links

- **Repository:** https://github.com/yokii01/ora-browse
- **Issues:** https://github.com/yokii01/ora-browse/issues
- **Documentation:** See `/docs` folder
- **Architecture:** [ARCHITECTURE.md](./ARCHITECTURE.md)
- **Deployment:** [DEPLOYMENT.md](./DEPLOYMENT.md)

## 📄 License

MIT License - see [LICENSE](./LICENSE) file

## 🤝 Contributing

Contributions welcome! Please read our contributing guidelines.

## 🙏 Acknowledgments

Built with inspiration from:
- Playwright
- Stagehand
- Browser Use concepts
- NVIDIA NIM

---

**ORA Browse** - Where autonomous AI meets reliable browser automation.

Made with ❤️ by yokii01
