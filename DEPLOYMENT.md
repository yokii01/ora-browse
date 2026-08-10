# ORA Browse - Deployment Guide

## 🌐 Online Deployment Options

### Option 1: GitHub Pages (Static Frontend)

1. Go to https://github.com/yokii01/ora-browse/settings/pages
2. Under "Source", select "GitHub Actions"
3. The workflow will automatically deploy on every push to master
4. Your site will be available at: `https://yokii01.github.io/ora-browse/`

**Note:** GitHub Pages only hosts the static frontend. You'll need a separate backend deployment.

### Option 2: Vercel (Recommended for Full Stack)

1. Go to https://vercel.com/new
2. Import repository: `https://github.com/yokii01/ora-browse`
3. Configure environment variables:
   ```
   NVIDIA_API_KEY=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
   NVIDIA_BASE_URL=https://integrate.api.nvidia.com/v1
   NVIDIA_MODEL=nvidia/nemotron-3-ultra-550b-a55b
   ```
4. Click Deploy
5. Your app will be live at: `https://ora-browse.vercel.app`

### Option 3: Render.com

1. Go to https://render.com
2. Create new Web Service
3. Connect GitHub repository: `yokii01/ora-browse`
4. Build Command: `pnpm install && pnpm run build`
5. Start Command: `pnpm start`
6. Add environment variables (same as Vercel)
7. Deploy

### Option 4: Railway.app

1. Go to https://railway.app
2. Deploy from GitHub
3. Select `yokii01/ora-browse`
4. Add environment variables
5. Deploy

### Option 5: Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up -d

# Access at http://localhost:3000
```

For cloud deployment with Docker:
- AWS ECS
- Google Cloud Run
- Azure Container Instances
- DigitalOcean App Platform

## 🔑 Required Environment Variables

```env
# NVIDIA NIM Configuration
NVIDIA_API_KEY=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
NVIDIA_BASE_URL=https://integrate.api.nvidia.com/v1
NVIDIA_MODEL=nvidia/nemotron-3-ultra-550b-a55b

# Optional: Alternative LLM Providers
OPENAI_API_KEY=your_key_here
ANTHROPIC_API_KEY=your_key_here

# Server Configuration
PORT=3000
NODE_ENV=production

# Browser Configuration
BROWSER_TYPE=chromium
HEADLESS=true
```

## 🚀 Quick Deploy Commands

### Deploy to Vercel CLI
```bash
npm i -g vercel
vercel login
vercel --prod
```

### Deploy to Render
```bash
# Use render.yaml configuration
# Auto-deploys on git push
```

### Deploy to Fly.io
```bash
flyctl launch
flyctl deploy
```

## 📊 GitHub Actions Status

After pushing, check deployment status:
1. Go to https://github.com/yokii01/ora-browse/actions
2. View CI/CD pipeline results
3. Check Pages deployment under "Deployments"

## 🔗 Live Links (After Deployment)

- **GitHub Repository:** https://github.com/yokii01/ora-browse
- **GitHub Pages:** https://yokii01.github.io/ora-browse/ (frontend only)
- **Vercel:** https://ora-browse.vercel.app (after Vercel deployment)
- **Render:** https://ora-browse.onrender.com (after Render deployment)

## ⚠️ Important Notes

1. **Browser Automation:** Cloud deployments may have restrictions on browser automation. Consider:
   - Using headless browsers
   - Proper user-agent configuration
   - Respecting website terms of service

2. **API Keys:** Never commit API keys to git. Use environment variables or secret managers.

3. **Rate Limiting:** NVIDIA NIM and other APIs have rate limits. Monitor usage.

4. **Security:** Enable CORS properly, use HTTPS, and implement authentication for production.

## 🆘 Troubleshooting

### Build Fails
```bash
pnpm install --frozen-lockfile || pnpm install
pnpm run build
```

### Browser Launch Issues
- Ensure Playwright browsers are installed: `pnpm exec playwright install`
- In Docker, use the provided docker-compose.yml

### API Connection Errors
- Verify NVIDIA_API_KEY is correct
- Check network connectivity to api.nvidia.com
