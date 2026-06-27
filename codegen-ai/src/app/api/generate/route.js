import { streamWithFallback } from "@/lib/openrouter"

export const maxDuration = 60

export async function POST(req) {
  try {
    const { prompt, language } = await req.json()
    if (!prompt?.trim()) {
      return new Response(JSON.stringify({ error: "Prompt required" }), { 
        status: 400,
        headers: { "Content-Type": "application/json" }
      })
    }

    return await streamWithFallback({
      label: "generate",
      system: `You are an expert developer. Generate clear, optimized, and correct ${language || 'javascript'} code based on the user's description. Return ONLY the code. Do not wrap in markdown code blocks, and provide no explanation or comments outside the code itself.`,
      prompt,
    })
  } catch (err) {
    console.error("[api/generate] Error:", err)
    return new Response(JSON.stringify({ error: err.message || "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    })
  }
}
