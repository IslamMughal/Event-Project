'use client'

import React, { useState, useMemo, useEffect, useCallback, useRef, Suspense } from 'react'
import { Event, Category, Favorite } from '@/types'
import EventCard from '@/components/events/event-card'
import EventMap from '@/components/events/event-map'
import { Input } from '@/components/ui/input'
import { Search, SlidersHorizontal, Map as MapIcon, List as ListIcon, Loader2, Sparkles, LayoutGrid } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getEvents, getCategories, getMyFavorites } from '@/lib/api'
import { useSession } from 'next-auth/react'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

function EventsPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isInitialized = useRef(false)
  const [hoveredEventId, setHoveredEventId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list')
  const [page, setPage] = useState(1)

  // Initialize state from URL search parameters on mount
  useEffect(() => {
    const categoryParam = searchParams.get('category')
    const searchParam = searchParams.get('search')
    
    if (categoryParam) {
      setSelectedCategories([categoryParam])
    }
    if (searchParam) {
      setSearchQuery(searchParam)
    }
    isInitialized.current = true
  }, [searchParams])

  // Sync state changes back to URL search parameters
  useEffect(() => {
    if (!isInitialized.current) return

    const params = new URLSearchParams()
    if (searchQuery) params.set('search', searchQuery)
    if (selectedCategories.length > 0) params.set('category', selectedCategories[0])
    
    const newQuery = params.toString() ? `?${params.toString()}` : ''
    if (window.location.search !== newQuery) {
      router.replace(`/events${newQuery}`, { scroll: false })
    }
  }, [searchQuery, selectedCategories, router])

  // Data state
  const { data: session } = useSession()
  const [events, setEvents] = useState<Event[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [loading, setLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(1)
  const [loadingMore, setLoadingMore] = useState(false)

  // Fetch favorites on mount or session change
  useEffect(() => {
    if (session?.user) {
      getMyFavorites()
        .then((res) => setFavorites(res.data))
        .catch((err) => console.error('Failed to load favorites:', err))
    } else {
      setFavorites([])
    }
  }, [session])

  const handleFavoriteToggleInList = (eventId: number, favoriteId: number | null) => {
    if (favoriteId === null) {
      setFavorites(prev => prev.filter(f => f.eventId !== eventId))
    } else {
      const newFav: Favorite = { id: favoriteId, eventId, userId: parseInt(session?.user?.id || '0'), createdAt: new Date().toISOString() }
      setFavorites(prev => [...prev, newFav])
    }
  }

  // Fetch categories once on mount
  useEffect(() => {
    getCategories()
      .then((res) => setCategories(res.data))
      .catch((err) => console.error('Failed to load categories:', err))
  }, [])

  // Fetch events whenever search, category, or page changes
  const fetchEvents = useCallback(async (pageNum: number, append = false) => {
    if (append) {
      setLoadingMore(true)
    } else {
      setLoading(true)
    }

    try {
      const res = await getEvents({
        search: searchQuery || undefined,
        category: selectedCategories.length === 1 ? selectedCategories[0] : undefined,
        page: pageNum,
        limit: 12,
      })

      if (append) {
        setEvents((prev) => [...prev, ...res.data])
      } else {
        setEvents(res.data)
      }
      setTotalPages(res.meta.pagination.pageCount)
    } catch (err) {
      console.error('Failed to load events:', err)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [searchQuery, selectedCategories])

  // Debounce search and reset page on filter change
  useEffect(() => {
    setPage(1)
    const timeout = setTimeout(() => {
      fetchEvents(1)
    }, 300)
    return () => clearTimeout(timeout)
  }, [searchQuery, selectedCategories, fetchEvents])

  const toggleCategory = (slug: string) => {
    setSelectedCategories(prev =>
      prev.includes(slug) ? [] : [slug]
    )
  }

  const handleLoadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchEvents(nextPage, true)
  }

  // Client-side multi-category filter
  const filteredEvents = useMemo(() => {
    if (selectedCategories.length <= 1) return events
    return events.filter(event =>
      event.category && selectedCategories.includes(event.category.slug)
    )
  }, [events, selectedCategories])

  // Map center logic
  const mapCenter: [number, number] = useMemo(() => {
    if (hoveredEventId) {
      const event = filteredEvents.find(e => String(e.id) === hoveredEventId)
      if (event?.coordinatesLat && event?.coordinatesLng) {
        return [event.coordinatesLat, event.coordinatesLng]
      }
    }
    if (filteredEvents.length > 0) {
      const firstEvent = filteredEvents.find(e => e.coordinatesLat && e.coordinatesLng)
      if (firstEvent?.coordinatesLat && firstEvent?.coordinatesLng) {
        return [firstEvent.coordinatesLat, firstEvent.coordinatesLng]
      }
    }
    return [30.3753, 69.3451] // Center of Pakistan fallback
  }, [hoveredEventId, filteredEvents])

  return (
    <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8 h-[calc(100vh-64px)] relative">
      {/* Header and Filter Section */}
      <div className="flex flex-col gap-5 shrink-0">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1 text-xs font-black uppercase tracking-widest text-purple-600 dark:text-purple-400">
              <Sparkles className="h-3.5 w-3.5" /> Explore Calendar
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Discover Events</h1>
            <p className="text-muted-foreground text-sm sm:text-base">Find concerts, hackathons, sports, and cultural festivals near you.</p>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-[320px]">
              <Search className="absolute left-3 top-3 h-4 w-4 text-purple-500" />
              <Input
                placeholder="Search events or locations..."
                className="pl-9 h-11 rounded-xl border-purple-200 dark:border-purple-900 focus-visible:ring-2 focus-visible:ring-purple-600 bg-card shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="h-11 px-4 font-extrabold border-purple-300 dark:border-purple-800 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/50 rounded-xl flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-purple-600" /> Filters
            </Button>
            <Link href="/categories">
              <Button variant="outline" className="h-11 px-4 font-extrabold border-purple-300 dark:border-purple-800 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/50 rounded-xl flex items-center gap-2">
                <LayoutGrid className="h-4 w-4 text-purple-600" /> Browse Categories
              </Button>
            </Link>
          </div>
        </div>

        {/* Category Badges */}
        <div className="flex flex-wrap gap-2 pt-1">
          <Badge
            variant={selectedCategories.length === 0 ? "default" : "outline"}
            className={cn(
              "cursor-pointer px-4 py-2 text-xs font-black rounded-xl transition-all border-purple-200 dark:border-purple-900 shadow-sm",
              selectedCategories.length === 0 
                ? "bg-purple-700 text-white border-0 shadow-purple-900/20" 
                : "hover:border-purple-400 hover:text-purple-600 text-muted-foreground bg-card"
            )}
            onClick={() => setSelectedCategories([])}
          >
            All Events
          </Badge>
          {categories.map((category) => {
            const isSelected = selectedCategories.includes(category.slug);
            return (
              <Badge
                key={category.id}
                variant={isSelected ? "default" : "outline"}
                className={cn(
                  "cursor-pointer px-4 py-2 text-xs font-black rounded-xl transition-all border-purple-200 dark:border-purple-900 shadow-sm",
                  isSelected 
                    ? "bg-purple-700 text-white border-0 shadow-purple-900/20" 
                    : "hover:border-purple-400 hover:text-purple-600 text-muted-foreground bg-card"
                )}
                onClick={() => toggleCategory(category.slug)}
              >
                {category.name}
              </Badge>
            );
          })}
        </div>
      </div>

      {/* Split List and Map view */}
      <div className="flex-1 flex gap-8 min-h-0 overflow-hidden relative">
        {/* Events Grid / List Column */}
        <div className={`w-full lg:w-3/5 overflow-y-auto pr-3 flex flex-col gap-8 pb-20 lg:pb-8 scroll-smooth ${viewMode === 'map' ? 'hidden lg:flex' : 'flex'}`}>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 flex-1">
              <Loader2 className="h-10 w-10 animate-spin text-purple-600 mb-4" />
              <p className="text-muted-foreground text-sm font-semibold">Searching the events calendar...</p>
            </div>
          ) : filteredEvents.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredEvents.map((event) => {
                  const fav = favorites.find((f) => f.eventId === event.id)
                  return (
                    <div key={event.id} className="h-full">
                      <EventCard
                        event={event}
                        isHovered={hoveredEventId === String(event.id)}
                        onHover={setHoveredEventId}
                        initialFavoriteId={fav ? fav.id : null}
                        onFavoriteToggle={handleFavoriteToggleInList}
                      />
                    </div>
                  )
                })}
              </div>
              {page < totalPages && (
                <div className="flex justify-center py-4">
                  <Button
                    variant="outline"
                    className="font-extrabold h-11 border-purple-300 dark:border-purple-800 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/50 rounded-xl px-6"
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                  >
                    {loadingMore ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin text-purple-600" /> Loading more...
                      </>
                    ) : (
                      'Load More Events'
                    )}
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center flex-1">
              <div className="h-16 w-16 bg-purple-100 dark:bg-purple-950/60 rounded-2xl flex items-center justify-center mb-4 border border-purple-200 dark:border-purple-800">
                <Search className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold">No events found</h3>
              <p className="text-muted-foreground text-sm mt-1 max-w-xs mx-auto">
                We couldn't find any events matching your selected filter parameters.
              </p>
              <Button variant="link" onClick={() => {setSearchQuery(''); setSelectedCategories([])}} className="mt-4 text-purple-600 dark:text-purple-400 font-black hover:underline">
                Clear all filters
              </Button>
            </div>
          )}
        </div>

        {/* Map Column */}
        <div className={`w-full lg:w-2/5 h-full rounded-2xl overflow-hidden border border-purple-500/20 shadow-xl bg-card ${viewMode === 'list' ? 'hidden lg:block' : 'block'}`}>
          <EventMap
            events={filteredEvents}
            center={mapCenter}
            zoom={hoveredEventId ? 15 : 6}
            hoveredEventId={hoveredEventId}
          />
        </div>
      </div>

      {/* Floating Toggle Button for Mobile Screens */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 lg:hidden">
        <Button
          onClick={() => setViewMode(viewMode === 'list' ? 'map' : 'list')}
          className="rounded-full h-12 px-6 shadow-2xl flex items-center gap-2 font-black bg-purple-700 hover:bg-purple-800 text-white transition-all duration-200"
        >
          {viewMode === 'list' ? (
            <>
              <MapIcon className="h-5 w-5" /> Show Map
            </>
          ) : (
            <>
              <ListIcon className="h-5 w-5" /> Show List
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

export default function EventsPage() {
  return (
    <Suspense fallback={
      <div className="container py-20 text-center flex flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-purple-600 mb-4" />
        <p className="text-muted-foreground text-sm font-semibold">Loading events...</p>
      </div>
    }>
      <EventsPageContent />
    </Suspense>
  )
}
