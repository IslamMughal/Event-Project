'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { 
  Menu, 
  Search, 
  X, 
  Calendar, 
  User, 
  Sparkles, 
  ChevronDown, 
  Heart, 
  PlusCircle, 
  Settings, 
  LogOut, 
  ShieldCheck 
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import { useSession, signOut } from 'next-auth/react'

import Image from 'next/image'

const Navbar = () => {
  const { data: session } = useSession()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)
  const isAdmin = (session?.user as any)?.role === 'ADMIN'

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const navLinks = [
    { title: 'Home', href: '/' },
    { title: 'Events', href: '/events' },
    { title: 'About', href: '/about' },
    { title: 'Contact', href: '/contact' },
  ]

  return (
    <header className="sticky top-0 z-[9999] w-full border-b border-purple-500/20 bg-background/80 backdrop-blur-md shadow-md">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex h-16 md:h-20 items-center justify-between gap-4">
        {/* Left: Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative h-10 w-10 sm:h-12 sm:w-12 rounded-full overflow-hidden bg-white border-2 border-purple-500/40 shadow-md shadow-purple-500/20 transition-transform group-hover:scale-105 duration-300 flex items-center justify-center shrink-0">
              <Image
                src="/logo.png"
                alt="Eventify Logo"
                fill
                className="object-contain p-0.5"
                unoptimized
              />
            </div>
            <div className="relative h-8 sm:h-10 w-36 sm:w-48 shrink-0 flex items-center">
              <Image
                src="/logo-text.png"
                alt="Eventify - Discover | Engage | Connect"
                fill
                className="object-contain object-left dark:hidden"
                unoptimized
                priority
              />
              <Image
                src="/logo-text-light.png"
                alt="Eventify - Discover | Engage | Connect"
                fill
                className="object-contain object-left hidden dark:block"
                unoptimized
                priority
              />
            </div>
          </Link>
        </div>

        {/* Center: Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-3">
          {navLinks.map((link) => (
            <Link
              key={link.title}
              href={link.href}
              className="text-xs sm:text-sm lg:text-base font-black uppercase tracking-wider text-foreground/80 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-100/60 dark:hover:bg-purple-950/60 px-3 py-1.5 rounded-xl transition-all duration-200"
            >
              {link.title}
            </Link>
          ))}
        </nav>

        {/* Right: Search & User Controls */}
        <div className="flex items-center gap-2 lg:gap-3">
          <div className="hidden md:flex items-center gap-2 lg:gap-3">
            <form action="/events" method="GET" className="relative w-36 lg:w-60">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-purple-500 pointer-events-none" />
              <Input
                type="search"
                name="search"
                placeholder="Search events..."
                className="pl-10 h-11 lg:h-12 text-xs sm:text-sm rounded-2xl border-2 border-purple-200 dark:border-purple-900/80 focus-visible:ring-2 focus-visible:ring-purple-600 bg-purple-50/60 dark:bg-purple-950/30 placeholder:text-muted-foreground/70 font-medium shadow-inner"
              />
            </form>
            {session ? (
              <div className="flex items-center gap-2">
                {/* Standalone Dashboard Button Outside */}
                <Link href={isAdmin ? "/admin" : "/dashboard"}>
                  <Button variant="ghost" className="h-11 lg:h-12 px-4 sm:px-5 font-black text-xs sm:text-sm uppercase tracking-wider text-purple-600 dark:text-purple-400 hover:bg-purple-100/80 dark:hover:bg-purple-950/60 rounded-2xl transition-all">
                    Dashboard
                  </Button>
                </Link>

                {/* Profile Trigger Button & Solid Dropdown Menu */}
                <div className="relative" ref={profileRef}>
                  <Button
                    variant="outline"
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="h-11 lg:h-12 px-4 sm:px-5 font-black text-xs sm:text-sm uppercase tracking-wider rounded-2xl border-2 border-purple-300 dark:border-purple-800 bg-white dark:bg-slate-900 hover:bg-purple-50 dark:hover:bg-purple-950/60 gap-2.5 flex items-center shadow-md shadow-purple-500/10"
                  >
                    {session.user?.image || (session.user as any)?.image ? (
                      <div className="relative h-7 w-7 rounded-full overflow-hidden shrink-0 border-2 border-purple-500/60 shadow-sm">
                        <Image
                          src={session.user?.image || (session.user as any)?.image}
                          alt="Profile photo"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    ) : (
                      <User className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    )}
                    <span className="max-w-[110px] lg:max-w-[140px] truncate">{session.user?.name || (session.user as any)?.username || 'User'}</span>
                    <ChevronDown className={`h-4.5 w-4.5 text-purple-600 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                  </Button>

                  {/* Solid Profile Dropdown Menu */}
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-slate-900 border border-purple-500/20 shadow-2xl p-2.5 z-[10000] animate-in fade-in slide-in-from-top-2 duration-200">
                      {/* User Info Header */}
                      <div className="p-3 bg-purple-500/10 rounded-xl mb-1 flex items-center gap-3">
                        <div className="relative h-10 w-10 rounded-full overflow-hidden shrink-0 border-2 border-purple-500/40 bg-white flex items-center justify-center">
                          {session.user?.image || (session.user as any)?.image ? (
                            <Image
                              src={session.user?.image || (session.user as any)?.image}
                              alt="Profile"
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          ) : (
                            <User className="h-5 w-5 text-purple-600" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-black truncate">{session.user?.name || (session.user as any)?.username || 'User'}</p>
                          <p className="text-xs text-muted-foreground truncate">{session.user?.email}</p>
                          <span className="inline-block mt-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-purple-700 text-white">
                            {isAdmin ? 'Admin' : 'User'}
                          </span>
                        </div>
                      </div>

                      <hr className="my-2 border-purple-500/20" />

                      {/* Navigation Items */}
                      <div className="space-y-0.5">
                        <Link
                          href="/dashboard"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-xl text-foreground hover:bg-purple-500/10 hover:text-purple-600 transition-colors"
                        >
                          <Calendar className="h-4 w-4 text-purple-600" />
                          <span>My RSVPs</span>
                        </Link>

                        <Link
                          href="/dashboard/favorites"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-xl text-foreground hover:bg-purple-500/10 hover:text-purple-600 transition-colors"
                        >
                          <Heart className="h-4 w-4 text-rose-500" />
                          <span>Favorites</span>
                        </Link>

                        <Link
                          href="/dashboard/create-event"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-xl text-foreground hover:bg-purple-500/10 hover:text-purple-600 transition-colors"
                        >
                          <PlusCircle className="h-4 w-4 text-emerald-500" />
                          <span>Create Event</span>
                        </Link>

                        <Link
                          href="/dashboard/profile"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-xl text-foreground hover:bg-purple-500/10 hover:text-purple-600 transition-colors"
                        >
                          <User className="h-4 w-4 text-blue-500" />
                          <span>Profile</span>
                        </Link>

                        <Link
                          href="/dashboard/settings"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-xl text-foreground hover:bg-purple-500/10 hover:text-purple-600 transition-colors"
                        >
                          <Settings className="h-4 w-4 text-slate-500" />
                          <span>Settings</span>
                        </Link>
                      </div>

                      <hr className="my-2 border-purple-500/20" />

                      {/* Logout Button */}
                      <button
                        onClick={() => {
                          setIsProfileOpen(false)
                          signOut()
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      >
                        <LogOut className="h-4 w-4 text-rose-600" />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <Link href="/auth/signin">
                <Button className="h-9 lg:h-10 px-5 font-black text-xs uppercase tracking-wider rounded-xl bg-purple-700 hover:bg-purple-800 text-white shadow-md shadow-purple-900/20 hover:scale-105 transition-all duration-200">
                  <Sparkles className="mr-1.5 h-4 w-4 text-amber-300 fill-current" /> Sign In
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Navigation */}
          <div className="flex md:hidden items-center gap-2">
            <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl border-2 border-purple-200 dark:border-purple-900" onClick={() => setIsSearchOpen(!isSearchOpen)}>
              <Search className="h-5 w-5 text-purple-600" />
            </Button>
            <Sheet>
              <SheetTrigger>
                <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl border-2 border-purple-200 dark:border-purple-900">
                  <Menu className="h-5 w-5 text-purple-600" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="border-purple-200 dark:border-purple-900 w-80">
                <div className="flex flex-col gap-5 mt-8">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="relative h-12 w-12 rounded-full overflow-hidden bg-white border-2 border-purple-500/40 shadow-md flex items-center justify-center shrink-0">
                      <Image src="/logo.png" alt="Logo" fill className="object-contain p-0.5" unoptimized />
                    </div>
                    <div className="relative h-10 w-44 shrink-0 flex items-center">
                      <Image src="/logo-text.png" alt="Eventify" fill className="object-contain object-left dark:hidden" unoptimized />
                      <Image src="/logo-text-light.png" alt="Eventify" fill className="object-contain object-left hidden dark:block" unoptimized />
                    </div>
                  </div>
                  {navLinks.map((link) => (
                    <Link
                      key={link.title}
                      href={link.href}
                      className="text-lg font-black transition-colors hover:text-purple-600 py-1"
                    >
                      {link.title}
                    </Link>
                  ))}
                  <hr className="my-2 border-purple-200 dark:border-purple-900" />
                  {session ? (
                    <div className="flex flex-col gap-2">
                      <div className="p-3 bg-purple-500/10 rounded-xl mb-2 flex items-center gap-3">
                        <div className="relative h-10 w-10 rounded-full overflow-hidden shrink-0 border-2 border-purple-500/40 bg-white flex items-center justify-center">
                          {session.user?.image || (session.user as any)?.image ? (
                            <Image src={session.user?.image || (session.user as any)?.image} alt="Profile" fill className="object-cover" unoptimized />
                          ) : (
                            <User className="h-5 w-5 text-purple-600" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-black truncate">{session.user?.name || (session.user as any)?.username || 'User'}</p>
                          <p className="text-xs text-muted-foreground truncate">{session.user?.email}</p>
                        </div>
                      </div>
                      {isAdmin && (
                        <Link href="/admin">
                          <Button className="w-full justify-start gap-3 h-10 bg-purple-700 hover:bg-purple-800 text-white font-bold text-sm rounded-xl">
                            <ShieldCheck className="h-4 w-4" /> Admin Dashboard
                          </Button>
                        </Link>
                      )}
                      <Link href="/dashboard">
                        <Button variant="ghost" className="w-full justify-start gap-3 h-10 font-bold text-sm rounded-xl">
                          <Calendar className="h-4 w-4 text-purple-600" /> My RSVPs
                        </Button>
                      </Link>
                      <Link href="/dashboard/favorites">
                        <Button variant="ghost" className="w-full justify-start gap-3 h-10 font-bold text-sm rounded-xl">
                          <Heart className="h-4 w-4 text-rose-500" /> Favorites
                        </Button>
                      </Link>
                      <Link href="/dashboard/create-event">
                        <Button variant="ghost" className="w-full justify-start gap-3 h-10 font-bold text-sm rounded-xl">
                          <PlusCircle className="h-4 w-4 text-emerald-500" /> Create Event
                        </Button>
                      </Link>
                      <Link href="/dashboard/profile">
                        <Button variant="ghost" className="w-full justify-start gap-3 h-10 font-bold text-sm rounded-xl">
                          <User className="h-4 w-4 text-blue-500" /> Profile
                        </Button>
                      </Link>
                      <Link href="/dashboard/settings">
                        <Button variant="ghost" className="w-full justify-start gap-3 h-10 font-bold text-sm rounded-xl">
                          <Settings className="h-4 w-4 text-slate-500" /> Settings
                        </Button>
                      </Link>
                      <Button variant="outline" className="w-full justify-start gap-3 h-10 font-bold text-sm rounded-xl border-rose-200 text-rose-600 hover:bg-rose-50 mt-2" onClick={() => signOut()}>
                        <LogOut className="h-4 w-4 text-rose-600" /> Logout
                      </Button>
                    </div>
                  ) : (
                    <Link href="/auth/signin">
                      <Button className="w-full h-11 bg-purple-700 hover:bg-purple-800 text-white font-black text-sm">Sign In</Button>
                    </Link>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Mobile Search Overlay */}
      {isSearchOpen && (
        <div className="md:hidden border-b border-purple-500/20 bg-background/80 backdrop-blur-md p-4 animate-in slide-in-from-top duration-300">
          <div className="relative flex items-center gap-2">
            <Input
              type="search"
              placeholder="Search events..."
              className="w-full h-11 text-sm border-2 border-purple-300 rounded-xl"
              autoFocus
            />
            <Button variant="ghost" size="icon" className="h-11 w-11" onClick={() => setIsSearchOpen(false)}>
              <X className="h-5 w-5 text-purple-600" />
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
