import { streamWithFallback } from "@/lib/openrouter"

export const maxDuration = 60

export async function POST(req) {
  try {
    const { prompt } = await req.json()
    if (!prompt?.trim()) return new Response("Prompt required", { status: 400 })

    return await streamWithFallback({
      label: "explain",
      system: "You are an expert teacher. Explain the provided code clearly and concisely. Break down each part in simple language.",
      prompt,
    })
  } catch (err) {
    console.error("[api/explain] Error:", err)
    return new Response(err.message || "Internal Server Error", { status: 500 })
  }
}
