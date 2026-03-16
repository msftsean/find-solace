/**
 * POST /api/chat
 * Proxies chat-completion requests to APIM → Azure OpenAI
 * and returns the SSE response to the browser widget.
 */
module.exports = async function (context, req) {
  const gatewayUrl = process.env.APIM_GATEWAY_URL;
  const subscriptionKey = process.env.APIM_SUBSCRIPTION_KEY;

  if (!gatewayUrl || !subscriptionKey) {
    context.res = {
      status: 500,
      headers: { "Content-Type": "application/json" },
      body: { error: "Server configuration error." },
    };
    return;
  }

  if (!req.body || typeof req.body !== "object") {
    context.res = {
      status: 400,
      headers: { "Content-Type": "application/json" },
      body: { error: "Request body is required." },
    };
    return;
  }

  const url = `${gatewayUrl}/solace/chat/completions?api-version=2024-06-01`;

  try {
    const upstream = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": subscriptionKey,
      },
      body: JSON.stringify(req.body),
    });

    if (!upstream.ok) {
      // 429 = rate-limited (client should retry); 400 = bad request body.
      // 401/403/404/5xx from APIM are backend config problems → 502.
      const status =
        upstream.status === 429 || upstream.status === 400
          ? upstream.status
          : 502;
      const msg =
        upstream.status === 429
          ? "The AI service is busy. Please wait a moment and try again."
          : "An error occurred processing your request.";
      context.res = {
        status,
        headers: { "Content-Type": "application/json" },
        body: { error: msg },
      };
      return;
    }

    // Return the SSE payload from APIM / Azure OpenAI.
    // SWA managed functions (v3 model) buffer the full response before
    // sending; the widget's ReadableStream-based SSE parser still works
    // correctly — it processes all chunks once they arrive.
    context.res = {
      status: 200,
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
      body: await upstream.text(),
      isRaw: true,
    };
  } catch (err) {
    context.log.error("APIM request failed:", err.message);
    context.res = {
      status: 502,
      headers: { "Content-Type": "application/json" },
      body: {
        error: "Unable to reach the AI service. Please try again.",
      },
    };
  }
};
