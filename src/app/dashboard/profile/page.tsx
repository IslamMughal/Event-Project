'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { User, Mail, Shield, Save, Camera, Loader2 } from 'lucide-react'

import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const { data: session, update } = useSession()
  const router = useRouter()
  const [username, setUsername] = useState(session?.user?.name || '')
  const [avatarUrl, setAvatarUrl] = useState<string>((session?.user as any)?.image || session?.user?.image || '')
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [saveMessage, setSaveMessage] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // 1. Set initial from session
    if (session?.user) {
      if (session.user.name) setUsername(session.user.name)
      if (session.user.image || (session.user as any).image) {
        setAvatarUrl((session.user.image || (session.user as any).image) as string)
      }
    }

    // 2. Fetch fresh profile from database to ensure exact sync
    fetch('/api/user/profile')
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json?.data) {
          if (json.data.username) setUsername(json.data.username)
          if (json.data.image) setAvatarUrl(json.data.image)
        }
      })
      .catch((err) => console.error('Error fetching profile:', err))
  }, [session])

  const handleCameraClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Permissive file validation: check MIME type OR file extension
    // Windows browsers can report empty file.type for certain images (.jpg, .png, .webp, etc.)
    const allowedExtensions = /\.(jpg|jpeg|png|gif|webp|avif|svg|bmp)$/i
    const isValidType = (file.type && file.type.startsWith('image/')) || allowedExtensions.test(file.name)

    if (!isValidType) {
      setUploadError('Please select a valid image file (jpg, png, webp, etc).')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image must be smaller than 5MB.')
      return
    }

    setUploadError('')
    setUploading(true)

    try {
      const formData = new FormData()
      const mimeType = file.type || 'image/jpeg'
      const fixedFile = new File([file], file.name, { type: mimeType })
      formData.append('file', fixedFile)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const json = await res.json()

      if (!res.ok) {
        throw new Error(json?.error?.message || 'Upload failed')
      }

      const url = json.data.url
      setAvatarUrl(url)

      // Save updated avatar URL to user profile
      await saveProfile(username, url)
    } catch (err: any) {
      setUploadError(err.message || 'Upload failed. Please try again.')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const saveProfile = async (name: string, image?: string) => {
    setSaving(true)
    setSaveMessage('')
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: name,
          ...(image !== undefined && { image }),
        }),
      })

      const json = await res.json()
      if (!res.ok) throw new Error(json?.error?.message || 'Save failed')

      setUsername(json.data.username)
      if (json.data.image) setAvatarUrl(json.data.image)

      await update({ name: json.data.username, username: json.data.username, image: json.data.image })
      router.refresh()
      setSaveMessage('Profile saved successfully!')
      setTimeout(() => setSaveMessage(''), 3000)
    } catch (err: any) {
      setSaveMessage(err.message || 'Save failed.')
    } finally {
      setSaving(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    await saveProfile(username, avatarUrl || undefined)
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Your Profile</h1>
        <p className="text-muted-foreground">Manage your account information and preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 rounded-[2rem] shadow-xl border-none">
          <CardHeader>
            <CardTitle>Personal Details</CardTitle>
            <CardDescription>Update your basic identity information.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center gap-2">
                    <User className="h-4 w-4 text-primary" /> Display Name
                  </label>
                  <Input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="rounded-xl h-12"
                    placeholder="Your display name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center gap-2">
                    <Mail className="h-4 w-4 text-primary" /> Email Address
                  </label>
                  <Input defaultValue={session?.user?.email || ''} disabled className="rounded-xl h-12 bg-muted/50" />
                </div>
              </div>

              {saveMessage && (
                <p className={`text-sm font-medium ${saveMessage.includes('successfully') ? 'text-green-600' : 'text-destructive'}`}>
                  {saveMessage}
                </p>
              )}

              <div className="pt-4 flex justify-end">
                <Button className="rounded-xl h-12 px-8 font-bold gap-2" disabled={saving || uploading}>
                  {saving ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</>
                  ) : (
                    <><Save className="h-4 w-4" /> Save Changes</>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="rounded-[2rem] shadow-xl border-none text-center p-6">
            <div className="relative mx-auto w-32 h-32 mb-4">
              <div className="w-full h-full rounded-full bg-primary/10 flex items-center justify-center border-4 border-background shadow-lg overflow-hidden">
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt="Profile picture"
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="h-16 w-16 text-primary" />
                )}
              </div>
              <Button
                type="button"
                size="icon"
                variant="secondary"
                onClick={handleCameraClick}
                disabled={uploading}
                className="absolute bottom-0 right-0 rounded-full h-10 w-10 border-4 border-background shadow-md"
                title="Upload profile photo"
              >
                {uploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Camera className="h-4 w-4" />
                )}
              </Button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {uploadError && (
              <p className="text-xs text-destructive mb-2">{uploadError}</p>
            )}

            {uploading && (
              <p className="text-xs text-muted-foreground mb-2">Uploading photo…</p>
            )}

            <h3 className="font-bold text-xl">{username || session?.user?.name || 'User'}</h3>
            <p className="text-sm text-muted-foreground mb-6">Member since 2026</p>
            <div className="flex justify-center gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold">12</p>
                <p className="text-[10px] uppercase font-bold text-muted-foreground">Joined</p>
              </div>
              <div className="w-px h-10 bg-border" />
              <div className="text-center">
                <p className="text-2xl font-bold">5</p>
                <p className="text-[10px] uppercase font-bold text-muted-foreground">Created</p>
              </div>
            </div>
          </Card>

          <Card className="rounded-[2rem] shadow-xl border-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" /> Security
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full rounded-xl h-12 font-semibold">Change Password</Button>
            </CardContent>
            <CardFooter>
              <p className="text-[10px] text-muted-foreground text-center w-full">
                Last password change: 3 months ago
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
