"use client"

import { signIn } from "next-auth/react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Code2, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#030712] text-zinc-100 bg-grid px-4 overflow-hidden">
      {/* Backdrops */}
      <div className="absolute top-[20%] left-[20%] w-[350px] h-[350px] rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[20%] w-[350px] h-[350px] rounded-full bg-violet-600/10 blur-[100px] pointer-events-none" />

      {/* Floating Back Link */}
      <Link 
        href="/"
        className="absolute top-6 left-6 text-zinc-400 hover:text-white flex items-center gap-2 text-sm font-medium transition cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4" /> Back to home
      </Link>

      <Card className="w-full max-w-md glass rounded-3xl p-8 flex flex-col gap-6 relative z-10 border border-zinc-800/60 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        <CardHeader className="text-center flex flex-col items-center gap-4">
          <div className="p-3 bg-indigo-500/10 border border-indigo-500/25 rounded-2xl text-indigo-400">
            <Code2 className="h-8 w-8" />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500">
              Welcome back
            </CardTitle>
            <CardDescription className="text-zinc-400 text-sm">
              Sign in to your CodeGen AI account
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="flex flex-col gap-4">
          <Button
            onClick={() => signIn("github", { callbackUrl: "/dashboard/generator" })}
            className="w-full h-12 flex items-center justify-center gap-3 border border-zinc-800 bg-zinc-900 hover:bg-zinc-800/80 text-white font-semibold rounded-xl shadow-sm transition duration-300 cursor-pointer"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.11.82-.26.82-.577v-2.234c-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.82 1.102.82 2.222v3.293c0 .319.22.694.825.576C20.565 21.795 24 17.3 24 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            Continue with GitHub
          </Button>

          <Button
            onClick={() => signIn("google", { callbackUrl: "/dashboard/generator" })}
            className="w-full h-12 flex items-center justify-center gap-3 border border-zinc-800 bg-zinc-900 hover:bg-zinc-800/80 text-white font-semibold rounded-xl shadow-sm transition duration-300 cursor-pointer"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.69c-.29 1.5-.1.14-1.14 2.83c-.88 2.3-3.01 3.92-5.55 3.92c-3.4 0-6.17-2.77-6.17-6.17s2.77-6.17 6.17-6.17c1.47 0 2.82.52 3.88 1.38l2.93-2.93C17.91 3.26 15.11 2 12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.73 0 9.87-4 9.87-9.73c0-.36-.03-.73-.08-1z"/>
            </svg>
            Continue with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
