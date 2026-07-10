'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Mail, Lock, AlertCircle } from 'lucide-react'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (res?.error) {
      setError('Invalid email or password')
      setLoading(false)
    } else {
      router.push('/')
      router.refresh()
    }
  }

  return (
    <div className="w-full flex-grow flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-140px)] relative overflow-hidden bg-neutral-50/20 dark:bg-neutral-950/10">
      {/* Ambient backgrounds */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-neutral-200/20 dark:bg-neutral-800/10 blur-[80px] pointer-events-none" />
      <div className="absolute top-12 right-12 w-[200px] h-[200px] rounded-full bg-neutral-300/10 dark:bg-neutral-700/5 blur-[50px] pointer-events-none" />

      <Card className="w-full max-w-md shadow-3xl border border-neutral-200/50 dark:border-neutral-800/60 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl relative z-10 rounded-2xl transition-all duration-300">
        <CardHeader className="space-y-2 text-center pb-8 pt-8">
          <div className="flex justify-center mb-2">
            <div className="h-14 w-14 rounded-2xl bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 flex items-center justify-center shadow-lg shadow-neutral-200 dark:shadow-neutral-950 transition-transform hover:scale-105 duration-300">
              <Calendar className="h-6 w-6" />
            </div>
          </div>
          <CardTitle className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">Welcome Back</CardTitle>
          <CardDescription className="text-sm text-neutral-500 dark:text-neutral-400 font-medium">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-destructive/10 text-destructive text-sm p-3.5 rounded-xl flex items-center gap-2.5 border border-destructive/20 animate-in fade-in slide-in-from-top-1 duration-200">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span className="font-semibold">{error}</span>
              </div>
            )}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-neutral-400 pointer-events-none" />
                  <Input
                    type="email"
                    placeholder="name@example.com"
                    className="pl-11 h-12 rounded-xl border-neutral-200 dark:border-neutral-800 focus-visible:ring-1 focus-visible:ring-black dark:focus-visible:ring-white bg-neutral-50/50 dark:bg-neutral-950/20 font-medium transition-all"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">Password</label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-neutral-400 pointer-events-none" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    className="pl-11 h-12 rounded-xl border-neutral-200 dark:border-neutral-800 focus-visible:ring-1 focus-visible:ring-black dark:focus-visible:ring-white bg-neutral-50/50 dark:bg-neutral-950/20 font-medium transition-all"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>
            
            <Button className="w-full h-12 font-extrabold rounded-xl bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-100 shadow-md transition-all active:scale-[0.99] duration-150 uppercase tracking-wider text-xs" type="submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 text-center border-t border-neutral-100 dark:border-neutral-800/60 py-6 bg-neutral-50/30 dark:bg-neutral-950/10 rounded-b-2xl">
          <div className="text-sm font-semibold text-neutral-500 dark:text-neutral-450">
            Don't have an account?{' '}
            <Link href="/auth/signup">
              <Button variant="link" className="p-0 h-auto text-black dark:text-white hover:text-neutral-700 dark:hover:text-neutral-300 font-bold transition-colors">
                Sign up
              </Button>
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
