import Link from "next/link"
import { auth } from "@/lib/auth"
import { Code2, ArrowRight, Shield, Zap, Sparkles, Terminal } from "lucide-react"

export default async function LandingPage() {
  const session = await auth()

  return (
    <div className="relative min-h-screen bg-[#030712] text-zinc-100 bg-grid overflow-hidden">
      {/* Decorative Radial Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-violet-600/10 blur-[120px] pointer-events-none" />

      {/* Navigation Header */}
      <header className="sticky top-0 z-50 px-8 py-4 border-b border-zinc-800/40 bg-zinc-950/65 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-400">
            <Code2 className="h-6 w-6" />
          </div>
          <span className="text-xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500">
            CodeGen AI
          </span>
        </div>
        <nav className="flex gap-4 items-center">
          <Link
            href="/login"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium shadow-[0_0_20px_rgba(99,102,241,0.2)] hover:shadow-[0_0_25px_rgba(99,102,241,0.45)] transition duration-300 cursor-pointer"
          >
            Login / Sign Up
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-6 py-20 flex flex-col items-center justify-center text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/5 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-8 animate-pulse">
          <Sparkles className="h-3.5 w-3.5" /> Next-Gen AI Coding Assistant
        </div>

        <h1 className="text-5xl md:text-8xl font-black tracking-tight mb-8 leading-tight">
          Code Faster with <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500">
            Intelligent AI
          </span>
        </h1>

        <p className="text-lg md:text-xl text-zinc-400 max-w-3xl mb-12 leading-relaxed">
          Generate, explain, and optimize clean, production-ready code instantly using multiple top-tier models with auto-fallback reliability.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-24">
          <Link
            href="/login"
            className="px-8 py-4 text-lg bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-bold shadow-[0_0_30px_rgba(99,102,241,0.25)] hover:scale-105 transition-all duration-300 flex items-center gap-2 cursor-pointer"
          >
            Start Coding Now <ArrowRight className="h-5 w-5" />
          </Link>
          <a
            href="#features"
            className="px-8 py-4 text-lg bg-zinc-900/60 border border-zinc-800 hover:bg-zinc-800/80 rounded-full font-bold text-zinc-300 transition duration-300 cursor-pointer"
          >
            Learn More
          </a>
        </div>

        {/* Feature Cards Grid */}
        <section id="features" className="w-full grid md:grid-cols-3 gap-6 text-left border-t border-zinc-800/40 pt-20">
          <div className="p-6 bg-zinc-950/45 border border-zinc-800/40 rounded-2xl backdrop-blur-md flex flex-col gap-4 glow-border">
            <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400 w-fit">
              <Terminal className="h-5 w-5" />
            </div>
            <h3 className="text-xl font-bold text-zinc-100">Smart Code Generator</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Describe what you want to build in plain English and get highly formatted, optimized code instantly.
            </p>
          </div>

          <div className="p-6 bg-zinc-950/45 border border-zinc-800/40 rounded-2xl backdrop-blur-md flex flex-col gap-4 glow-border">
            <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400 w-fit">
              <Sparkles className="h-5 w-5" />
            </div>
            <h3 className="text-xl font-bold text-zinc-100">Deep Explainer</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Upload or paste complex code snippets to get detailed, line-by-line logical explanations in simple terms.
            </p>
          </div>

          <div className="p-6 bg-zinc-950/45 border border-zinc-800/40 rounded-2xl backdrop-blur-md flex flex-col gap-4 glow-border">
            <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400 w-fit">
              <Zap className="h-5 w-5" />
            </div>
            <h3 className="text-xl font-bold text-zinc-100">Auto-Fallback Uptime</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              If an OpenRouter model fails or hits limits, the engine instantly falls back to another online model.
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}
