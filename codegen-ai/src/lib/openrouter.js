import { createOpenAI } from "@ai-sdk/openai"
import { streamText } from "ai"
import { FREE_MODELS, isRetryableError } from "./models.js"

const openrouterClient = createOpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY || "",
  headers: {
    "HTTP-Referer": "http://localhost:3000",
    "X-Title": "CodeGen AI",
  },
})

export async function streamWithFallback(options) {
  let lastError = null

  // Try each model in the chain
  for (const modelConfig of FREE_MODELS) {
    try {
      console.log(`[fallback-chain] Trying model: ${modelConfig.id}`)
      const response = await streamText({
        model: openrouterClient(modelConfig.id),
        system: options.system,
        prompt: options.prompt,
      })

      // Get the underlying stream reader to verify connection
      const textStream = response.textStream
      const reader = textStream.getReader()

      let firstChunk
      try {
        firstChunk = await reader.read()
        // If the stream is immediately done, the model failed silently or is unavailable
        if (firstChunk.done) {
          throw new Error(`Model ${modelConfig.id} returned an empty stream (unavailable or invalid API key)`)
        }
      } catch (err) {
        reader.releaseLock()
        throw err
      }

      // If we got here, the model is working and we have the first chunk!
      console.log(`[fallback-chain] Model ${modelConfig.id} succeeded! firstChunk:`, firstChunk)
      const encoder = new TextEncoder()
      
      const customStream = new ReadableStream({
        async start(controller) {
          if (!firstChunk.done && firstChunk.value !== undefined) {
            console.log(`[fallback-chain] Enqueuing first chunk: "${firstChunk.value}"`)
            controller.enqueue(encoder.encode(`0:${JSON.stringify(firstChunk.value)}\n`))
          }
          try {
            while (true) {
              const { done, value } = await reader.read()
              if (done) {
                console.log(`[fallback-chain] Stream done`)
                break
              }
              console.log(`[fallback-chain] Enqueuing chunk: "${value}"`)
              controller.enqueue(encoder.encode(`0:${JSON.stringify(value)}\n`))
            }
          } catch (e) {
            console.error(`Stream error during consumption:`, e)
            controller.enqueue(encoder.encode(`3:${JSON.stringify(e.message || "Stream error")}\n`))
          } finally {
            reader.releaseLock()
            controller.close()
          }
        }
      })

      return new Response(customStream, {
        headers: {
          "Content-Type": "text/event-stream; charset=utf-8",
          "Cache-Control": "no-cache, no-transform",
          "Connection": "keep-alive",
          "X-Model-Used": modelConfig.name,
          "Access-Control-Expose-Headers": "X-Model-Used",
        }
      })

    } catch (err) {
      console.error(`Error with model ${modelConfig.id}:`, err)
      lastError = err

      // If it's a retryable error, proceed to next model.
      // Otherwise, throw immediately.
      if (!isRetryableError(err)) {
        throw err
      }
    }
  }

  // If all models fail, throw the last error
  throw lastError || new Error("All fallback models failed")
}
