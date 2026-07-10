'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, MapPin, Clock, Heart } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Event } from '@/types'
import { cn } from '@/lib/utils'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { createFavorite, deleteFavorite } from '@/lib/api'

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
        const res = await createFavorite(event.id)
        setFavoriteId(res.data.id)
        onFavoriteToggle?.(event.id, res.data.id)
      }
    } catch (err) {
      console.error('Error toggling favorite:', err)
    }
  }

  const ticketPrice = event.ticketPrice ?? event.ticket_price ?? 0;

  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all duration-300 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 hover:shadow-lg group flex flex-col h-full bg-card rounded-2xl",
        isHovered && "border-neutral-900 dark:border-neutral-100 shadow-lg"
      )}
      onMouseEnter={() => onHover?.(String(event.id))}
      onMouseLeave={() => onHover?.(null)}
    >
      <Link href={`/events/${event.slug}`} className="flex flex-col h-full">
        {/* Banner Image Container */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100 dark:bg-neutral-900">
          {(event.imageUrl || event.image) ? (
            <Image
              src={event.imageUrl || event.image?.url || ''}
              alt={event.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center">
              <Calendar className="h-10 w-10 text-neutral-300" />
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {event.featured && (
            <Badge className="absolute top-3 left-3 bg-black hover:bg-black text-white dark:bg-white dark:text-black font-semibold text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-md shadow-sm border-0">
              Featured
            </Badge>
          )}

          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleFavoriteClick}
            className={cn(
              "absolute top-3 right-3 rounded-full h-9 w-9 bg-white/80 dark:bg-black/80 hover:bg-white dark:hover:bg-black backdrop-blur-sm transition-all duration-200 shadow-sm z-10",
              isFavorite ? "text-red-500" : "text-neutral-600 dark:text-neutral-300"
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
                <span className="text-xs font-bold tracking-wider uppercase text-neutral-500 dark:text-neutral-400">
                  {event.category.name}
                </span>
              )}
              <span className="font-extrabold text-sm sm:text-base text-neutral-900 dark:text-neutral-100">
                {ticketPrice === 0 ? 'FREE' : `$${ticketPrice}`}
              </span>
            </div>

            <h3 className="font-bold text-lg sm:text-xl text-neutral-900 dark:text-neutral-100 leading-snug line-clamp-1 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors">
              {event.title}
            </h3>
          </div>

          <div className="space-y-1.5 pt-1 border-t border-neutral-100 dark:border-neutral-900">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
              <Calendar className="h-4 w-4 shrink-0 text-neutral-400" />
              <span>{event.date}</span>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
              <Clock className="h-4 w-4 shrink-0 text-neutral-400" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
              <MapPin className="h-4 w-4 shrink-0 text-neutral-400" />
              <span className="line-clamp-1">{event.venueAddress || event.venue_address}</span>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}

export default EventCard
