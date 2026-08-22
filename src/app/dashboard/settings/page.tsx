'use client'

import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Settings, Bell, Shield, Eye, Save, Loader2, Smartphone, Globe, CheckCircle2 } from 'lucide-react'

export default function SettingsPage() {
  const { data: session } = useSession()

  // Notification Preferences
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [eventReminders, setEventReminders] = useState(true)
  const [marketingEmails, setMarketingEmails] = useState(false)

  // Privacy Settings
  const [publicProfile, setPublicProfile] = useState(true)
  const [showRsvps, setShowRsvps] = useState(true)

  // Security Settings
  const [twoFactorAuth, setTwoFactorAuth] = useState(false)

  // UI state
  const [saving, setSaving] = useState(false)
  const [savedMessage, setSavedMessage] = useState('')

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setSavedMessage('')

    setTimeout(() => {
      setSaving(false)
      setSavedMessage('Settings updated successfully!')
      setTimeout(() => setSavedMessage(''), 3000)
    }, 600)
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground">Manage your notification preferences, privacy, and account security.</p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-8">
        {/* Notifications Card */}
        <Card className="rounded-[2rem] shadow-xl border-none">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Bell className="h-5 w-5 text-purple-600" /> Notifications & Alerts
            </CardTitle>
            <CardDescription>Control when and how Eventify contacts you.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/40 hover:bg-muted/60 transition-colors">
              <div className="space-y-0.5">
                <p className="font-semibold text-sm">Email Notifications</p>
                <p className="text-xs text-muted-foreground">Receive emails about your account activity and event updates.</p>
              </div>
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
                className="h-5 w-5 rounded accent-purple-600 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/40 hover:bg-muted/60 transition-colors">
              <div className="space-y-0.5">
                <p className="font-semibold text-sm">Event Reminders</p>
                <p className="text-xs text-muted-foreground">Get reminder emails 24 hours before your RSVP'd events start.</p>
              </div>
              <input
                type="checkbox"
                checked={eventReminders}
                onChange={(e) => setEventReminders(e.target.checked)}
                className="h-5 w-5 rounded accent-purple-600 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/40 hover:bg-muted/60 transition-colors">
              <div className="space-y-0.5">
                <p className="font-semibold text-sm">Marketing & Promotions</p>
                <p className="text-xs text-muted-foreground">Receive news about trending local events, features, and community announcements.</p>
              </div>
              <input
                type="checkbox"
                checked={marketingEmails}
                onChange={(e) => setMarketingEmails(e.target.checked)}
                className="h-5 w-5 rounded accent-purple-600 cursor-pointer"
              />
            </div>
          </CardContent>
        </Card>

        {/* Privacy Card */}
        <Card className="rounded-[2rem] shadow-xl border-none">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Eye className="h-5 w-5 text-purple-600" /> Privacy & Visibility
            </CardTitle>
            <CardDescription>Manage who can view your profile and event participation.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/40 hover:bg-muted/60 transition-colors">
              <div className="space-y-0.5">
                <p className="font-semibold text-sm">Public Profile</p>
                <p className="text-xs text-muted-foreground">Allow other community members to view your organizer profile and public events.</p>
              </div>
              <input
                type="checkbox"
                checked={publicProfile}
                onChange={(e) => setPublicProfile(e.target.checked)}
                className="h-5 w-5 rounded accent-purple-600 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/40 hover:bg-muted/60 transition-colors">
              <div className="space-y-0.5">
                <p className="font-semibold text-sm">Show Attended Events</p>
                <p className="text-xs text-muted-foreground">Display events you're attending on your public profile page.</p>
              </div>
              <input
                type="checkbox"
                checked={showRsvps}
                onChange={(e) => setShowRsvps(e.target.checked)}
                className="h-5 w-5 rounded accent-purple-600 cursor-pointer"
              />
            </div>
          </CardContent>
        </Card>

        {/* Security & System */}
        <Card className="rounded-[2rem] shadow-xl border-none">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Shield className="h-5 w-5 text-purple-600" /> Account Security
            </CardTitle>
            <CardDescription>Manage authentication and device access.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/40 hover:bg-muted/60 transition-colors">
              <div className="space-y-0.5">
                <p className="font-semibold text-sm">Two-Factor Authentication (2FA)</p>
                <p className="text-xs text-muted-foreground">Add an extra layer of security to your account using an authenticator app.</p>
              </div>
              <input
                type="checkbox"
                checked={twoFactorAuth}
                onChange={(e) => setTwoFactorAuth(e.target.checked)}
                className="h-5 w-5 rounded accent-purple-600 cursor-pointer"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t pt-6">
            {savedMessage && (
              <div className="flex items-center gap-2 text-green-600 text-sm font-semibold">
                <CheckCircle2 className="h-4 w-4" /> {savedMessage}
              </div>
            )}
            <div className="ml-auto">
              <Button type="submit" className="rounded-xl h-12 px-8 font-bold gap-2 bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-600/20" disabled={saving}>
                {saving ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Saving Settings...</>
                ) : (
                  <><Save className="h-4 w-4" /> Save Preferences</>
                )}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
