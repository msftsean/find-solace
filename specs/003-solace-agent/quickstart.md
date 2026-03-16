# Quickstart: Solace Agent Development

**Feature**: 003-solace-agent | **Date**: 2026-03-15

## Prerequisites

- Azure subscription (Microsoft employee benefits apply)
- GitHub repository: `msftsean/find-solace`
- Domain: `findsolace.io` (owned, DNS accessible)
- Azure CLI installed (`az` command available)
- VS Code with Live Server extension (for local development)

## Azure Resources to Provision

### 1. Azure OpenAI Service

```bash
# Create Azure OpenAI resource (if not exists)
az cognitiveservices account create \
  --name solace-openai \
  --resource-group solace-rg \
  --kind OpenAI \
  --sku S0 \
  --location eastus2

# Deploy GPT-4.1-mini model
az cognitiveservices account deployment create \
  --name solace-openai \
  --resource-group solace-rg \
  --deployment-name gpt-41-mini \
  --model-name gpt-4.1-mini \
  --model-version "2025-04-14" \
  --model-format OpenAI \
  --sku-capacity 30 \
  --sku-name Standard

# Get the API key
az cognitiveservices account keys list \
  --name solace-openai \
  --resource-group solace-rg \
  --query key1 -o tsv
```

### 2. Azure API Management (Consumption tier)

```bash
# Create APIM instance
az apim create \
  --name solace-apim \
  --resource-group solace-rg \
  --publisher-name "Solace" \
  --publisher-email "admin@findsolace.io" \
  --sku-name Consumption \
  --location eastus2

# Import the chat API operation
# (Configure via Azure Portal — add POST /chat/completions operation
#  with backend pointing to Azure OpenAI endpoint)
```

### 3. Azure Static Web Apps

```bash
# Create SWA instance
az staticwebapp create \
  --name solace-swa \
  --resource-group solace-rg \
  --source https://github.com/msftsean/find-solace \
  --branch main \
  --app-location "/" \
  --output-location "" \
  --login-with-github

# Configure application settings (APIM key)
az staticwebapp appsettings set \
  --name solace-swa \
  --setting-names \
    APIM_SUBSCRIPTION_KEY="<your-apim-subscription-key>" \
    APIM_ENDPOINT="https://solace-apim.azure-api.net/solace"
```

### 4. Custom Domain

```bash
# Add custom domain
az staticwebapp hostname set \
  --name solace-swa \
  --hostname findsolace.io

# Then configure DNS records at your registrar:
# TXT  _dnsauth.findsolace.io  → <validation-token-from-azure>
# CNAME  www                    → solace-swa.azurestaticapps.net
# ALIAS  @                      → solace-swa.azurestaticapps.net
```

## Local Development

### Running the site locally

```bash
# No build step needed — serve files directly
# Option 1: VS Code Live Server extension (recommended)
# Right-click index.html → "Open with Live Server"

# Option 2: Python HTTP server
python -m http.server 8080

# Option 3: npx serve (if Node.js available)
npx serve .
```

### Testing the chat widget locally

During development, the widget can be tested in two modes:

1. **Mock mode** (no Azure resources needed):
   - The widget defaults to mock responses when `/api/chat` returns 404
   - Useful for UI development and styling

2. **Live mode** (requires Azure resources):
   - Set up a local proxy (e.g., `staticwebapp.config.json` with a dev APIM endpoint)
   - Or use SWA CLI: `npm install -g @azure/static-web-apps-cli && swa start .`

### Testing the APIM endpoint directly

```bash
# Test with curl (replace values)
curl -X POST "https://solace-apim.azure-api.net/solace/chat/completions" \
  -H "Content-Type: application/json" \
  -H "Ocp-Apim-Subscription-Key: <your-key>" \
  -d '{
    "messages": [
      {"role": "system", "content": "You are the Solace Guide."},
      {"role": "user", "content": "What exercise should I start with?"}
    ],
    "stream": false,
    "max_tokens": 200,
    "temperature": 0.7
  }'
```

## Deployment

### GitHub Actions (automatic)

Pushes to `main` trigger automatic deployment via `.github/workflows/azure-swa-deploy.yml`.

### Manual deployment

```bash
# Using SWA CLI
swa deploy . --deployment-token <token>
```

## Key Files

| File | Purpose |
|------|---------|
| `staticwebapp.config.json` | SWA routing, API proxy, navigation fallback |
| `.github/workflows/azure-swa-deploy.yml` | GitHub Actions deployment workflow |
| `style.css` | Widget styles (appended at end of file) |
| `index.html`, `home.html`, `work.html`, `labs.html` | Widget HTML + inline JS |

## Useful Commands

```bash
# Check APIM health
az apim show --name solace-apim --resource-group solace-rg --query provisioningState

# View SWA deployment status
az staticwebapp show --name solace-swa --query defaultHostname

# List Azure OpenAI deployments
az cognitiveservices account deployment list \
  --name solace-openai --resource-group solace-rg -o table

# View APIM subscription keys
az apim subscription list --resource-group solace-rg --service-name solace-apim -o table
```
