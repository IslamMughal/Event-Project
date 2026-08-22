'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Menu, Search, X, Calendar, User, Sparkles, Flame } from 'lucide-react'
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
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex h-24 md:h-28 items-center justify-between gap-4">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-3.5 group">
            <div className="relative h-14 w-14 sm:h-16 sm:w-16 rounded-full overflow-hidden bg-white border-2 border-purple-500/40 shadow-xl shadow-purple-500/30 transition-transform group-hover:scale-105 duration-300 flex items-center justify-center shrink-0">
              <Image
                src="/logo.png"
                alt="Eventify Logo"
                fill
                className="object-contain p-0.5"
                unoptimized
              />
            </div>
            <div className="relative h-12 sm:h-16 w-48 sm:w-60 shrink-0 flex items-center">
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
          <nav className="hidden md:flex items-center gap-2 lg:gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.title}
                href={link.href}
                className="text-sm sm:text-base lg:text-lg font-black uppercase tracking-wider text-foreground/80 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-100/60 dark:hover:bg-purple-950/60 px-3.5 py-2 rounded-xl transition-all duration-200"
              >
                {link.title}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-4">
            <form action="/events" method="GET" className="relative w-full max-w-xs lg:max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-purple-500 pointer-events-none" />
              <Input
                type="search"
                name="search"
                placeholder="Search events..."
                className="pl-11 h-11 lg:h-12 text-sm sm:text-base w-48 lg:w-72 rounded-2xl border-2 border-purple-200 dark:border-purple-900/80 focus-visible:ring-2 focus-visible:ring-purple-600 bg-purple-50/60 dark:bg-purple-950/30 placeholder:text-muted-foreground/70 font-medium shadow-inner"
              />
            </form>
            {session ? (
              <div className="flex items-center gap-2">
                {isAdmin ? (
                  <Link href="/admin">
                    <Button variant="ghost" className="h-11 lg:h-12 px-4 font-black text-xs sm:text-sm uppercase tracking-wider text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-950/60 rounded-xl">Admin</Button>
                  </Link>
                ) : null}
                <Link href="/dashboard">
                  <Button variant="ghost" className="h-11 lg:h-12 px-4 font-black text-xs sm:text-sm uppercase tracking-wider hover:bg-purple-100 dark:hover:bg-purple-950/60 rounded-xl">
                    <User className="mr-2 h-5 w-5 text-purple-600 dark:text-purple-400" /> {session.user?.name}
                  </Button>
                </Link>
                <Button variant="outline" className="h-11 lg:h-12 px-4 font-bold text-xs sm:text-sm uppercase tracking-wider rounded-xl border-2 border-purple-200 dark:border-purple-900 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-300 transition-all" onClick={() => signOut()}>Logout</Button>
              </div>
            ) : (
              <Link href="/auth/signin">
                <Button className="h-11 lg:h-12 px-6 sm:px-8 font-black text-xs sm:text-sm uppercase tracking-wider rounded-2xl bg-purple-700 hover:bg-purple-800 text-white shadow-lg shadow-purple-900/20 hover:scale-105 transition-all duration-200">
                  <Sparkles className="mr-2 h-5 w-5 text-amber-300 fill-current" /> Sign In
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Navigation */}
          <div className="flex md:hidden items-center gap-2">
            <Button variant="outline" size="icon" className="h-11 w-11 rounded-xl border-2 border-purple-200 dark:border-purple-900" onClick={() => setIsSearchOpen(!isSearchOpen)}>
              <Search className="h-6 w-6 text-purple-600" />
            </Button>
            <Sheet>
              <SheetTrigger render={<Button variant="outline" size="icon" className="h-11 w-11 rounded-xl border-2 border-purple-200 dark:border-purple-900" />}>
                <Menu className="h-6 w-6 text-purple-600" />
              </SheetTrigger>
              <SheetContent side="right" className="border-purple-200 dark:border-purple-900 w-80">
                <div className="flex flex-col gap-5 mt-8">
                  <div className="flex items-center space-x-3.5 mb-4">
                    <div className="relative h-14 w-14 rounded-full overflow-hidden bg-white border-2 border-purple-500/40 shadow-md flex items-center justify-center shrink-0">
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
                      className="text-xl font-black transition-colors hover:text-purple-600 py-1"
                    >
                      {link.title}
                    </Link>
                  ))}
                  <hr className="my-2 border-purple-200 dark:border-purple-900" />
                  {session ? (
                    <div className="flex flex-col gap-3">
                      {isAdmin ? (
                        <Link href="/admin">
                          <Button className="w-full h-12 bg-purple-700 hover:bg-purple-800 text-white font-black text-base">Admin</Button>
                        </Link>
                      ) : null}
                      <Link href="/dashboard">
                        <Button className="w-full h-12 bg-purple-700 hover:bg-purple-800 text-white font-black text-base">Dashboard</Button>
                      </Link>
                      <Button variant="outline" className="h-12 font-bold text-base border-2" onClick={() => signOut()}>Logout</Button>
                    </div>
                  ) : (
                    <Link href="/auth/signin">
                      <Button className="w-full h-12 bg-purple-700 hover:bg-purple-800 text-white font-black text-base">Sign In</Button>
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
              className="w-full h-12 text-base border-2 border-purple-300 rounded-xl"
              autoFocus
            />
            <Button variant="ghost" size="icon" className="h-12 w-12" onClick={() => setIsSearchOpen(false)}>
              <X className="h-6 w-6 text-purple-600" />
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
