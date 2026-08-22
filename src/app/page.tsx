import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Calendar, Users, ArrowRight, Sparkles, Music, Code, Trophy, Palette, Utensils, HeartPulse, Flame } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import EventCard from "@/components/events/event-card";
import { prisma } from "@/lib/db";
import { fetchStrapi } from "@/lib/strapi";

async function getFeaturedEvents() {
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

  try {
    return await prisma.event.findMany({
      where: { featured: true, status: 'PUBLISHED' },
      include: { category: true },
      take: 6,
      orderBy: { createdAt: 'desc' },
    });
  } catch (prismaError) {
    console.error('Prisma query failed on home page, returning empty list:', prismaError);
    return [];
  }
}

export default async function Home() {
  const featuredEvents = await getFeaturedEvents();

  const categories = [
    { name: 'Music & Concerts', icon: Music, color: 'bg-purple-700', slug: 'music' },
    { name: 'Tech & Hackathons', icon: Code, color: 'bg-indigo-700', slug: 'tech' },
    { name: 'Sports & Fitness', icon: Trophy, color: 'bg-rose-700', slug: 'sports' },
    { name: 'Art & Culture', icon: Palette, color: 'bg-fuchsia-700', slug: 'art' },
    { name: 'Food & Festivals', icon: Utensils, color: 'bg-amber-600', slug: 'food' },
    { name: 'Health & Wellness', icon: HeartPulse, color: 'bg-emerald-700', slug: 'health' },
  ];

  return (
    <div className="flex flex-col gap-16 md:gap-28 pb-20 overflow-hidden">
      {/* Hero Section with Solid Dark Background & Large Logo Watermark */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden py-20 md:py-32 px-4 bg-slate-950">
        {/* Background Event Photo & Gradient Overlay */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <Image
            src="/images/hero-bg.jpg"
            alt="Event Concert Atmosphere Background"
            fill
            className="object-cover object-center scale-105"
            priority
            unoptimized
          />
          {/* Dark Gradient Overlay for optimal contrast */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-slate-950/75 to-slate-950/95 backdrop-blur-[2px]" />
          
          {/* Faint Logo Watermark Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-15">
            <div className="relative w-[450px] h-[450px] sm:w-[600px] sm:h-[600px]">
              <Image
                src="/logo.png"
                alt="Logo Watermark"
                fill
                className="object-contain"
                unoptimized
              />
            </div>
          </div>
        </div>

        <div className="container relative z-10 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-950/80 border border-purple-800 text-purple-200 text-xs font-black mb-8 shadow-xl">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400"></span>
            </span>
            <Flame className="h-4 w-4 text-amber-400 fill-current" />
            Discover Vibrant Live Experiences
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight mb-6 text-white leading-[1.1]">
            Moments that <span className="text-purple-400 font-serif italic">Matter</span>,<br />
            Nearby and Now.
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            Eventify connects you with electrifying concerts, tech summits, cultural festivals, and sports meets in your city.
          </p>

          <div className="max-w-3xl mx-auto p-3 bg-slate-900/90 border-2 border-purple-900/80 rounded-3xl shadow-2xl">
            <form action="/events" method="GET" className="grid grid-cols-1 md:grid-cols-7 gap-2">
              <div className="md:col-span-3 flex items-center gap-2.5 px-4 py-2 border-b md:border-b-0 md:border-r border-slate-800">
                <Search className="h-5 w-5 text-amber-400 shrink-0" />
                <Input name="search" placeholder="Search concerts, tech, food..." className="border-0 focus-visible:ring-0 p-0 h-auto bg-transparent text-sm sm:text-base text-white placeholder:text-slate-400" />
              </div>
              <div className="md:col-span-3 flex items-center gap-2.5 px-4 py-2 border-b md:border-b-0 border-slate-800 md:border-r">
                <MapPin className="h-5 w-5 text-rose-400 shrink-0" />
                <Input placeholder="Location" className="border-0 focus-visible:ring-0 p-0 h-auto bg-transparent text-sm sm:text-base text-white placeholder:text-slate-400" />
              </div>
              <div className="md:col-span-1 flex items-center justify-center p-1">
                <Button type="submit" className="w-full h-11 md:h-12 text-sm font-black rounded-2xl bg-purple-700 hover:bg-purple-800 text-white shadow-xl hover:opacity-95 transition-opacity">
                  Search
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Vibrant Category Bar */}
      <section className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 md:-mt-20 relative z-20">
        <div className="bg-card/95 backdrop-blur-xl border-2 border-purple-500/20 rounded-3xl p-4 sm:p-6 shadow-2xl grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {categories.map((cat) => (
            <Link key={cat.slug} href={`/events?category=${cat.slug}`}>
              <div className="flex items-center gap-3 p-3 rounded-2xl hover:bg-purple-500/10 transition-all group border border-transparent hover:border-purple-500/30">
                <div className={`h-10 w-10 rounded-xl ${cat.color} text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-110 transition-transform`}>
                  <cat.icon className="h-5 w-5" />
                </div>
                <span className="text-xs font-black text-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400 line-clamp-1">
                  {cat.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-purple-700 dark:text-purple-400">
                <Sparkles className="h-3.5 w-3.5" /> Hand-picked Experiences
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight">Featured Events</h2>
              <p className="text-muted-foreground text-sm sm:text-base">Explore top-rated concerts, workshops, and sports meets.</p>
            </div>
            <Link href="/events" className="self-start sm:self-auto">
              <Button variant="outline" className="group font-extrabold tracking-wide h-11 border-purple-300 dark:border-purple-800 text-purple-700 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/50 rounded-xl">
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
            <div className="text-center py-16 border border-dashed border-purple-300 dark:border-purple-800 rounded-3xl bg-purple-50/40 dark:bg-purple-950/20">
              <p className="text-muted-foreground mb-4 font-medium">No featured events found right now.</p>
              <Link href="/dashboard/create-event">
                <Button className="bg-purple-700 hover:bg-purple-800 text-white font-extrabold rounded-xl shadow-md">Create an Event</Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Solid Accent Feature Cards */}
      <section className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="p-8 sm:p-10 rounded-3xl border-2 border-purple-500/20 bg-card hover:border-purple-600 hover:shadow-2xl transition-all flex flex-col items-start text-left group">
            <div className="h-12 w-12 rounded-2xl bg-purple-700 text-white flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-purple-900/20">
              <Calendar className="h-6 w-6" />
            </div>
            <h3 className="font-extrabold text-xl sm:text-2xl mb-2.5">Diverse Categories</h3>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              Explore music concerts, tech conferences, sports tournaments, and food summits.
            </p>
          </div>
          <div className="p-8 sm:p-10 rounded-3xl border-2 border-indigo-500/20 bg-card hover:border-indigo-600 hover:shadow-2xl transition-all flex flex-col items-start text-left group">
            <div className="h-12 w-12 rounded-2xl bg-indigo-700 text-white flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-indigo-900/20">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="font-extrabold text-xl sm:text-2xl mb-2.5">Vibrant Community</h3>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              RSVP with a single click, interact with speakers, and share your event reviews.
            </p>
          </div>
          <div className="p-8 sm:p-10 rounded-3xl border-2 border-blue-500/20 bg-card hover:border-blue-600 hover:shadow-2xl transition-all flex flex-col items-start text-left group">
            <div className="h-12 w-12 rounded-2xl bg-blue-700 text-white flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-blue-900/20">
              <MapPin className="h-6 w-6" />
            </div>
            <h3 className="font-extrabold text-xl sm:text-2xl mb-2.5">Interactive Map Pins</h3>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              Pinpoint venue locations on dynamic Leaflet maps with vivid category markers.
            </p>
          </div>
        </div>
      </section>

      {/* Solid Purple Banner with Watermark Logo Background */}
      <section className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-purple-900 text-white rounded-[2.5rem] p-10 sm:p-16 md:p-20 text-center space-y-6 sm:space-y-8 relative overflow-hidden shadow-2xl">
          <div className="absolute right-[-50px] top-1/2 -translate-y-1/2 opacity-25 pointer-events-none select-none">
            <div className="relative w-96 h-96">
              <Image
                src="/logo.png"
                alt="Logo Watermark"
                fill
                className="object-contain"
                unoptimized
              />
            </div>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-800 text-white text-xs font-black">
            <Sparkles className="h-4 w-4 text-amber-300 fill-current" /> Never Miss a Concert or Hackathon
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black max-w-2xl mx-auto leading-tight">
            Ready to experience something extraordinary?
          </h2>
          <p className="text-purple-100 text-sm sm:text-base sm:text-lg max-w-md mx-auto font-medium">
            Join thousands of event lovers discovering local nightlife, tech, and cultural festivals every day.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mt-4">
            <Input placeholder="Enter your email" className="h-12 rounded-xl bg-purple-950/60 border-purple-700 text-white placeholder:text-purple-300 focus-visible:ring-2 focus-visible:ring-purple-400" />
            <Button variant="secondary" className="h-12 px-6 font-extrabold text-sm rounded-xl bg-white text-purple-950 hover:bg-slate-100 shrink-0 shadow-lg">
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
