'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Mail, Lock, User, AlertCircle, CheckCircle2, Eye, EyeOff, Sparkles, ArrowRight } from 'lucide-react'

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Basic Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error?.message || 'Something went wrong during registration')
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/auth/signin')
      }, 2000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-140px)] relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/auth-bg.jpg"
          alt="Event background"
          fill
          priority
          className="object-cover object-center brightness-[0.35] dark:brightness-[0.25]"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo and Brand Header */}
        <div className="text-center mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
          <Link href="/" className="inline-flex flex-col items-center gap-4 group">
            <div className="relative h-24 w-24 sm:h-28 sm:w-28 rounded-full overflow-hidden bg-white border-4 border-purple-500/40 shadow-2xl shadow-purple-500/30 transition-all duration-300 group-hover:scale-105 group-hover:border-purple-500/80 flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="Eventify Logo"
                fill
                className="object-contain p-2"
                unoptimized
              />
            </div>
            <div className="relative h-12 w-80 sm:h-14 sm:w-96 drop-shadow-[0_4px_12px_rgba(168,85,247,0.5)]">
              {/* Always use logo-text-light.png on the dark background image for high visibility */}
              <Image
                src="/logo-text-light.png"
                alt="Eventify"
                fill
                className="object-contain"
                unoptimized
              />
            </div>
          </Link>
        </div>

        {/* Sign-up Card */}
        <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl rounded-3xl border border-purple-200/50 dark:border-purple-800/40 shadow-2xl shadow-purple-500/10 dark:shadow-purple-900/20 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700 [animation-delay:150ms]">
          {/* Card Header */}
          <div className="px-8 pt-8 pb-2 text-center">
            <div className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-purple-600 dark:text-purple-400 mb-3">
              <Sparkles className="h-3 w-3" /> Get Started
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              Create an Account
            </h1>
            <p className="text-sm text-muted-foreground mt-1.5 font-medium">
              Join our community to start discovering events
            </p>
          </div>

          {/* Card Body */}
          <div className="px-8 py-6">
            {success ? (
              <div className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 p-6 rounded-2xl flex flex-col items-center gap-4 text-center border border-emerald-500/20 animate-in fade-in zoom-in-95 duration-300">
                <div className="h-14 w-14 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <div className="space-y-1">
                  <p className="font-extrabold text-lg">Registration Successful!</p>
                  <p className="text-sm font-medium opacity-80">Redirecting you to the sign-in page...</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="bg-rose-500/10 text-rose-600 dark:text-rose-400 text-sm p-3.5 rounded-xl flex items-center gap-2.5 border border-rose-500/20 animate-in fade-in slide-in-from-top-1 duration-200">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span className="font-semibold">{error}</span>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-wider text-purple-600/70 dark:text-purple-400/70">
                      Username
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-purple-400 pointer-events-none" />
                      <Input
                        name="username"
                        placeholder="Choose a username"
                        className="pl-11 h-12 rounded-xl border-purple-200 dark:border-purple-900/60 focus-visible:ring-2 focus-visible:ring-purple-600 dark:focus-visible:ring-purple-500 bg-purple-50/30 dark:bg-purple-950/20 font-medium transition-all"
                        value={formData.username}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-wider text-purple-600/70 dark:text-purple-400/70">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-purple-400 pointer-events-none" />
                      <Input
                        name="email"
                        type="email"
                        placeholder="name@example.com"
                        className="pl-11 h-12 rounded-xl border-purple-200 dark:border-purple-900/60 focus-visible:ring-2 focus-visible:ring-purple-600 dark:focus-visible:ring-purple-500 bg-purple-50/30 dark:bg-purple-950/20 font-medium transition-all"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-wider text-purple-600/70 dark:text-purple-400/70">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-purple-400 pointer-events-none" />
                      <Input
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        className="pl-11 pr-11 h-12 rounded-xl border-purple-200 dark:border-purple-900/60 focus-visible:ring-2 focus-visible:ring-purple-600 dark:focus-visible:ring-purple-500 bg-purple-50/30 dark:bg-purple-950/20 font-medium transition-all"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-3.5 text-purple-300 hover:text-purple-600 dark:hover:text-purple-300 focus:outline-none transition-colors"
                        title={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-black uppercase tracking-wider text-purple-600/70 dark:text-purple-400/70">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-purple-400 pointer-events-none" />
                      <Input
                        name="confirmPassword"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        className="pl-11 pr-11 h-12 rounded-xl border-purple-200 dark:border-purple-900/60 focus-visible:ring-2 focus-visible:ring-purple-600 dark:focus-visible:ring-purple-500 bg-purple-50/30 dark:bg-purple-950/20 font-medium transition-all"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-3.5 text-purple-300 hover:text-purple-600 dark:hover:text-purple-300 focus:outline-none transition-colors"
                        title={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full h-12 mt-2 font-black rounded-xl bg-purple-700 hover:bg-purple-800 text-white shadow-lg shadow-purple-700/30 hover:shadow-purple-800/40 transition-all active:scale-[0.99] duration-200 uppercase tracking-wider text-xs flex items-center justify-center gap-2"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            )}
          </div>

          {/* Card Footer */}
          <div className="px-8 py-5 text-center border-t border-purple-100 dark:border-purple-900/40 bg-purple-50/30 dark:bg-purple-950/10">
            <p className="text-sm font-semibold text-muted-foreground">
              Already have an account?{' '}
              <Link
                href="/auth/signin"
                className="text-purple-600 dark:text-purple-400 font-black hover:text-purple-700 dark:hover:text-purple-300 transition-colors hover:underline underline-offset-2"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Bottom tagline */}
        <p className="text-center text-[11px] font-medium text-muted-foreground/60 mt-6 animate-in fade-in duration-700 [animation-delay:300ms]">
          Discover | Engage | Connect
        </p>
      </div>
    </div>
  )
}
