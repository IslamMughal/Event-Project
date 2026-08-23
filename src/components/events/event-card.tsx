'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, MapPin, Clock, Heart, Sparkles, Flame } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Event } from '@/types'
import { cn } from '@/lib/utils'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { createFavorite, deleteFavorite, getMyFavorites } from '@/lib/api'

interface EventCardProps {
  event: Event
  isHovered?: boolean
  onHover?: (id: string | null) => void
  initialFavoriteId?: number | null
  onFavoriteToggle?: (eventId: number, favoriteId: number | null) => void
}

const EventCard = ({ event, isHovered, onHover, initialFavoriteId = null, onFavoriteToggle }: EventCardProps) => {
  const { data: session } = useSession()
  const router = useRouter()
  const [favoriteId, setFavoriteId] = React.useState<number | null>(initialFavoriteId)

  React.useEffect(() => {
    setFavoriteId(initialFavoriteId)
  }, [initialFavoriteId])

  const isFavorite = favoriteId !== null

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!session?.user) {
      router.push('/auth/signin')
      return
    }

    try {
      if (isFavorite && favoriteId !== null) {
        await deleteFavorite(favoriteId)
        setFavoriteId(null)
        onFavoriteToggle?.(event.id, null)
      } else {
        try {
          const res = await createFavorite(event.id)
          setFavoriteId(res.data.id)
          onFavoriteToggle?.(event.id, res.data.id)
        } catch (createErr: any) {
          // Handle 409 "Already favorited" — state was out of sync, so unfavorite instead
          if (createErr?.message?.includes('Already favorited')) {
            const favRes = await getMyFavorites()
            const existing = favRes.data.find((f) => f.eventId === event.id)
            if (existing) {
              await deleteFavorite(existing.id)
              setFavoriteId(null)
              onFavoriteToggle?.(event.id, null)
            }
          } else {
            throw createErr
          }
        }
      }
    } catch (err) {
      console.error('Error toggling favorite:', err)
    }
  }

  const ticketPrice = event.ticketPrice ?? event.ticket_price ?? 0;

  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all duration-300 border border-purple-500/20 hover:border-purple-500/60 hover:shadow-2xl hover:shadow-purple-500/20 group flex flex-col h-full bg-card rounded-2xl",
        isHovered && "border-purple-600 shadow-2xl shadow-purple-500/25 scale-[1.02]"
      )}
      onMouseEnter={() => onHover?.(String(event.id))}
      onMouseLeave={() => onHover?.(null)}
    >
      <Link href={`/events/${event.slug}`} className="flex flex-col h-full">
        {/* Banner Image Container */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-purple-50 dark:bg-purple-950/40">
          {(event.imageUrl || event.image) ? (
            <Image
              src={event.imageUrl || event.image?.url || ''}
              alt={event.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-purple-100 dark:bg-purple-950/60 flex items-center justify-center">
              <Calendar className="h-10 w-10 text-purple-600" />
            </div>
          )}
          
          <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {event.featured && (
            <Badge className="absolute top-3 left-3 bg-purple-700 text-white font-extrabold text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-lg shadow-lg border-0 flex items-center gap-1">
              <Flame className="h-3 w-3 text-amber-300 fill-current" /> Featured
            </Badge>
          )}

          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleFavoriteClick}
            className={cn(
              "absolute top-3 right-3 rounded-full h-9 w-9 bg-white/90 dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-900 backdrop-blur-md transition-all duration-200 shadow-md z-10",
              isFavorite ? "text-rose-500" : "text-slate-600 dark:text-slate-300 hover:text-rose-500"
            )}
          >
            <Heart className={cn("h-4 w-4 transition-transform duration-200 active:scale-75", isFavorite && "fill-current")} />
          </Button>
        </div>

        {/* Content Section */}
        <CardContent className="p-5 flex-1 flex flex-col justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              {event.category && (
                <span className="text-[11px] font-black tracking-wider uppercase text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-950/70 px-2.5 py-0.5 rounded-md border border-purple-200 dark:border-purple-800">
                  {event.category.name}
                </span>
              )}
              <span className="font-black text-sm sm:text-base text-rose-500">
                {ticketPrice === 0 ? 'FREE' : `$${ticketPrice}`}
              </span>
            </div>

            <h3 className="font-extrabold text-lg sm:text-xl text-foreground leading-snug line-clamp-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
              {event.title}
            </h3>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-purple-100 dark:border-purple-900/50">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 shrink-0 text-purple-500" />
              <span>{event.date}</span>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
              <Clock className="h-4 w-4 shrink-0 text-cyan-500" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 shrink-0 text-rose-500" />
              <span className="line-clamp-1">{event.venueAddress || event.venue_address}</span>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}

export default EventCard
