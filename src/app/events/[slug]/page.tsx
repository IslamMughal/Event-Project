'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Calendar, MapPin, Clock, Share2, Heart, Users, ExternalLink, Loader2, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import EventMap from '@/components/events/event-map'
import RSVPButton from '@/components/events/rsvp-button'
import { Event, Review } from '@/types'
import { getEvent } from '@/lib/api'
import { cn } from '@/lib/utils'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

export default function EventDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const { data: session } = useSession()

  const [event, setEvent] = useState<Event | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [reviewLoading, setReviewLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [reviewError, setReviewError] = useState<string | null>(null)
  const [reviewSuccess, setReviewSuccess] = useState(false)
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' })
  const [favoriteId, setFavoriteId] = useState<number | null>(null)

  useEffect(() => {
    if (!slug) return

    let isActive = true

    void (async () => {
      setLoading(true)
      try {
        const eventRes = await getEvent(slug)
        if (!isActive) return

        setEvent(eventRes.data)

        // Fetch reviews
        const reviewRes = await fetch(`/api/reviews?eventId=${eventRes.data.id}`)
        const reviewJson = await reviewRes.json()
        if (!isActive) return
        setReviews(reviewJson.data || [])

        // Fetch favorite status if logged in
        if (session?.user) {
          const favRes = await fetch('/api/favorites/my')
          const favJson = await favRes.json()
          if (isActive && favJson.data) {
            const fav = favJson.data.find((f: any) => f.eventId === eventRes.data.id)
            setFavoriteId(fav ? fav.id : null)
          }
        }
      } catch (err) {
        if (!isActive) return
        setError(err instanceof Error ? err.message : 'Failed to load event')
      } finally {
        if (isActive) setLoading(false)
      }
    })()

    return () => {
      isActive = false
    }
  }, [slug, session])

  const handleFavoriteClick = async () => {
    if (!session?.user || !event) {
      window.location.href = '/auth/signin'
      return
    }

    try {
      if (favoriteId !== null) {
        await fetch(`/api/favorites/${favoriteId}`, { method: 'DELETE' })
        setFavoriteId(null)
      } else {
        const res = await fetch('/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ eventId: event.id }),
        })
        const json = await res.json()
        if (res.ok && json.data) {
          setFavoriteId(json.data.id)
        }
      }
    } catch (err) {
      console.error('Failed to toggle favorite:', err)
    }
  }

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!event || !session?.user) return

    const sessionUser = session.user as { id?: string; username?: string | null; name?: string | null }

    setReviewLoading(true)
    setReviewError(null)
    setReviewSuccess(false)

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId: event.id, rating: Number(reviewForm.rating), comment: reviewForm.comment }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error?.message || 'Unable to save review')

      setReviews((prev) => [{
        id: json.data.id,
        rating: json.data.rating,
        comment: json.data.comment,
        createdAt: json.data.createdAt,
        userId: json.data.userId,
        eventId: json.data.eventId,
        user: { id: Number(sessionUser.id ?? 0), username: sessionUser.username || sessionUser.name || 'You' },
      }, ...prev])
      setReviewForm({ rating: 5, comment: '' })
      setReviewSuccess(true)
    } catch (err) {
      setReviewError(err instanceof Error ? err.message : 'Unable to save review')
    } finally {
      setReviewLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading event details...</p>
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h2 className="text-2xl font-bold mb-2">Event not found</h2>
        <p className="text-muted-foreground mb-4">{error || 'This event does not exist.'}</p>
        <Link href="/events">
          <Button>Back to Events</Button>
        </Link>
      </div>
    )
  }

  const venueAddress = event.venueAddress || event.venue_address || ''
  const ticketPrice = event.ticketPrice ?? event.ticket_price ?? 0
  const lat = event.coordinatesLat ?? event.coordinates?.lat ?? 0
  const lng = event.coordinatesLng ?? event.coordinates?.lng ?? 0

  return (
    <div className="flex flex-col gap-0 pb-24">
      {/* Banner / Header Image */}
      <div className="relative h-[45vh] md:h-[55vh] w-full overflow-hidden">
        {event.imageUrl ? (
          <Image src={event.imageUrl} alt={event.title} fill priority className="object-cover" />
        ) : (
          <div className="w-full h-full bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center">
            <Calendar className="h-16 w-16 text-neutral-300" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 py-8">
          <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-6">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/" className="text-white/70 hover:text-white transition-colors text-xs font-semibold uppercase tracking-wider">Home</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="text-white/40" />
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/events" className="text-white/70 hover:text-white transition-colors text-xs font-semibold uppercase tracking-wider">Events</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="text-white/40" />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-white font-extrabold text-xs uppercase tracking-wider">{event.title}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2.5">
                {event.category && (
                  <Badge className="bg-white text-black hover:bg-neutral-150 border-0 font-bold px-3 py-1 rounded text-[10px] uppercase tracking-wider">
                    {event.category.name}
                  </Badge>
                )}
                {event.featured && (
                  <Badge className="bg-white/20 hover:bg-white/25 text-white backdrop-blur-sm border-0 font-bold px-3 py-1 rounded text-[10px] uppercase tracking-wider">
                    Featured
                  </Badge>
                )}
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tight text-white">{event.title}</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Details Section */}
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Left Column (Info, Description, Map, Reviews) */}
          <div className="lg:col-span-2 space-y-12">

            {/* Quick Details Box */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 p-6 sm:p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-card shadow-sm">
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] text-neutral-400 dark:text-neutral-500 uppercase tracking-wider font-extrabold">Date</span>
                <div className="flex items-center gap-2 font-bold text-neutral-800 dark:text-neutral-200 text-sm sm:text-base">
                  <Calendar className="h-4 w-4 text-neutral-500 shrink-0" />
                  {event.date}
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] text-neutral-400 dark:text-neutral-500 uppercase tracking-wider font-extrabold">Time</span>
                <div className="flex items-center gap-2 font-bold text-neutral-800 dark:text-neutral-200 text-sm sm:text-base">
                  <Clock className="h-4 w-4 text-neutral-500 shrink-0" />
                  {event.time}
                </div>
              </div>
              <div className="flex flex-col gap-1.5 col-span-2 md:col-span-1">
                <span className="text-[10px] text-neutral-400 dark:text-neutral-500 uppercase tracking-wider font-extrabold">Price</span>
                <div className="flex items-center gap-2 font-extrabold text-black dark:text-white text-base">
                  {ticketPrice === 0 ? 'FREE' : `$${ticketPrice}`}
                </div>
              </div>
            </div>

            {/* Description Section */}
            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">About this event</h2>
              <div
                className="prose prose-neutral dark:prose-invert max-w-none text-neutral-600 dark:text-neutral-300 text-sm sm:text-base leading-relaxed"
                dangerouslySetInnerHTML={{ __html: event.description || '' }}
              />
            </div>

            {/* Location & Maps Section */}
            <div className="space-y-5">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">Location</h2>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venueAddress)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-900 dark:text-neutral-100 hover:text-neutral-600 dark:hover:text-neutral-300 text-xs sm:text-sm font-extrabold flex items-center gap-1.5 underline underline-offset-4"
                >
                  <ExternalLink className="h-3.5 w-3.5" /> Get Directions
                </a>
              </div>
              <div className="flex items-start gap-2 text-sm sm:text-base text-neutral-600 dark:text-neutral-300">
                <MapPin className="h-5 w-5 text-neutral-400 shrink-0 mt-0.5" />
                <span>{venueAddress}</span>
              </div>
              <div className="h-[320px] w-full rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-sm">
                <EventMap events={[event]} center={[lat, lng]} zoom={15} />
              </div>
            </div>

            {/* Reviews Section */}
            <div className="space-y-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-card p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-4">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Reviews</h2>
                <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">{reviews.length} review{reviews.length === 1 ? '' : 's'}</span>
              </div>

              {session?.user ? (
                <form onSubmit={handleReviewSubmit} className="space-y-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 p-4 sm:p-5">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <button key={idx} type="button" aria-label={`Rate ${idx + 1} star${idx + 1 === 1 ? '' : 's'}`} onClick={() => setReviewForm((prev) => ({ ...prev, rating: idx + 1 }))} className="text-amber-500 transition-transform active:scale-90">
                        <Star className={`h-5 w-5 ${idx < reviewForm.rating ? 'fill-current' : ''}`} />
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm((prev) => ({ ...prev, comment: e.target.value }))}
                    placeholder="Share what you thought about this event..."
                    className="min-h-24 w-full rounded-lg border border-neutral-200 dark:border-neutral-800 bg-background p-3 text-sm focus-visible:ring-1 focus-visible:ring-black dark:focus-visible:ring-white placeholder:text-neutral-400 focus:outline-none"
                  />
                  {reviewError ? <p className="text-xs text-destructive font-semibold">{reviewError}</p> : null}
                  {reviewSuccess ? <p className="text-xs text-green-600 font-semibold">Thanks for your review.</p> : null}
                  <Button type="submit" disabled={reviewLoading} className="font-bold tracking-wide rounded-xl bg-black text-white hover:bg-neutral-850 dark:bg-white dark:text-black dark:hover:bg-neutral-100">
                    {reviewLoading ? 'Saving...' : 'Submit Review'}
                  </Button>
                </form>
              ) : (
                <p className="text-sm text-neutral-500 dark:text-neutral-400">Sign in to leave a review for this event.</p>
              )}

              <div className="space-y-4 pt-2">
                {reviews.length === 0 ? (
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">No reviews yet. Be the first to share your experience.</p>
                ) : reviews.map((review) => (
                  <div key={review.id} className="rounded-xl border border-neutral-150 dark:border-neutral-850 p-5 space-y-2">
                    <div className="flex items-center justify-between gap-4">
                      <div className="font-bold text-sm text-neutral-800 dark:text-neutral-200">{review.user?.username || 'Anonymous'}</div>
                      <div className="flex items-center gap-0.5 text-amber-500">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <Star key={idx} className={`h-3.5 w-3.5 ${idx < review.rating ? 'fill-current' : ''}`} />
                        ))}
                      </div>
                    </div>
                    {review.comment ? <p className="text-sm text-neutral-600 dark:text-neutral-350 leading-relaxed">{review.comment}</p> : null}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column (RSVP & Booking Sidebar Card) */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">

              {/* RSVP Action Card */}
              <div className="p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-card shadow-sm space-y-6 relative overflow-hidden">
                <div className="space-y-1.5">
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight">Join the Event</h3>
                  <p className="text-neutral-500 dark:text-neutral-400 text-xs sm:text-sm">Register now to secure your spot and get updates.</p>
                </div>

                {event.rsvpCount != null && (
                  <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                    <Users className="h-4 w-4 text-neutral-500 shrink-0" />
                    <span>{event.rsvpCount} {event.rsvpCount === 1 ? 'person is' : 'people are'} attending</span>
                  </div>
                )}

                <div className="space-y-3.5">
                  <RSVPButton eventId={event.id} isRSVPed={event.userHasRSVPed} />
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant={favoriteId !== null ? "default" : "outline"}
                      onClick={handleFavoriteClick}
                      className={cn(
                        "h-12 font-bold tracking-wide rounded-xl border border-neutral-200",
                        favoriteId !== null
                          ? "bg-black text-white hover:bg-neutral-800 dark:bg-white dark:text-black border-0"
                          : "bg-transparent hover:bg-neutral-50 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400"
                      )}
                    >
                      <Heart className={cn("mr-2 h-4 w-4", favoriteId !== null && "fill-current text-white dark:text-black")} />
                      {favoriteId !== null ? "Saved" : "Save"}
                    </Button>
                    <Button variant="outline" className="h-12 font-bold tracking-wide rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400">
                      <Share2 className="mr-2 h-4 w-4" /> Share
                    </Button>
                  </div>
                </div>

                <div className="border-t border-neutral-100 dark:border-neutral-800 pt-4 flex items-center justify-center">
                  <p className="text-[10px] text-neutral-400 uppercase tracking-widest text-center font-bold">Secure checkout by Eventify</p>
                </div>
              </div>

              {/* Organizer Profile Box */}
              <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-black text-white dark:bg-white dark:text-black flex items-center justify-center font-bold text-xs uppercase">
                  {event.organizer?.username?.substring(0, 2).toUpperCase() || 'EM'}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-neutral-800 dark:text-neutral-200">{event.organizer?.username || 'Event Masters'}</h4>
                  <p className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold">Event Organizer</p>
                </div>
                <Button variant="link" className="ml-auto text-xs font-bold text-neutral-800 dark:text-neutral-200 hover:underline">Follow</Button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

