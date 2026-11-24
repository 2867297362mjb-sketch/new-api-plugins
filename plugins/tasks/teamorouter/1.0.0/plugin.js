// TeamoRouter: one API key for GPT, Claude, Gemini, DeepSeek, GLM, Kimi,
// MiniMax, Grok, Doubao and other models, over the OpenAI, Anthropic and
// Gemini formats. Docs: https://teamorouter.com/docs/api-integration
//
// Every route passes the request through unchanged: TeamoRouter speaks each of
// these formats natively, so the gateway needs no converter.
const VERSION = "1.0.0";

export const meta = {
  apiVersion: 1,
  key: "teamorouter",
  name: "TeamoRouter",
  version: VERSION,
  icon: "text:TR",
  author: { name: "TeamoRouter", url: "https://teamorouter.com" },
  website: "https://teamorouter.com",
  description: {
    en: "TeamoRouter: GPT, Claude, Gemini, DeepSeek, GLM, Kimi and more on one key",
    zh: "TeamoRouter：一个密钥接入 GPT、Claude、Gemini、DeepSeek、GLM 等模型",
  },
  baseUrl: "https://api.teamorouter.com",
  keyHint: { en: "sk-teamo-...", zh: "sk-teamo-..." },
  relay: [
    { incoming_path: "/v1/chat/completions", upstream_path: "/v1/chat/completions" },
    { incoming_path: "/v1/responses", upstream_path: "/v1/responses" },
    { incoming_path: "/v1/messages", upstream_path: "/v1/messages" },
    {
      incoming_path: "/v1beta/models/{model}:generateContent",
      upstream_path: "/v1beta/models/{model}:generateContent",
    },
    { incoming_path: "/v1/images/generations", upstream_path: "/v1/images/generations" },
    { incoming_path: "/v1/images/edits", upstream_path: "/v1/images/edits" },
    // The live model list of the key, in the OpenAI format.
    { incoming_path: "/v1/models", upstream_path: "/v1/models" },
  ],
};

// TeamoRouter keys are a single token without spaces.
export function checkKey(ctx, key) {
  if (/\s/.test(key)) {
    return {
      error: {
        en: "A TeamoRouter key has no spaces. Put one key per line.",
        zh: "TeamoRouter 密钥不含空格，每行填一个密钥。",
      },
    };
  }
}

// Names the gateway to TeamoRouter, so its support can tell requests relayed
// through this plugin from other clients. The key and body are not read.
export function signRequest(ctx, request) {
  return {
    headers: {
      "User-Agent": "new-api-teamorouter-plugin/" + VERSION,
      "X-Client-Source": "new-api-teamorouter-plugin",
    },
  };
}

// The Gemini route also serves :streamGenerateContent, but a route without a
// converter keeps its :generateContent upstream path, where TeamoRouter answers
// with one JSON body. Streaming requests go to the streaming path instead.
export function prepareRequest(ctx, request) {
  if (ctx.path.indexOf(":streamGenerateContent") < 0) {
    return null;
  }
  return {
    path: "/v1beta/models/" + encodeURIComponent(request.model) + ":streamGenerateContent?alt=sse",
  };
}

// The account balance of the channel key, in USD.
export function buildBalanceRequest(ctx) {
  // Balance requests carry no route auth, so the hook sends the channel key.
  return {
    method: "GET",
    path: "/v1/billing/balance",
    headers: { Authorization: "Bearer " + ctx.apiKey },
  };
}

export function parseBalance(ctx, response) {
  let body;
  try {
    body = JSON.parse(response.body || "");
  } catch (e) {
    body = null;
  }
  if (response.status !== 200 || !body || !body.balance) {
    const message = body && body.error && body.error.message;
    return { error: "TeamoRouter balance query failed (HTTP " + response.status + ")" + (message ? ": " + message : "") };
  }
  const amount = Number(body.balance.value);
  if (!isFinite(amount)) {
    return { error: "TeamoRouter returned no balance amount" };
  }
  return { amount: amount, currency: body.balance.currency || "USD" };
}
