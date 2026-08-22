'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Menu, Search, X, Calendar, User, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import { useSession, signOut } from 'next-auth/react'

import Image from 'next/image'

const Navbar = () => {
  const { data: session } = useSession()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const isAdmin = (session?.user as any)?.role === 'ADMIN'

  const navLinks = [
    { title: 'Home', href: '/' },
    { title: 'Events', href: '/events' },
    { title: 'About', href: '/about' },
    { title: 'Contact', href: '/contact' },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-purple-500/20 bg-background/90 backdrop-blur-2xl shadow-md">
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
            <form action="/events" method="GET" className="relative w-36 lg:w-56">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-purple-500 pointer-events-none" />
              <Input
                type="search"
                name="search"
                placeholder="Search events..."
                className="pl-9 h-9 lg:h-10 text-xs sm:text-sm rounded-xl border-2 border-purple-200 dark:border-purple-900/80 focus-visible:ring-2 focus-visible:ring-purple-600 bg-purple-50/60 dark:bg-purple-950/30 placeholder:text-muted-foreground/70 font-medium shadow-inner"
              />
            </form>
            {session ? (
              <div className="flex items-center gap-1.5 lg:gap-2">
                {isAdmin ? (
                  <Link href="/admin">
                    <Button variant="ghost" className="h-9 lg:h-10 px-3 font-black text-xs uppercase tracking-wider text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-950/60 rounded-xl">Admin</Button>
                  </Link>
                ) : null}
                <Link href="/dashboard">
                  <Button variant="ghost" className="h-9 lg:h-10 px-2.5 sm:px-3 font-black text-xs uppercase tracking-wider hover:bg-purple-100 dark:hover:bg-purple-950/60 rounded-xl gap-1.5 flex items-center">
                    {session.user?.image || (session.user as any)?.image ? (
                      <div className="relative h-6 w-6 rounded-full overflow-hidden shrink-0 border border-purple-500/50 shadow-sm">
                        <Image
                          src={session.user?.image || (session.user as any)?.image}
                          alt="Profile photo"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    ) : (
                      <User className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    )}
                    <span className="max-w-[80px] lg:max-w-[120px] truncate">{session.user?.name || (session.user as any)?.username || 'User'}</span>
                  </Button>
                </Link>
                <Button variant="outline" className="h-9 lg:h-10 px-3 font-bold text-xs uppercase tracking-wider rounded-xl border-2 border-purple-200 dark:border-purple-900 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-300 transition-all" onClick={() => signOut()}>Logout</Button>
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
              <SheetTrigger render={<Button variant="outline" size="icon" className="h-9 w-9 rounded-xl border-2 border-purple-200 dark:border-purple-900" />}>
                <Menu className="h-5 w-5 text-purple-600" />
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
                    <div className="flex flex-col gap-3">
                      {isAdmin ? (
                        <Link href="/admin">
                          <Button className="w-full h-11 bg-purple-700 hover:bg-purple-800 text-white font-black text-sm">Admin</Button>
                        </Link>
                      ) : null}
                      <Link href="/dashboard">
                        <Button className="w-full h-11 bg-purple-700 hover:bg-purple-800 text-white font-black text-sm">Dashboard</Button>
                      </Link>
                      <Button variant="outline" className="h-11 font-bold text-sm border-2" onClick={() => signOut()}>Logout</Button>
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
        <div className="md:hidden border-b-2 border-purple-200 bg-background p-4 animate-in slide-in-from-top duration-300">
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
