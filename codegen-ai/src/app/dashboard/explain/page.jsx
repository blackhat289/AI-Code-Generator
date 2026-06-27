"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Loader2, FileSearch, AlertCircle } from "lucide-react"

export default function ExplainPage() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [activeModel, setActiveModel] = useState("")
  const abortRef = useRef(null)

  const handleExplain = async () => {
    if (!input.trim()) return
    setIsLoading(true)
    setError(null)
    setOutput("")
    setActiveModel("")
    abortRef.current = new AbortController()

    try {
      const res = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
        signal: abortRef.current.signal,
      })

      if (!res.ok) {
        const contentType = res.headers.get("content-type") ?? ""
        if (contentType.includes("application/json")) {
          const json = await res.json()
          throw new Error(json.error ?? `API error ${res.status}`)
        }
        throw new Error(`API error ${res.status}: ${await res.text()}`)
      }

      const modelUsed = res.headers.get("x-model-used")
      if (modelUsed) {
        setActiveModel(modelUsed)
      }

      if (!res.body) throw new Error("No response body")

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ""
      let accumulated = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split("\n")
        buffer = lines.pop() ?? ""

        for (const line of lines) {
          const trimmed = line.trim()
          if (!trimmed) continue

          // Handle Vercel AI SDK Data Stream format (e.g. 0:"text")
          if (trimmed.startsWith("0:")) {
            try {
              const text = JSON.parse(trimmed.slice(2))
              if (text) {
                accumulated += text
                setOutput(accumulated)
              }
            } catch {
              // ignore
            }
            continue
          }

          // Handle standard OpenAI SSE format (e.g. data: {...})
          if (trimmed === "data: [DONE]") continue
          if (trimmed.startsWith("data: ")) {
            try {
              const json = JSON.parse(trimmed.slice(6))
              const delta = json?.choices?.[0]?.delta?.content
              if (delta) {
                accumulated += delta
                setOutput(accumulated)
              }
            } catch {
              // ignore
            }
          }
        }
      }
    } catch (err) {
      if (err instanceof Error && err.name !== "AbortError") {
        setError(err.message)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="pb-4 border-b border-border">
        <h1 className="text-3xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-indigo-400 flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 border border-emerald-500/25 rounded-2xl text-emerald-400">
            <FileSearch className="h-7 w-7" />
          </div>
          Code Explainer
        </h1>
        <p className="text-muted-foreground text-sm mt-3 leading-relaxed">
          Paste your complex code snippets to get structured, step-by-step logical explanations in plain terms.
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-2xl bg-rose-500/10 border border-rose-500/25 px-5 py-4 text-sm text-rose-400 backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-300">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Input Card */}
        <div className="flex flex-col gap-4">
          <Card className="flex flex-col h-[520px] glass border border-border rounded-3xl shadow-xl overflow-hidden pt-0 pb-0">
            <div className="h-16 flex items-center px-6 bg-muted border-b border-border">
              <h3 className="font-extrabold tracking-tight text-purple-400">Input Code</h3>
            </div>
            
            <div className="p-6 flex-1 flex flex-col gap-4">
              <Textarea
                className="flex-1 w-full p-4 border border-border rounded-2xl bg-input text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-emerald-500/50 resize-none font-mono text-xs leading-relaxed mb-4"
                placeholder="paste code here (e.g. function findKthLargest(nums, k) { ... })"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <Button
                onClick={handleExplain}
                className="h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl transition shadow-[0_0_20px_rgba(16,185,129,0.15)] hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                disabled={isLoading || !input.trim()}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Explaining...
                  </>
                ) : (
                  "Explain Code"
                )}
              </Button>
            </div>
          </Card>
        </div>

        {/* Output Explanation Card */}
        <Card className="flex flex-col h-[520px] glass border border-border rounded-3xl shadow-xl overflow-hidden pt-0 pb-0">
          <div className="h-16 flex items-center justify-between px-6 bg-muted border-b border-border text-white">
            <h3 className="font-extrabold tracking-tight text-purple-400">Explanation</h3>
            {activeModel && (
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/25 text-xs font-medium text-emerald-400 lowercase">
                via {activeModel}
              </span>
            )}
          </div>
          
          <div className="p-6 flex-1 flex flex-col">
            <div className="flex-1 border border-border rounded-2xl p-5 overflow-y-auto bg-input/40 text-foreground text-sm leading-relaxed whitespace-pre-wrap">
              {output || (
                <span className="text-muted-foreground italic">
                  {isLoading ? "Analyzing and generating explanation..." : "The step-by-step breakdown of your code will appear here..."}
                </span>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
