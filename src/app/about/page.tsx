import React from 'react'
import { Sparkles, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import StatsSection from '@/components/about/stats-section'
import ValuesSection from '@/components/about/values-section'

export default function AboutPage() {
  return (
    <div className="flex flex-col gap-16 md:gap-24 pb-24 overflow-hidden">
      {/* Hero with Logo Watermark */}
      <section className="relative py-20 md:py-28 bg-slate-950 border-b border-purple-500/20 overflow-hidden text-white">
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <Image
            src="/images/hero-bg.jpg"
            alt="Event Atmosphere Background"
            fill
            className="object-cover object-center opacity-30"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/70 to-slate-950/90" />
        </div>
        <div className="absolute right-[-60px] top-1/2 -translate-y-1/2 opacity-15 pointer-events-none select-none z-0">
          <div className="relative w-96 h-96">
            <Image src="/logo.png" alt="Logo Watermark" fill className="object-contain" unoptimized />
          </div>
        </div>
        <div className="container relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-700 dark:text-purple-400 text-xs font-black mb-6">
            <Sparkles className="h-4 w-4" /> Discover Our Purpose
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
            Our <span className="text-purple-700 dark:text-purple-400">Mission</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-medium">
            Connecting communities through shared experiences. Eventify was built to empower
            local organizers and help people discover the moments that matter most.
          </p>
        </div>
      </section>

      {/* Stats Section with animated counter */}
      <section className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <StatsSection />
      </section>

      {/* Values Section with animated cards */}
      <section className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ValuesSection />
      </section>

      {/* Call to action */}
      <section className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-purple-900 text-white rounded-[2.5rem] p-10 sm:p-16 text-center space-y-6 relative overflow-hidden shadow-2xl">
          <h2 className="text-3xl sm:text-4xl font-black max-w-2xl mx-auto leading-tight">
            Be part of the next big community event
          </h2>
          <p className="text-slate-100 text-base sm:text-lg max-w-lg mx-auto font-medium">
            Browse our upcoming events or start hosting your own gathering today.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link href="/events">
              <Button className="h-12 px-8 rounded-xl bg-white text-purple-900 font-extrabold hover:bg-slate-100 shadow-lg">
                Explore Events <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" className="h-12 px-8 rounded-xl border-white/40 text-white font-extrabold hover:bg-white/10 hover:text-white">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}


