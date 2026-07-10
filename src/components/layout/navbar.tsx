'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Menu, Search, X, Calendar, MapPin, User } from 'lucide-react'
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
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200 dark:border-neutral-850 bg-background/95 backdrop-blur-md">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-neutral-900 dark:text-white" />
            <span className="inline-block font-extrabold text-lg tracking-tight uppercase">Eventify</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.title}
                href={link.href}
                className="text-xs uppercase tracking-wider font-bold text-neutral-500 hover:text-black dark:text-neutral-400 dark:hover:text-white transition-colors"
              >
                {link.title}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-3">
            <form action="/events" method="GET" className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-neutral-400" />
              <Input
                type="search"
                name="search"
                placeholder="Search events..."
                className="pl-8 h-9 w-48 lg:w-64 rounded-lg border-neutral-200 focus-visible:ring-1 focus-visible:ring-black dark:focus-visible:ring-white bg-neutral-50/50"
              />
            </form>
            {session ? (
              <div className="flex items-center gap-2">
                {isAdmin ? (
                  <Link href="/admin">
                    <Button variant="ghost" size="sm" className="font-extrabold text-xs uppercase tracking-wider">Admin</Button>
                  </Link>
                ) : null}
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm" className="font-extrabold text-xs uppercase tracking-wider">
                    <User className="mr-1.5 h-3.5 w-3.5 text-neutral-500" /> {session.user?.name}
                  </Button>
                </Link>
                <Button variant="outline" size="sm" className="font-bold text-xs uppercase tracking-wider h-9 rounded-lg border-neutral-200" onClick={() => signOut()}>Logout</Button>
              </div>
            ) : (
              <Link href="/auth/signin">
                <Button className="font-bold text-xs uppercase tracking-wider h-9 rounded-lg bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-100 px-4">Sign In</Button>
              </Link>
            )}
          </div>

          {/* Mobile Navigation */}
          <div className="flex md:hidden items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(!isSearchOpen)}>
              <Search className="h-5 w-5" />
            </Button>
            <Sheet>
              <SheetTrigger render={<Button variant="ghost" size="icon" />}>
                <Menu className="h-5 w-5" />
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col gap-4 mt-8">
                  {navLinks.map((link) => (
                    <Link
                      key={link.title}
                      href={link.href}
                      className="text-lg font-medium transition-colors hover:text-primary"
                    >
                      {link.title}
                    </Link>
                  ))}
                  <hr className="my-2" />
                  {session ? (
                    <div className="flex flex-col gap-2">
                      {isAdmin ? (
                        <Link href="/admin">
                          <Button className="w-full">Admin</Button>
                        </Link>
                      ) : null}
                      <Link href="/dashboard">
                        <Button className="w-full">Dashboard</Button>
                      </Link>
                      <Button variant="outline" onClick={() => signOut()}>Logout</Button>
                    </div>
                  ) : (
                    <Link href="/auth/signin">
                      <Button className="w-full">Sign In</Button>
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
        <div className="md:hidden border-b bg-background p-4 animate-in slide-in-from-top duration-300">
          <div className="relative flex items-center gap-2">
            <Input
              type="search"
              placeholder="Search events..."
              className="w-full"
              autoFocus
            />
            <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
