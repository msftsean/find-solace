# Azure Resource Setup — Solace Agent

> Provision these resources to connect the Solace chat widget to a live AI backend.

## Resource Group

```bash
az group create --name solace-rg --location eastus2
```

---

## 1. Azure OpenAI

| Setting | Value |
|---------|-------|
| SKU | S0 (Standard) |
| Region | eastus2 |
| Model | gpt-4.1-mini |
| Deployment name | gpt-41-mini (or your choice) |

```bash
az cognitiveservices account create \
  --name solace-openai \
  --resource-group solace-rg \
  --kind OpenAI \
  --sku S0 \
  --location eastus2

az cognitiveservices account deployment create \
  --name solace-openai \
  --resource-group solace-rg \
  --deployment-name gpt-41-mini \
  --model-name gpt-4.1-mini \
  --model-format OpenAI \
  --sku-capacity 30 \
  --sku-name Standard
```

**Retrieve values:**

```bash
# Endpoint URL
az cognitiveservices account show \
  --name solace-openai --resource-group solace-rg \
  --query "properties.endpoint" -o tsv

# API Key
az cognitiveservices account keys list \
  --name solace-openai --resource-group solace-rg \
  --query "key1" -o tsv
```

---

## 2. API Management (APIM)

| Setting | Value |
|---------|-------|
| SKU | Consumption (~$3.50/million calls) |
| Region | eastus2 |

```bash
az apim create \
  --name solace-apim \
  --resource-group solace-rg \
  --publisher-name "Solace" \
  --publisher-email YOUR_EMAIL@example.com \
  --sku-name Consumption \
  --location eastus2
```

> ⏱ Consumption tier creation takes ~30–45 minutes.

**After creation — store the OpenAI key as a Named Value:**

```bash
az apim nv create \
  --resource-group solace-rg \
  --service-name solace-apim \
  --named-value-id openai-api-key \
  --display-name "OpenAI API Key" \
  --value YOUR_OPENAI_KEY \
  --secret true
```

### Import the OpenAI API definition

```bash
# Import the Azure OpenAI chat completions endpoint as an APIM API
az apim api import \
  --resource-group solace-rg \
  --service-name solace-apim \
  --api-id solace-chat \
  --display-name "Solace Chat" \
  --path solace \
  --service-url https://solace-openai.openai.azure.com/openai/deployments/gpt-41-mini \
  --specification-format OpenApiJson \
  --specification-url "https://raw.githubusercontent.com/Azure/azure-rest-api-specs/main/specification/cognitiveservices/data-plane/AzureOpenAI/inference/stable/2024-06-01/inference.json"
```

> If the spec URL import fails, create the API manually in the Azure portal:
> 1. Go to APIM → APIs → Add API → HTTP
> 2. Set display name "Solace Chat", URL suffix "solace"
> 3. Add operation: POST `/chat/completions?api-version=2024-06-01`
> 4. Set backend URL to your OpenAI endpoint + deployment path

### Set the backend policy

In the Azure portal (or via ARM template), set the inbound policy for the `solace-chat` API:

```xml
<policies>
  <inbound>
    <base />
    <set-header name="api-key" exists-action="override">
      <value>{{openai-api-key}}</value>
    </set-header>
    <set-query-parameter name="api-version" exists-action="skip">
      <value>2024-06-01</value>
    </set-query-parameter>
    <rate-limit-by-key calls="20" renewal-period="60"
      counter-key="@(context.Request.IpAddress)" />
    <cors>
      <allowed-origins>
        <origin>https://YOUR_SWA_HOSTNAME.azurestaticapps.net</origin>
      </allowed-origins>
      <allowed-methods><method>POST</method></allowed-methods>
      <allowed-headers><header>Content-Type</header></allowed-headers>
    </cors>
  </inbound>
  <backend><base /></backend>
  <outbound><base /></outbound>
  <on-error><base /></on-error>
</policies>
```

**Retrieve values:**

```bash
# Gateway URL
az apim show \
  --name solace-apim --resource-group solace-rg \
  --query "gatewayUrl" -o tsv

# Subscription key (use the built-in all-access subscription)
az apim subscription list \
  --resource-group solace-rg --service-name solace-apim \
  --query "[?displayName=='Built-in all-access subscription'].primaryKey" -o tsv
```

---

## 3. Static Web App (SWA)

| Setting | Value |
|---------|-------|
| SKU | Free |
| Source | github.com/msftsean/find-solace |
| Branch | main |

```bash
az staticwebapp create \
  --name solace-swa \
  --resource-group solace-rg \
  --source https://github.com/msftsean/find-solace \
  --branch main \
  --app-location "/" \
  --output-location "" \
  --login-with-github
```

### API backend options

The widget calls `POST /api/chat`. SWA does **not** support external URL rewrites or env-var substitution in `staticwebapp.config.json`. Choose one of these approaches:

**Option A — Linked Azure Function (recommended):**

Create a Function App that proxies to APIM/Azure OpenAI. SWA's `/api/*` route automatically maps to linked Functions.

```bash
# Create a Function App (Node.js or Python)
az functionapp create \
  --name solace-api \
  --resource-group solace-rg \
  --consumption-plan-location eastus2 \
  --runtime node \
  --runtime-version 20 \
  --functions-version 4 \
  --storage-account solacestorage

# Link it to SWA
az staticwebapp backends link \
  --name solace-swa \
  --resource-group solace-rg \
  --backend-resource-id /subscriptions/YOUR_SUB/resourceGroups/solace-rg/providers/Microsoft.Web/sites/solace-api

# Set env vars in the Function App
az functionapp config appsettings set \
  --name solace-api \
  --resource-group solace-rg \
  --settings \
    APIM_GATEWAY_URL=https://solace-apim.azure-api.net \
    APIM_SUBSCRIPTION_KEY=YOUR_APIM_SUB_KEY
```

**Option B — Direct APIM calls (simpler, skip SWA proxy):**

Point the widget directly at APIM. Requires updating the widget's fetch URL and configuring CORS on APIM (already included in the policy above).

**Retrieve values:**

```bash
# Default hostname
az staticwebapp show \
  --name solace-swa --resource-group solace-rg \
  --query "defaultHostname" -o tsv
```

---

## Values Needed for Widget Integration

Once provisioned, paste these values so the widget can be connected:

| Value | How to get it | Example |
|-------|--------------|---------|
| APIM gateway URL | `az apim show --query gatewayUrl` | `https://solace-apim.azure-api.net` |
| APIM subscription key | `az apim subscription list --query ...primaryKey` | `abc123def456...` |
| Azure OpenAI endpoint | `az cognitiveservices account show --query ...endpoint` | `https://solace-openai.openai.azure.com/` |
| Azure OpenAI API key | `az cognitiveservices account keys list --query key1` | `def456abc789...` |
| OpenAI deployment name | What you chose in step 1 | `gpt-41-mini` |
| SWA default hostname | `az staticwebapp show --query defaultHostname` | `lemon-tree-abc123.azurestaticapps.net` |

---

## Estimated Costs

| Resource | Monthly estimate |
|----------|-----------------|
| Azure OpenAI (gpt-4.1-mini) | ~$0.40/million input tokens, ~$1.60/million output tokens |
| APIM Consumption | ~$3.50/million calls |
| SWA Free tier | $0 |
| **Total for light usage** | **< $5/month** |
