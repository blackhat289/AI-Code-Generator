"use client"

import { useState, useRef, useEffect } from "react"
import Editor from "@monaco-editor/react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Loader2, Play, Copy, Download, AlertCircle, Settings, FileCode, Check } from "lucide-react"

export default function GeneratorPage() {
  const [language, setLanguage] = useState("typescript")
  const [prompt, setPrompt] = useState("")
  const [output, setOutput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [activeModel, setActiveModel] = useState("")
  const [isCopied, setIsCopied] = useState(false)
  const [editorTheme, setEditorTheme] = useState("vs-dark")
  const abortRef = useRef(null)

  useEffect(() => {
    // Check initial theme
    const isLight = document.documentElement.classList.contains("light")
    setEditorTheme(isLight ? "light" : "vs-dark")

    // Observe changes to <html> class attribute
    const observer = new MutationObserver(() => {
      const isLightNow = document.documentElement.classList.contains("light")
      setEditorTheme(isLightNow ? "light" : "vs-dark")
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"]
    })

    return () => observer.disconnect()
  }, [])

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    setIsLoading(true)
    setError(null)
    setOutput("")
    setActiveModel("")

    abortRef.current = new AbortController()

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, language }),
        signal: abortRef.current.signal,
      })

      if (!res.ok) {
        const contentType = res.headers.get("content-type") ?? ""
        if (contentType.includes("application/json")) {
          const json = await res.json()
          throw new Error(json.error ?? `API error ${res.status}`)
        }
        const text = await res.text()
        throw new Error(`API error ${res.status}: ${text}`)
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
        buffer = lines.pop() ?? "" // keep incomplete last line

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
        console.error("[generator] Error:", err)
        setError(err.message)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  const downloadCode = () => {
    const ext = {
      typescript: "ts", javascript: "js", python: "py", go: "go",
      rust: "rs", java: "java", cpp: "cpp",
    }
    const blob = new Blob([output], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `generated.${ext[language] ?? "txt"}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] gap-6">
      {error && (
        <div className="flex items-center gap-3 rounded-2xl bg-rose-500/10 border border-rose-500/25 px-5 py-4 text-sm text-rose-400 backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-300">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6 items-start flex-1 min-h-0">
        {/* Left Config Panel */}
        <div className="w-full lg:w-[350px] flex flex-col gap-6 h-full shrink-0">
          <Card className="flex flex-col h-full glass border border-border rounded-3xl shadow-xl overflow-hidden pt-0 pb-0">
            <div className="h-16 flex items-center gap-2 px-6 bg-muted border-b border-border text-[#f8fafc]">
              <Settings className="h-5 w-5 text-indigo-400" />
              <h3 className="font-extrabold tracking-tight">Configuration</h3>
            </div>

            <div className="p-6 flex-1 flex flex-col gap-6">
              <div className="space-y-2.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Target Language</label>
                <Select value={language} onValueChange={(val) => val && setLanguage(val)}>
                  <SelectTrigger className="w-full h-11 border border-black dark:border-border rounded-xl bg-white dark:bg-input text-black dark:text-foreground">
                    <SelectValue placeholder="Select Language" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-950 border border-zinc-800 text-zinc-300">
                    <SelectItem value="typescript">TypeScript</SelectItem>
                    <SelectItem value="javascript">JavaScript</SelectItem>
                    <SelectItem value="python">Python</SelectItem>
                    <SelectItem value="go">Go</SelectItem>
                    <SelectItem value="rust">Rust</SelectItem>
                    <SelectItem value="java">Java</SelectItem>
                    <SelectItem value="cpp">C++</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2.5 flex-1 flex flex-col">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Prompt / Specifications</label>
                <Textarea
                  placeholder="Describe what you want to build (e.g. Write a React hook to fetch and cache data with abort controller)..."
                  className="flex-1 w-full p-4 border border-border rounded-2xl bg-input text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-indigo-500/50 resize-none min-h-[150px] text-sm leading-relaxed"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </div>

              <Button
                onClick={handleGenerate}
                disabled={isLoading || !prompt.trim()}
                className="w-full h-12 rounded-2xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-[0_0_20px_rgba(99,102,241,0.2)] hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Generate Code
                  </>
                )}
              </Button>
            </div>
          </Card>
        </div>

        {/* Right Editor Panel */}
        <div className="w-full lg:flex-1 flex flex-col h-full border border-border rounded-3xl overflow-hidden shadow-2xl bg-card/30 backdrop-blur-md">
          <div className="h-16 flex items-center justify-between px-6 bg-muted border-b border-border text-[#f8fafc]">
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-indigo-500/10 border border-indigo-500/25 rounded-lg text-indigo-400">
                <FileCode className="h-4.5 w-4.5" />
              </div>
              <div className="text-sm font-semibold tracking-tight text-[#f8fafc]">
                Generated Output: <span className="text-indigo-400 font-mono text-xs uppercase">{language}</span>
                {activeModel && (
                  <span className="ml-2 px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-xs font-medium text-indigo-400">
                    {activeModel}
                  </span>
                )}
                {isLoading && (
                  <span className="ml-3 text-xs text-indigo-500 animate-pulse font-normal">● Streaming...</span>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={copyToClipboard} 
                disabled={!output}
                className="h-9 w-9 rounded-lg hover:bg-zinc-800/40 text-zinc-400 hover:text-zinc-200 transition cursor-pointer"
              >
                {isCopied ? <Check className="h-4.5 w-4.5 text-emerald-400" /> : <Copy className="h-4.5 w-4.5" />}
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={downloadCode} 
                disabled={!output}
                className="h-9 w-9 rounded-lg hover:bg-zinc-800/40 text-zinc-400 hover:text-zinc-200 transition cursor-pointer"
              >
                <Download className="h-4.5 w-4.5" />
              </Button>
            </div>
          </div>
          <div className="flex-1 bg-[#010409] min-h-0 relative">
            <Editor
              height="100%"
              language={language === "cpp" ? "cpp" : language}
              theme={editorTheme}
              value={output || (isLoading ? "// Generating your request..." : "// Your generated code will appear here...")}
              options={{
                readOnly: true,
                minimap: { enabled: false },
                fontSize: 14,
                fontFamily: "Fira Code, JetBrains Mono, monospace",
                lineNumbers: "on",
                padding: { top: 20 },
                scrollBeyondLastLine: false,
                domReadOnly: true,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
