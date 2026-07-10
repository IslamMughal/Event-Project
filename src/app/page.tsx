import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Calendar, Users, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import EventCard from "@/components/events/event-card";
import { prisma } from "@/lib/db";
import { fetchStrapi } from "@/lib/strapi";

async function getFeaturedEvents() {
  // 1. Try to fetch from Strapi first
  try {
    const qs = new URLSearchParams();
    qs.set('populate', 'category');
    qs.set('pagination[page]', '1');
    qs.set('pagination[pageSize]', '6');
    qs.set('sort[0]', 'createdAt:desc');
    qs.set('filters[status][$eq]', 'PUBLISHED');
    qs.set('filters[featured][$eq]', 'true');

    const strapiRes = await fetchStrapi(`events?${qs.toString()}`);
    if (strapiRes && strapiRes.data) {
      return strapiRes.data.map((item: any) => ({
        id: item.id,
        documentId: item.documentId,
        title: item.title,
        slug: item.slug,
        description: item.description,
        date: item.date,
        time: item.time,
        venueAddress: item.venueAddress,
        coordinatesLat: item.coordinatesLat,
        coordinatesLng: item.coordinatesLng,
        ticketPrice: item.ticketPrice,
        featured: item.featured,
        imageUrl: item.imageUrl,
        status: item.status,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        category: item.category || null,
        organizer: item.organizer || null,
      }));
    }
  } catch (strapiError) {
    console.warn('Strapi fetch failed on home page, trying Prisma fallback:', strapiError);
  }

  // 2. Fallback to Prisma
  try {
    return await prisma.event.findMany({
      where: { featured: true, status: 'PUBLISHED' },
      include: { category: true },
      take: 6,
      orderBy: { createdAt: 'desc' }
    });
  } catch (prismaError) {
    console.error('Prisma query failed on home page, returning empty list:', prismaError);
    return [];
  }
}

export default async function Home() {
  const featuredEvents = await getFeaturedEvents();

  return (
    <div className="flex flex-col gap-16 md:gap-28 pb-20">
      {/* Hero Section */}
      <section className="relative min-h-[75vh] flex items-center justify-center overflow-hidden py-16 md:py-28 px-4">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero-banner.png"
            alt="Hero Background"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
        </div>
        
        <div className="container relative z-10 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-xs font-semibold mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-foreground opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            Discover Live Events
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-white leading-[1.1]">
            Moments that <span className="text-neutral-300 italic font-serif font-normal">Matter</span>,<br />
            Nearby and Now.
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl text-neutral-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            Eventify connects you with the most exciting events in your community. 
            From local meetups to cultural festivals, find your next experience here.
          </p>
          
          <div className="max-w-3xl mx-auto p-2 sm:p-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl">
            <form action="/events" method="GET" className="grid grid-cols-1 md:grid-cols-7 gap-2">
              <div className="md:col-span-3 flex items-center gap-2.5 px-4 py-2 border-b md:border-b-0 md:border-r border-white/10">
                <Search className="h-5 w-5 text-neutral-300 shrink-0" />
                <Input name="search" placeholder="What's happening?" className="border-0 focus-visible:ring-0 p-0 h-auto bg-transparent text-sm sm:text-base text-white placeholder:text-neutral-400" />
              </div>
              <div className="md:col-span-3 flex items-center gap-2.5 px-4 py-2 border-b md:border-b-0 border-white/10 md:border-r">
                <MapPin className="h-5 w-5 text-neutral-300 shrink-0" />
                <Input placeholder="Location" className="border-0 focus-visible:ring-0 p-0 h-auto bg-transparent text-sm sm:text-base text-white placeholder:text-neutral-400" />
              </div>
              <div className="md:col-span-1 flex items-center justify-center p-1">
                <Button type="submit" className="w-full h-11 md:h-12 text-sm font-bold rounded-2xl bg-white text-black hover:bg-neutral-100 transition-colors">
                  Search
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Featured Events Grid */}
      <section className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">Featured Events</h2>
              <p className="text-muted-foreground text-sm sm:text-base">Hand-picked premium experiences in Pakistan.</p>
            </div>
            <Link href="/events" className="self-start sm:self-auto">
              <Button variant="outline" className="group font-bold tracking-wide h-11 border-neutral-300 hover:border-black transition-colors">
                View all events <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          {featuredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {featuredEvents.map((event: any) => (
                <div key={event.id} className="h-full">
                  <EventCard event={event as any} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border rounded-2xl bg-muted/20">
              <p className="text-muted-foreground mb-4">No featured events found.</p>
              <Link href="/dashboard/create-event">
                <Button>Create Event</Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Features/Stats Section */}
      <section className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="p-8 sm:p-10 rounded-2xl border bg-card hover:shadow-lg transition-all flex flex-col items-start text-left group">
            <div className="h-12 w-12 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-6 group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-colors">
              <Calendar className="h-6 w-6 text-foreground" />
            </div>
            <h3 className="font-bold text-xl sm:text-2xl mb-2.5">Diverse Events</h3>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              Explore a wide range of events from lit festivals, food summits, to live music concerts.
            </p>
          </div>
          <div className="p-8 sm:p-10 rounded-2xl border bg-card hover:shadow-lg transition-all flex flex-col items-start text-left group">
            <div className="h-12 w-12 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-6 group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-colors">
              <Users className="h-6 w-6 text-foreground" />
            </div>
            <h3 className="font-bold text-xl sm:text-2xl mb-2.5">Active Community</h3>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              Connect with fellow attendees, leave reviews, and share your favorite moments.
            </p>
          </div>
          <div className="p-8 sm:p-10 rounded-2xl border bg-card hover:shadow-lg transition-all flex flex-col items-start text-left group">
            <div className="h-12 w-12 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-6 group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-colors">
              <MapPin className="h-6 w-6 text-foreground" />
            </div>
            <h3 className="font-bold text-xl sm:text-2xl mb-2.5">Interactive Maps</h3>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              Pinpoint event venues, search by city, and get directions instantly using leaflet maps.
            </p>
          </div>
        </div>
      </section>

      {/* Newsletter / CTA */}
      <section className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-neutral-900 text-white rounded-[2rem] p-10 sm:p-16 md:p-20 text-center space-y-6 sm:space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5 rotate-12">
            <Calendar className="h-36 w-36" />
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-extrabold max-w-2xl mx-auto leading-tight">
            Ready to experience something new?
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base sm:text-lg max-w-md mx-auto">
            Join thousands of event lovers. Stay updated with the latest events happening around you.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mt-4">
            <Input placeholder="Enter your email" className="h-12 rounded-xl bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 focus-visible:ring-1 focus-visible:ring-white" />
            <Button variant="secondary" className="h-12 px-6 font-bold text-sm rounded-xl bg-white text-black hover:bg-neutral-100 shrink-0">
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
