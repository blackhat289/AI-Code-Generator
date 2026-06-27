"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { FileCode, FileSearch, LogOut, Code2, LayoutDashboard, Sun, Moon } from "lucide-react"

export default function DashboardLayout({ children }) {
  const [theme, setTheme] = useState("dark")

  useEffect(() => {
    // Sync with HTML class
    const root = window.document.documentElement
    if (theme === "light") {
      root.classList.add("light")
    } else {
      root.classList.remove("light")
    }
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => (prev === "dark" ? "light" : "dark"))
  }

  return (
    <div className="flex h-screen bg-background text-foreground bg-grid overflow-hidden">
      {/* Decorative Blur Backdrops */}
      <div className="absolute top-[10%] left-[10%] w-[300px] h-[300px] rounded-full bg-primary/5 blur-[80px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[10%] w-[300px] h-[300px] rounded-full bg-accent/5 blur-[80px] pointer-events-none" />

      {/* Sidebar */}
      <aside className="w-64 border-r border-[#1E293B] dark:border-border bg-sidebar flex flex-col h-full shrink-0 relative z-10">
        <div className="h-16 px-6 border-b border-[#1E293B] dark:border-border bg-muted flex items-center gap-2">
          <div className="p-1.5 bg-primary/10 border border-primary/25 rounded-lg text-primary dark:text-primary">
            <Code2 className="h-5 w-5" />
          </div>
          <span className="font-extrabold text-lg text-white dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r dark:from-primary dark:via-accent dark:to-pink-500">
            CodeGen AI
          </span>
        </div>
        
        <nav className="flex-1 p-4 space-y-1.5">
          <Link
            href="/dashboard/generator"
            className="flex items-center gap-3 px-4.5 py-3 text-sm font-medium rounded-xl text-[var(--color-sidebar-foreground)] hover:bg-secondary border border-transparent hover:border-border transition duration-300 cursor-pointer"
          >
            <FileCode className="h-4.5 w-4.5 text-primary" />
            Code Generator
          </Link>

          <Link
            href="/dashboard/explain"
            className="flex items-center gap-3 px-4.5 py-3 text-sm font-medium rounded-xl text-[var(--color-sidebar-foreground)] hover:bg-secondary border border-transparent hover:border-border transition duration-300 cursor-pointer"
          >
            <FileSearch className="h-4.5 w-4.5 text-emerald-500" />
            Code Explainer
          </Link>
        </nav>

        <div className="p-4 border-t border-[#1E293B] dark:border-border">
          <Link
            href="/api/auth/signout"
            className="flex items-center gap-3 px-4.5 py-3 text-sm font-medium rounded-xl text-rose-500 hover:text-rose-100 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition duration-300 cursor-pointer"
          >
            <LogOut className="h-4.5 w-4.5" />
            Sign Out
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative z-10">
        <header className="h-16 border-b border-[#1E293B] dark:border-border bg-muted flex items-center justify-between px-8">
          <div className="flex items-center gap-2 text-white text-sm font-bold">
            <LayoutDashboard className="h-4.5 w-4.5 text-indigo-400 dark:text-primary" />
            <span>Workspace</span>
            <span className="opacity-60">/</span>
            <span>Dashboard</span>
          </div>
          <button
            onClick={toggleTheme}
            className="h-9 w-9 rounded-xl border border-white/20 dark:border-border bg-white/10 hover:bg-white/20 dark:bg-secondary text-white dark:text-muted-foreground flex items-center justify-center transition duration-300 cursor-pointer shadow-sm"
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {theme === "dark" ? (
              <Sun className="h-4.5 w-4.5 text-amber-500 animate-pulse" />
            ) : (
              <Moon className="h-4.5 w-4.5 text-indigo-400" />
            )}
          </button>
        </header>
        <div className="flex-1 overflow-y-auto p-8 bg-background text-foreground transition-colors duration-300">
          {children}
        </div>
      </main>
    </div>
  )
}
