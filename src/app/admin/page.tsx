'use client'

import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Loader2, 
  CheckCircle2, 
  XCircle, 
  Star, 
  Sparkles, 
  Search, 
  Calendar, 
  MapPin, 
  User, 
  ExternalLink,
  ShieldCheck,
  Tag,
  Clock,
  Check,
  PauseCircle
} from 'lucide-react'

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PUBLISHED' | 'DRAFT' | 'FEATURED'>('ALL')
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/auth/signin')
      return
    }

    if (status === 'authenticated' && (session?.user as any)?.role !== 'ADMIN') {
      router.replace('/dashboard')
      return
    }

    if (status === 'authenticated') {
      fetch('/api/admin/events')
        .then((res) => res.json())
        .then((json) => setEvents(json.data || []))
        .catch(() => setEvents([]))
        .finally(() => setLoading(false))
    }
  }, [router, session, status])

  const updateEvent = async (id: number, status: string, featured: boolean) => {
    setActionLoadingId(id)
    try {
      await fetch('/api/admin/events', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status, featured }),
      })

      setEvents((prev) =>
        prev.map((event) => (event.id === id ? { ...event, status, featured } : event))
      )
    } catch (err) {
      console.error('Failed to update event:', err)
    } finally {
      setActionLoadingId(null)
    }
  }

  // Analytics Metrics
  const totalEvents = events.length
  const publishedCount = events.filter((e) => e.status === 'PUBLISHED').length
  const draftCount = events.filter((e) => e.status === 'DRAFT' || e.status === 'PENDING').length
  const featuredCount = events.filter((e) => e.featured).length

  // Filtered Events List
  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (event.organizer?.username || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (event.venueAddress || '').toLowerCase().includes(searchQuery.toLowerCase())

    if (!matchesSearch) return false

    if (statusFilter === 'PUBLISHED') return event.status === 'PUBLISHED'
    if (statusFilter === 'DRAFT') return event.status === 'DRAFT' || event.status === 'PENDING'
    if (statusFilter === 'FEATURED') return event.featured

    return true
  })

  if (status === 'loading' || loading) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-purple-600" />
        <p className="text-sm font-semibold text-muted-foreground animate-pulse">Loading Admin Control Panel...</p>
      </div>
    )
  }

  return (
    <div className="container max-w-7xl mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-6 border-b border-purple-500/20">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-700 dark:text-purple-400 text-xs font-black mb-3">
            <ShieldCheck className="h-4 w-4" /> Admin Operations Center
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground">
            Event Management <span className="text-purple-700 dark:text-purple-400">Dashboard</span>
          </h1>
          <p className="text-base text-muted-foreground mt-2 font-medium">
            Review event submissions, toggle status approvals, and manage featured homepage spotlights.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => router.refresh()}
            variant="outline"
            className="rounded-2xl h-11 px-5 font-bold border-2 border-purple-200 dark:border-purple-900 hover:bg-purple-50 dark:hover:bg-purple-950/50"
          >
            Refresh List
          </Button>
        </div>
      </div>

      {/* Analytics KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="rounded-3xl border-2 border-purple-500/10 shadow-lg bg-card/80 backdrop-blur-xl hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-black tracking-widest text-muted-foreground uppercase">Total Submissions</p>
              <p className="text-3xl font-black text-foreground">{totalEvents}</p>
            </div>
            <div className="h-14 w-14 rounded-2xl bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 flex items-center justify-center shadow-inner">
              <Calendar className="h-7 w-7" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-2 border-emerald-500/10 shadow-lg bg-card/80 backdrop-blur-xl hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-black tracking-widest text-emerald-600 dark:text-emerald-400 uppercase">Approved Live</p>
              <p className="text-3xl font-black text-foreground">{publishedCount}</p>
            </div>
            <div className="h-14 w-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-inner">
              <CheckCircle2 className="h-7 w-7" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-2 border-amber-500/10 shadow-lg bg-card/80 backdrop-blur-xl hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-black tracking-widest text-amber-600 dark:text-amber-400 uppercase">Pending Review</p>
              <p className="text-3xl font-black text-foreground">{draftCount}</p>
            </div>
            <div className="h-14 w-14 rounded-2xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-inner">
              <Clock className="h-7 w-7" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-2 border-purple-500/10 shadow-lg bg-card/80 backdrop-blur-xl hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs font-black tracking-widest text-purple-600 dark:text-purple-400 uppercase">Featured Events</p>
              <p className="text-3xl font-black text-foreground">{featuredCount}</p>
            </div>
            <div className="h-14 w-14 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-300 flex items-center justify-center shadow-inner">
              <Sparkles className="h-7 w-7" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Control Bar: Search & Status Filter Tabs */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-3xl bg-card border-2 border-purple-500/20 shadow-lg">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-purple-500 pointer-events-none" />
          <Input
            type="search"
            placeholder="Search by event title, organizer, or venue..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12 rounded-2xl border-purple-200 dark:border-purple-900/60 bg-background font-medium focus-visible:ring-2 focus-visible:ring-purple-600"
          />
        </div>

        {/* Status Filter Pill Tabs */}
        <div className="flex items-center gap-1.5 p-1.5 bg-muted/60 rounded-2xl overflow-x-auto shrink-0">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold uppercase transition-all whitespace-nowrap ${
              statusFilter === 'ALL'
                ? 'bg-purple-700 text-white shadow-md'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            All ({totalEvents})
          </button>
          <button
            onClick={() => setStatusFilter('PUBLISHED')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold uppercase transition-all whitespace-nowrap ${
              statusFilter === 'PUBLISHED'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            Approved ({publishedCount})
          </button>
          <button
            onClick={() => setStatusFilter('DRAFT')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold uppercase transition-all whitespace-nowrap ${
              statusFilter === 'DRAFT'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            Pending ({draftCount})
          </button>
          <button
            onClick={() => setStatusFilter('FEATURED')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold uppercase transition-all whitespace-nowrap ${
              statusFilter === 'FEATURED'
                ? 'bg-purple-900 text-white shadow-md'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            Featured ({featuredCount})
          </button>
        </div>
      </div>

      {/* Events List Grid */}
      {filteredEvents.length === 0 ? (
        <Card className="rounded-[2.5rem] border-2 border-dashed p-12 text-center space-y-4">
          <div className="h-16 w-16 mx-auto rounded-full bg-purple-500/10 flex items-center justify-center text-purple-600">
            <Calendar className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-bold">No Events Found</h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto font-medium">
            No submissions matched your search query or selected filter criteria.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredEvents.map((event) => {
            const isApproved = event.status === 'PUBLISHED'
            const isUpdating = actionLoadingId === event.id

            return (
              <Card
                key={event.id}
                className="rounded-[2rem] border-2 border-purple-500/15 shadow-xl bg-card overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-purple-500/40 group"
              >
                <div className="flex flex-col lg:flex-row items-stretch">
                  {/* Event Thumbnail Preview Image */}
                  <div className="relative w-full lg:w-72 h-48 lg:h-auto shrink-0 bg-muted/80 overflow-hidden">
                    {event.imageUrl ? (
                      <Image
                        src={event.imageUrl}
                        alt={event.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-purple-900/10 text-purple-600 gap-2">
                        <Calendar className="h-10 w-10 opacity-40" />
                        <span className="text-xs font-bold uppercase tracking-wider opacity-60">No Banner Image</span>
                      </div>
                    )}
                    {/* Category Pill Tag */}
                    {event.category && (
                      <span
                        className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-black text-white shadow-md uppercase tracking-wider"
                        style={{ backgroundColor: event.category.color || '#8B5CF6' }}
                      >
                        {event.category.name}
                      </span>
                    )}
                  </div>

                  {/* Main Event Content */}
                  <div className="flex-1 p-6 sm:p-8 flex flex-col justify-between gap-6">
                    <div className="space-y-4">
                      {/* Status Badges Row */}
                      <div className="flex flex-wrap items-center gap-2">
                        {isApproved ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-black uppercase tracking-wider">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            Approved & Published
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-400 text-xs font-black uppercase tracking-wider">
                            <Clock className="h-3.5 w-3.5" /> Pending Approval / Draft
                          </span>
                        )}

                        {event.featured && (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-purple-900 text-white text-xs font-black uppercase tracking-wider shadow-md">
                            <Sparkles className="h-3.5 w-3.5 text-amber-300 fill-current" /> Featured Spotlight
                          </span>
                        )}
                      </div>

                      {/* Event Title */}
                      <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors">
                        {event.title}
                      </h2>

                      {/* Key Metadata Details */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs font-semibold text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-purple-600 shrink-0" />
                          <span>Organizer: <strong className="text-foreground">{event.organizer?.username || 'admin'}</strong></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-purple-600 shrink-0" />
                          <span>Date: <strong className="text-foreground">{event.date} {event.time}</strong></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-purple-600 shrink-0" />
                          <span className="truncate" title={event.venueAddress}>Location: <strong className="text-foreground truncate">{event.venueAddress}</strong></span>
                        </div>
                      </div>
                    </div>

                    {/* Action Controls Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-muted-foreground uppercase">Ticket Price:</span>
                        <span className="text-sm font-black text-purple-700 dark:text-purple-400">
                          {event.ticketPrice > 0 ? `$${event.ticketPrice}` : 'Free Admission'}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2.5">
                        {/* Open Public Page Link */}
                        {event.slug && (
                          <Link href={`/events/${event.slug}`} target="_blank">
                            <Button variant="ghost" size="sm" className="rounded-xl h-10 px-3.5 font-bold text-xs gap-1.5 border border-purple-500/20 hover:bg-purple-50 dark:hover:bg-purple-950/50">
                              <ExternalLink className="h-3.5 w-3.5" /> View Public Page
                            </Button>
                          </Link>
                        )}

                        {/* Approve / Publish Button */}
                        {!isApproved ? (
                          <Button
                            onClick={() => updateEvent(event.id, 'PUBLISHED', event.featured)}
                            disabled={isUpdating}
                            size="sm"
                            className="rounded-xl h-10 px-4 font-extrabold text-xs gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20"
                          >
                            {isUpdating ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <>
                                <Check className="h-4 w-4" /> Approve & Publish
                              </>
                            )}
                          </Button>
                        ) : (
                          <Button
                            onClick={() => updateEvent(event.id, 'DRAFT', event.featured)}
                            disabled={isUpdating}
                            variant="outline"
                            size="sm"
                            className="rounded-xl h-10 px-4 font-bold text-xs gap-1.5 border-2 border-amber-500/30 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40"
                          >
                            {isUpdating ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <>
                                <PauseCircle className="h-4 w-4" /> Unpublish / Hold
                              </>
                            )}
                          </Button>
                        )}

                        {/* Toggle Featured Button */}
                        <Button
                          onClick={() => updateEvent(event.id, event.status, !event.featured)}
                          disabled={isUpdating}
                          variant={event.featured ? 'default' : 'outline'}
                          size="sm"
                          className={`rounded-xl h-10 px-4 font-extrabold text-xs gap-1.5 transition-all ${
                            event.featured
                              ? 'bg-purple-900 hover:bg-purple-950 text-white shadow-md shadow-purple-900/30'
                              : 'border-2 border-purple-500/30 text-purple-700 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/50'
                          }`}
                        >
                          <Star className={`h-4 w-4 ${event.featured ? 'fill-amber-300 text-amber-300' : ''}`} />
                          {event.featured ? 'Featured Spotlight' : 'Make Featured'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
