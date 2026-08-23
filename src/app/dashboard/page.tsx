'use client'

import React, { useEffect, useState } from 'react'
import { Calendar, MapPin, Loader2, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { getMyRSVPs, deleteRSVP } from '@/lib/api'
import type { RSVP } from '@/types'

export default function DashboardPage() {
  const [rsvps, setRsvps] = useState<RSVP[]>([])
  const [loading, setLoading] = useState(true)
  const [cancellingId, setCancellingId] = useState<number | null>(null)

  useEffect(() => {
    getMyRSVPs()
      .then((res) => setRsvps(res.data))
      .catch((err) => console.error('Failed to load RSVPs:', err))
      .finally(() => setLoading(false))
  }, [])

  const handleCancelRSVP = async (rsvpId: number) => {
    setCancellingId(rsvpId)
    try {
      await deleteRSVP(rsvpId)
      setRsvps((prev) => prev.filter((r) => r.id !== rsvpId))
    } catch (err) {
      console.error('Failed to cancel RSVP:', err)
    } finally {
      setCancellingId(null)
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your RSVPs</h1>
          <p className="text-muted-foreground">Manage your upcoming event registrations.</p>
        </div>
        <Link href="/events">
          <Button className="rounded-xl shadow-lg shadow-primary/10">Find More Events</Button>
        </Link>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading your RSVPs...</p>
        </div>
      ) : rsvps.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {rsvps.map((rsvp) => (
            <Card key={rsvp.id} className="overflow-hidden border-none bg-card shadow-xl hover:shadow-2xl transition-all group rounded-2xl">
              <div className="h-2 w-full bg-purple-600" />
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-2 mb-2">
                  {rsvp.event?.category && (
                    <span className="text-[10px] font-black tracking-wider uppercase text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-950/70 px-2.5 py-0.5 rounded-md border border-purple-200 dark:border-purple-800">
                      {rsvp.event.category.name}
                    </span>
                  )}
                  <span className="font-black text-xs text-rose-500">
                    {rsvp.event?.ticketPrice === 0 || rsvp.event?.ticketPrice === null ? 'FREE' : `$${rsvp.event?.ticketPrice}`}
                  </span>
                </div>
                <CardTitle className="text-xl group-hover:text-purple-600 transition-colors">
                  {rsvp.event?.title || 'Untitled Event'}
                </CardTitle>
                <CardDescription className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-purple-500" /> {rsvp.event?.date || 'Date TBD'}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-cyan-500" /> {rsvp.event?.time || 'Time TBD'}
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" /> 
                  <span className="line-clamp-2">{rsvp.event?.venueAddress || 'Venue TBD'}</span>
                </div>
                <div className="flex gap-3 pt-2">
                  <Link href={`/events/${rsvp.event?.slug || ''}`}>
                    <Button variant="secondary" size="sm" className="rounded-lg px-4">View Event</Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-lg text-destructive hover:bg-destructive/5 hover:text-destructive border-destructive/20"
                    onClick={() => handleCancelRSVP(rsvp.id)}
                    disabled={cancellingId === rsvp.id}
                  >
                    {cancellingId === rsvp.id ? (
                      <><Loader2 className="mr-1 h-3 w-3 animate-spin" /> Cancelling...</>
                    ) : (
                      'Cancel RSVP'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="col-span-full py-20 text-center space-y-4 bg-muted/30 rounded-[2rem] border-2 border-dashed">
          <Calendar className="h-12 w-12 text-muted-foreground mx-auto opacity-20" />
          <p className="text-muted-foreground font-medium">You haven&apos;t registered for any events yet.</p>
          <Link href="/events">
            <Button variant="outline">Browse Events</Button>
          </Link>
        </div>
      )}
    </div>
  )
}
