import { streamWithFallback } from "@/lib/openrouter"

export const maxDuration = 60

export async function POST(req) {
  try {
    const { prompt } = await req.json()
    if (!prompt?.trim()) return new Response("Prompt required", { status: 400 })

    return await streamWithFallback({
      label: "optimize",
      system: "You are an expert Performance Engineer. Optimize the provided code for speed, memory, and best practices. Return ONLY the optimized code, no explanations.",
      prompt,
    })
  } catch (err) {
    console.error("[api/optimize] Error:", err)
    return new Response(err.message || "Internal Server Error", { status: 500 })
  }
}
