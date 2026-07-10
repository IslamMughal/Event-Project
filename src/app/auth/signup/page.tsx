'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Mail, Lock, User, AlertCircle, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

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
    <div className="w-full flex-grow flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-140px)] relative overflow-hidden bg-neutral-50/20 dark:bg-neutral-950/10">
      {/* Ambient backgrounds */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-neutral-200/20 dark:bg-neutral-800/10 blur-[80px] pointer-events-none" />
      <div className="absolute top-12 left-12 w-[200px] h-[200px] rounded-full bg-neutral-300/10 dark:bg-neutral-700/5 blur-[50px] pointer-events-none" />

      <Card className="w-full max-w-md shadow-3xl border border-neutral-200/50 dark:border-neutral-800/60 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl relative z-10 rounded-2xl transition-all duration-300">
        <CardHeader className="space-y-2 text-center pb-8 pt-8">
          <div className="flex justify-center mb-2">
            <div className="h-14 w-14 rounded-2xl bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 flex items-center justify-center shadow-lg shadow-neutral-200 dark:shadow-neutral-950 transition-transform hover:scale-105 duration-300">
              <Calendar className="h-6 w-6" />
            </div>
          </div>
          <CardTitle className="text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">Create an Account</CardTitle>
          <CardDescription className="text-sm text-neutral-500 dark:text-neutral-400 font-medium">
            Join our community to start discovering events
          </CardDescription>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          {success ? (
            <div className="bg-green-500/10 text-green-600 dark:text-green-400 p-6 rounded-2xl flex flex-col items-center gap-4 text-center border border-green-500/20 animate-in fade-in zoom-in-95 duration-300">
              <CheckCircle2 className="h-12 w-12 text-green-550 dark:text-green-400" />
              <div className="space-y-1">
                <p className="font-extrabold text-lg">Registration Successful!</p>
                <p className="text-sm font-medium opacity-80">Redirecting you to the sign-in page...</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-destructive/10 text-destructive text-sm p-3.5 rounded-xl flex items-center gap-2.5 border border-destructive/20 animate-in fade-in slide-in-from-top-1 duration-200">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span className="font-semibold">{error}</span>
                </div>
              )}
              
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">Username</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-neutral-400 pointer-events-none" />
                    <Input
                      name="username"
                      placeholder="Username"
                      className="pl-11 h-12 rounded-xl border-neutral-200 dark:border-neutral-800 focus-visible:ring-1 focus-visible:ring-black dark:focus-visible:ring-white bg-neutral-50/50 dark:bg-neutral-950/20 font-medium transition-all"
                      value={formData.username}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-neutral-400 pointer-events-none" />
                    <Input
                      name="email"
                      type="email"
                      placeholder="name@example.com"
                      className="pl-11 h-12 rounded-xl border-neutral-200 dark:border-neutral-800 focus-visible:ring-1 focus-visible:ring-black dark:focus-visible:ring-white bg-neutral-50/50 dark:bg-neutral-950/20 font-medium transition-all"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-neutral-400 pointer-events-none" />
                    <Input
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-11 h-12 rounded-xl border-neutral-200 dark:border-neutral-800 focus-visible:ring-1 focus-visible:ring-black dark:focus-visible:ring-white bg-neutral-50/50 dark:bg-neutral-950/20 font-medium transition-all"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-neutral-400 pointer-events-none" />
                    <Input
                      name="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      className="pl-11 h-12 rounded-xl border-neutral-200 dark:border-neutral-800 focus-visible:ring-1 focus-visible:ring-black dark:focus-visible:ring-white bg-neutral-50/50 dark:bg-neutral-950/20 font-medium transition-all"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <Button className="w-full h-12 mt-2 font-extrabold rounded-xl bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-100 shadow-md transition-all active:scale-[0.99] duration-150 uppercase tracking-wider text-xs" type="submit" disabled={loading}>
                {loading ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-4 text-center border-t border-neutral-100 dark:border-neutral-800/60 py-6 bg-neutral-50/30 dark:bg-neutral-950/10 rounded-b-2xl">
          <div className="text-sm font-semibold text-neutral-500 dark:text-neutral-450">
            Already have an account?{' '}
            <Link href="/auth/signin">
              <Button variant="link" className="p-0 h-auto text-black dark:text-white hover:text-neutral-700 dark:hover:text-neutral-300 font-bold transition-colors">
                Sign in
              </Button>
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
