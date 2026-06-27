/**
 * Centralized OpenRouter model registry.
 * All models here have been verified as free-tier on OpenRouter.
 * Ordered by reliability — first model is tried first.
 */

/** Primary fallback chain for code generation */
export const FREE_MODELS = [
  {
    id: "meta-llama/llama-3-8b-instruct:free",
    name: "Llama 3 8B (Free)",
    upstream: "Meta",
    contextWindow: 8192,
  },
  {
    id: "qwen/qwen-2-7b-instruct:free",
    name: "Qwen 2 7B (Free)",
    upstream: "Alibaba",
    contextWindow: 32000,
  },
  {
    id: "microsoft/phi-3-medium-128k-instruct:free",
    name: "Phi 3 Medium (Free)",
    upstream: "Microsoft",
    contextWindow: 128000,
  },
  {
    id: "mistralai/mistral-7b-instruct:free",
    name: "Mistral 7B (Free)",
    upstream: "Mistral",
    contextWindow: 32000,
  },
  {
    id: "google/gemini-2.5-flash:free",
    name: "Gemini 2.5 Flash (Free)",
    upstream: "Google",
    contextWindow: 1048576,
  },
  {
    id: "qwen/qwen-2.5-coder-32b-instruct:free",
    name: "Qwen 2.5 Coder 32B (Free)",
    upstream: "Alibaba",
    contextWindow: 32000,
  },
  {
    id: "meta-llama/llama-3.3-70b-instruct:free",
    name: "Llama 3.3 70B (Free)",
    upstream: "Meta",
    contextWindow: 128000,
  },
  {
    id: "google/gemma-2-9b-it:free",
    name: "Gemma 2 9B (Free)",
    upstream: "Google",
    contextWindow: 8192,
  },
  {
    id: "google/gemini-2.5-flash",
    name: "Gemini 2.5 Flash",
    upstream: "Google",
    contextWindow: 1048576,
  },
  {
    id: "deepseek/deepseek-chat",
    name: "DeepSeek V3",
    upstream: "DeepSeek",
    contextWindow: 64000,
  },
]

/** HTTP status codes that mean "try the next model" */
export const RETRYABLE_CODES = new Set([
  400, // bad request (model-specific quirk)
  402, // provider spend limit / billing
  404, // model not available for free tier
  429, // rate limited
  500, // provider internal error
  502, // bad gateway
  503, // provider down / overloaded
])

/** Detect if an error is retryable based on message content */
export function isRetryableError(err) {
  if (!err) return false

  // Check explicit status codes from AI SDK error wrapper
  const status = err.status || err.statusCode
  if (status && RETRYABLE_CODES.has(status)) {
    return true
  }

  const msg = (err.message || String(err)).toLowerCase()
  const body = err.responseBody ? String(err.responseBody).toLowerCase() : ""

  return (
    msg.includes("rate") ||
    msg.includes("limit") ||
    msg.includes("overload") ||
    msg.includes("unavailable") ||
    msg.includes("deprecated") ||
    msg.includes("not available for free") ||
    msg.includes("provider returned error") ||
    msg.includes("spend limit") ||
    msg.includes("402") ||
    msg.includes("404") ||
    msg.includes("429") ||
    msg.includes("503") ||
    body.includes("unavailable") ||
    body.includes("not available for free") ||
    body.includes("slug")
  )
}
