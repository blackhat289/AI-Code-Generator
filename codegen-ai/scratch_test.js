import { createOpenAI } from "@ai-sdk/openai"
import { streamText } from "ai"

const openrouterClient = createOpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY || "",
})

import { streamWithFallback } from "./src/lib/openrouter.js"

async function test() {
  console.log("Fetching active free models from OpenRouter...")
  try {
    const res = await fetch("https://openrouter.ai/api/v1/models")
    if (!res.ok) throw new Error(`HTTP error ${res.status}`)
    const json = await res.json()
    
    const freeModels = json.data
      .filter(m => m.id.endsWith(":free"))
      .map(m => m.id)
    
    console.log("Available free models:")
    console.log(freeModels.slice(0, 15))
  } catch (err) {
    console.error("Failed to fetch models:", err)
  }
}

test()
