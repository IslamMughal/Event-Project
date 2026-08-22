'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, Phone, MapPin, Send, CheckCircle2, Sparkles, Users, CalendarCheck } from 'lucide-react'

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Event Manager Hero Banner Section */}
      <div className="relative rounded-[2.5rem] border-2 border-purple-500/20 bg-card overflow-hidden shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
          {/* Text Content */}
          <div className="lg:col-span-6 p-8 sm:p-12 lg:p-14 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-700 dark:text-purple-400 text-xs font-black">
              <Sparkles className="h-4 w-4" /> Dedicated Event Management Support
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground leading-tight">
              Connect with us <span className="text-purple-700 dark:text-purple-400">through</span>
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground font-medium leading-relaxed">
              Our experienced event planning specialists are here to guide you through hosting, ticketing, venue setups, and community promotion.
            </p>
          </div>

          {/* Event Manager Feature Photo */}
          <div className="lg:col-span-6 relative h-72 sm:h-96 lg:h-[420px] w-full overflow-hidden">
            <Image
              src="/images/contact_event_manager.jpg"
              alt="Event Management Team Consulting Client"
              fill
              className="object-cover object-center transition-transform duration-700 hover:scale-105"
              priority
              unoptimized
            />
            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent lg:bg-gradient-to-r lg:from-card lg:via-transparent lg:to-transparent" />
          </div>
        </div>
      </div>

      {/* Main Contact Form & Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16 items-start pt-4">
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">Get in Touch</h2>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed font-medium">
              Have questions about an event or need help with your account? 
              Our team is here to support you 24/7.
            </p>
          </div>

          <div className="space-y-5">
            {[
              { icon: Mail, title: 'Email Us', detail: 'BC240440606mis@vu.edu.pk' },
              { icon: Phone, title: 'Call Us', detail: '+92 (123) 1234567' },
              { icon: MapPin, title: 'Visit Us', detail: 'Virtual University Pakistan' },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 p-5 rounded-3xl bg-card border-2 border-purple-500/10 shadow-md hover:shadow-lg hover:border-purple-500/30 transition-all">
                <div className="h-12 w-12 rounded-2xl bg-purple-500/10 flex items-center justify-center shrink-0 text-purple-600">
                  <item.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base">{item.title}</h3>
                  <p className="text-sm text-muted-foreground font-semibold">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Card className="rounded-[2.5rem] shadow-2xl border-2 border-purple-500/15 p-4 bg-card">
          <CardHeader className="text-center space-y-1">
            <CardTitle className="text-2xl font-black">Send a Message</CardTitle>
            <CardDescription className="text-sm font-medium">We'll get back to you as soon as possible.</CardDescription>
          </CardHeader>
          <CardContent>
            {submitted ? (
              <div className="py-12 text-center space-y-6 animate-in fade-in zoom-in duration-500">
                <div className="h-20 w-20 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto border border-emerald-500/20">
                  <CheckCircle2 className="h-12 w-12 text-emerald-500" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-black">Message Sent!</h2>
                  <p className="text-sm text-muted-foreground font-medium">Thank you for reaching out. We'll be in touch soon.</p>
                </div>
                <Button onClick={() => setSubmitted(false)} variant="outline" className="rounded-xl px-8 font-bold border-2">Send another</Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">First Name</label>
                    <Input placeholder="John" className="rounded-xl h-12 border-purple-200 dark:border-purple-900 focus-visible:ring-2 focus-visible:ring-purple-600" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Last Name</label>
                    <Input placeholder="Doe" className="rounded-xl h-12 border-purple-200 dark:border-purple-900 focus-visible:ring-2 focus-visible:ring-purple-600" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email Address</label>
                  <Input type="email" placeholder="john@example.com" className="rounded-xl h-12 border-purple-200 dark:border-purple-900 focus-visible:ring-2 focus-visible:ring-purple-600" required />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Message</label>
                  <Textarea placeholder="How can we help you?" className="rounded-2xl min-h-[140px] resize-none border-purple-200 dark:border-purple-900 focus-visible:ring-2 focus-visible:ring-purple-600" required />
                </div>
                <Button className="w-full h-13 rounded-2xl text-base font-black bg-purple-700 hover:bg-purple-800 text-white shadow-xl shadow-purple-900/20 gap-2">
                  <Send className="h-5 w-5" /> Send Message
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
