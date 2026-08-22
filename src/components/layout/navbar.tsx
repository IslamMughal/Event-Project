'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Menu, Search, X, Calendar, User, Sparkles, Flame } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import { useSession, signOut } from 'next-auth/react'

const Navbar = () => {
  const { data: session } = useSession()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const isAdmin = (session?.user as any)?.role === 'ADMIN'

  const navLinks = [
    { title: 'Home', href: '/' },
    { title: 'Events', href: '/events' },
    { title: 'About', href: '/about' },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-purple-500/20 bg-background/85 backdrop-blur-xl shadow-sm">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="h-9 w-9 rounded-xl gradient-cyber flex items-center justify-center text-white shadow-lg shadow-purple-500/30 transition-transform group-hover:scale-110 duration-300">
              <Calendar className="h-5 w-5" />
            </div>
            <span className="font-black text-2xl tracking-tight uppercase gradient-text">Eventify</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.title}
                href={link.href}
                className="text-xs uppercase tracking-wider font-extrabold text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              >
                {link.title}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-3">
            <form action="/events" method="GET" className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-purple-500" />
              <Input
                type="search"
                name="search"
                placeholder="Search events..."
                className="pl-9 h-9 w-48 lg:w-64 rounded-xl border-purple-200 dark:border-purple-900/60 focus-visible:ring-2 focus-visible:ring-purple-600 bg-purple-50/40 dark:bg-purple-950/20"
              />
            </form>
            {session ? (
              <div className="flex items-center gap-2">
                {isAdmin ? (
                  <Link href="/admin">
                    <Button variant="ghost" size="sm" className="font-extrabold text-xs uppercase tracking-wider text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/40">Admin</Button>
                  </Link>
                ) : null}
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm" className="font-extrabold text-xs uppercase tracking-wider hover:bg-purple-50 dark:hover:bg-purple-950/40">
                    <User className="mr-1.5 h-3.5 w-3.5 text-purple-600 dark:text-purple-400" /> {session.user?.name}
                  </Button>
                </Link>
                <Button variant="outline" size="sm" className="font-bold text-xs uppercase tracking-wider h-9 rounded-xl border-purple-200 dark:border-purple-900/60 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-300" onClick={() => signOut()}>Logout</Button>
              </div>
            ) : (
              <Link href="/auth/signin">
                <Button className="font-extrabold text-xs uppercase tracking-wider h-9 rounded-xl gradient-cyber text-white shadow-md shadow-purple-500/25 px-5 hover:opacity-90 transition-opacity">
                  <Sparkles className="mr-1.5 h-3.5 w-3.5 text-amber-300 fill-current" /> Sign In
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Navigation */}
          <div className="flex md:hidden items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(!isSearchOpen)}>
              <Search className="h-5 w-5 text-purple-600" />
            </Button>
            <Sheet>
              <SheetTrigger render={<Button variant="ghost" size="icon" />}>
                <Menu className="h-5 w-5" />
              </SheetTrigger>
              <SheetContent side="right" className="border-purple-200 dark:border-purple-900">
                <div className="flex flex-col gap-4 mt-8">
                  {navLinks.map((link) => (
                    <Link
                      key={link.title}
                      href={link.href}
                      className="text-lg font-bold transition-colors hover:text-purple-600"
                    >
                      {link.title}
                    </Link>
                  ))}
                  <hr className="my-2 border-purple-100 dark:border-purple-900" />
                  {session ? (
                    <div className="flex flex-col gap-2">
                      {isAdmin ? (
                        <Link href="/admin">
                          <Button className="w-full gradient-cyber text-white font-bold">Admin</Button>
                        </Link>
                      ) : null}
                      <Link href="/dashboard">
                        <Button className="w-full gradient-cyber text-white font-bold">Dashboard</Button>
                      </Link>
                      <Button variant="outline" onClick={() => signOut()}>Logout</Button>
                    </div>
                  ) : (
                    <Link href="/auth/signin">
                      <Button className="w-full gradient-cyber text-white font-bold">Sign In</Button>
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
        <div className="md:hidden border-b border-purple-200 bg-background p-4 animate-in slide-in-from-top duration-300">
          <div className="relative flex items-center gap-2">
            <Input
              type="search"
              placeholder="Search events..."
              className="w-full border-purple-300"
              autoFocus
            />
            <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(false)}>
              <X className="h-5 w-5 text-purple-600" />
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
