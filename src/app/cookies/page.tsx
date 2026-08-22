'use client'

import React, { useState } from 'react'
import { Cookie, CheckCircle, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function CookiesPage() {
  const [preferences, setPreferences] = useState({
    essential: true, // always required
    analytics: true,
    functional: true,
    marketing: false,
  })
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="container max-w-4xl px-4 py-16 md:py-24 space-y-10 animate-in fade-in duration-500">
      <div className="space-y-4 border-b border-purple-500/20 pb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-100 dark:bg-purple-950/60 border border-purple-300 dark:border-purple-800 text-purple-700 dark:text-purple-400 text-xs font-black">
          <Cookie className="h-4 w-4" /> Privacy & Cookie Preferences
        </div>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-foreground">Cookie Settings</h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Manage how cookies and tracking technologies are used during your visit on Eventify.
        </p>
      </div>

      {saved && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center gap-3 font-bold text-sm">
          <CheckCircle className="h-5 w-5" /> Your cookie preferences have been updated successfully!
        </div>
      )}

      <div className="space-y-6">
        <div className="p-6 rounded-3xl bg-card border shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-lg">Essential Cookies (Required)</h2>
            <span className="text-xs font-black uppercase bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-400 px-3 py-1 rounded-full">Always Active</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Necessary for site security, account session management, and fundamental navigation features.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-card border shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-lg">Analytics & Performance Cookies</h2>
            <input
              type="checkbox"
              checked={preferences.analytics}
              onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
              className="h-5 w-5 rounded border-purple-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Allows us to count visits, analyze traffic sources, and optimize page load speeds across Eventify.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-card border shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-lg">Functional & Customization Cookies</h2>
            <input
              type="checkbox"
              checked={preferences.functional}
              onChange={(e) => setPreferences({ ...preferences, functional: e.target.checked })}
              className="h-5 w-5 rounded border-purple-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Remembers user preferences like favorite event filters, map zoom settings, and layout choices.
          </p>
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={handleSave} className="h-12 px-8 font-black text-sm rounded-2xl bg-purple-700 hover:bg-purple-800 text-white shadow-lg gap-2">
            <Save className="h-4 w-4" /> Save Preferences
          </Button>
        </div>
      </div>
    </div>
  )
}
