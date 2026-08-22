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
    { name: 'Music & Concerts', icon: Music, color: 'gradient-colorful', slug: 'music' },
    { name: 'Tech & Hackathons', icon: Code, color: 'bg-cyan-500', slug: 'tech' },
    { name: 'Sports & Fitness', icon: Trophy, color: 'bg-rose-500', slug: 'sports' },
    { name: 'Art & Culture', icon: Palette, color: 'bg-pink-500', slug: 'art' },
    { name: 'Food & Festivals', icon: Utensils, color: 'bg-amber-500', slug: 'food' },
    { name: 'Health & Wellness', icon: HeartPulse, color: 'bg-emerald-500', slug: 'health' },
  ];

  return (
    <div className="flex flex-col gap-16 md:gap-28 pb-20 overflow-hidden">
      {/* Hero Section with Glowing Colorful Background */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden py-20 md:py-32 px-4">
        {/* Colorful Glow Orbs Background */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src="/images/hero-banner.png"
            alt="Hero Background"
            fill
            priority
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 via-slate-950/90 to-rose-950/80 backdrop-blur-md" />
          
          {/* Animated Glow Orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/30 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-rose-600/30 rounded-full blur-[120px] animate-pulse delay-1000" />
          <div className="absolute top-1/2 right-1/3 w-72 h-72 bg-amber-500/20 rounded-full blur-[100px]" />
        </div>
        
        <div className="container relative z-10 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white text-xs font-black mb-8 shadow-2xl shadow-purple-500/30">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400"></span>
            </span>
            <Flame className="h-4 w-4 text-amber-400 fill-current" />
            Discover Vibrant Live Experiences
          </div>
          
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight mb-6 text-white leading-[1.1]">
            Moments that <span className="gradient-text font-serif italic">Matter</span>,<br />
            Nearby and Now.
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl text-slate-200 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            Eventify connects you with electrifying concerts, tech summits, cultural festivals, and sports meets in your city.
          </p>
          
          <div className="max-w-3xl mx-auto p-3 bg-white/10 backdrop-blur-2xl border border-white/25 rounded-3xl shadow-2xl shadow-purple-900/50">
            <form action="/events" method="GET" className="grid grid-cols-1 md:grid-cols-7 gap-2">
              <div className="md:col-span-3 flex items-center gap-2.5 px-4 py-2 border-b md:border-b-0 md:border-r border-white/15">
                <Search className="h-5 w-5 text-amber-400 shrink-0" />
                <Input name="search" placeholder="Search concerts, tech, food..." className="border-0 focus-visible:ring-0 p-0 h-auto bg-transparent text-sm sm:text-base text-white placeholder:text-slate-300" />
              </div>
              <div className="md:col-span-3 flex items-center gap-2.5 px-4 py-2 border-b md:border-b-0 border-white/15 md:border-r">
                <MapPin className="h-5 w-5 text-rose-400 shrink-0" />
                <Input placeholder="Location" className="border-0 focus-visible:ring-0 p-0 h-auto bg-transparent text-sm sm:text-base text-white placeholder:text-slate-300" />
              </div>
              <div className="md:col-span-1 flex items-center justify-center p-1">
                <Button type="submit" className="w-full h-11 md:h-12 text-sm font-black rounded-2xl gradient-colorful text-white shadow-xl shadow-rose-500/30 hover:opacity-95 transition-opacity">
                  Search
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Vibrant Category Bar */}
      <section className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 md:-mt-20 relative z-20">
        <div className="bg-card/90 backdrop-blur-xl border border-purple-500/20 rounded-3xl p-4 sm:p-6 shadow-2xl shadow-purple-500/10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
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
              <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-rose-500">
                <Sparkles className="h-3.5 w-3.5" /> Hand-picked Experiences
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight">Featured Events</h2>
              <p className="text-muted-foreground text-sm sm:text-base">Explore top-rated concerts, workshops, and sports meets.</p>
            </div>
            <Link href="/events" className="self-start sm:self-auto">
              <Button variant="outline" className="group font-extrabold tracking-wide h-11 border-purple-300 dark:border-purple-800 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/50 rounded-xl">
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
                <Button className="gradient-colorful text-white font-extrabold rounded-xl shadow-md">Create an Event</Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Colorful Feature Cards */}
      <section className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="p-8 sm:p-10 rounded-3xl border border-purple-500/20 bg-card hover:border-purple-500/60 hover:shadow-2xl hover:shadow-purple-500/15 transition-all flex flex-col items-start text-left group">
            <div className="h-12 w-12 rounded-2xl bg-purple-500 text-white flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-purple-500/30">
              <Calendar className="h-6 w-6" />
            </div>
            <h3 className="font-extrabold text-xl sm:text-2xl mb-2.5">Diverse Categories</h3>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              Explore music concerts, tech conferences, sports tournaments, and food summits.
            </p>
          </div>
          <div className="p-8 sm:p-10 rounded-3xl border border-rose-500/20 bg-card hover:border-rose-500/60 hover:shadow-2xl hover:shadow-rose-500/15 transition-all flex flex-col items-start text-left group">
            <div className="h-12 w-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-rose-500/30">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="font-extrabold text-xl sm:text-2xl mb-2.5">Vibrant Community</h3>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              RSVP with a single click, interact with speakers, and share your event reviews.
            </p>
          </div>
          <div className="p-8 sm:p-10 rounded-3xl border border-cyan-500/20 bg-card hover:border-cyan-500/60 hover:shadow-2xl hover:shadow-cyan-500/15 transition-all flex flex-col items-start text-left group">
            <div className="h-12 w-12 rounded-2xl bg-cyan-500 text-white flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-cyan-500/30">
              <MapPin className="h-6 w-6" />
            </div>
            <h3 className="font-extrabold text-xl sm:text-2xl mb-2.5">Interactive Map Pins</h3>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              Pinpoint venue locations on dynamic Leaflet maps with vivid category markers.
            </p>
          </div>
        </div>
      </section>

      {/* Colorful Sunset Banner */}
      <section className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="gradient-colorful text-white rounded-[2.5rem] p-10 sm:p-16 md:p-20 text-center space-y-6 sm:space-y-8 relative overflow-hidden shadow-2xl shadow-rose-500/30">
          <div className="absolute top-0 right-0 p-8 opacity-15 rotate-12">
            <Calendar className="h-48 w-48" />
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-black">
            <Sparkles className="h-4 w-4 text-amber-300 fill-current" /> Never Miss a Concert or Hackathon
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black max-w-2xl mx-auto leading-tight">
            Ready to experience something extraordinary?
          </h2>
          <p className="text-slate-100 text-sm sm:text-base sm:text-lg max-w-md mx-auto font-medium">
            Join thousands of event lovers discovering local nightlife, tech, and cultural festivals every day.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mt-4">
            <Input placeholder="Enter your email" className="h-12 rounded-xl bg-white/20 border-white/40 text-white placeholder:text-white/70 focus-visible:ring-2 focus-visible:ring-white" />
            <Button variant="secondary" className="h-12 px-6 font-extrabold text-sm rounded-xl bg-white text-purple-900 hover:bg-slate-100 shrink-0 shadow-lg">
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
