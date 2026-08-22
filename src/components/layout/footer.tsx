import React from 'react'
import Link from 'next/link'
import { Calendar, Mail, Phone, MapPin, Globe, Send, MessageCircle, Heart, Sparkles } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="w-full border-t border-purple-500/20 bg-card/60 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2.5 group">
              <div className="h-9 w-9 rounded-xl gradient-cyber text-white flex items-center justify-center transition-transform group-hover:scale-105 duration-300 shadow-lg shadow-purple-500/20">
                <Calendar className="h-5 w-5" />
              </div>
              <span className="font-black text-xl tracking-tight uppercase gradient-text">Eventify</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs font-medium">
              Discover and engage with the best concerts, hackathons, sports meets, and community festivals.
            </p>
            <div className="flex space-x-3 pt-2">
              <Link href="#" className="h-9 w-9 rounded-full bg-purple-100 hover:bg-purple-600 text-purple-600 hover:text-white dark:bg-purple-950 dark:hover:bg-purple-600 dark:text-purple-300 dark:hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm">
                <Globe className="h-4.5 w-4.5" />
              </Link>
              <Link href="#" className="h-9 w-9 rounded-full bg-cyan-100 hover:bg-cyan-600 text-cyan-600 hover:text-white dark:bg-cyan-950 dark:hover:bg-cyan-600 dark:text-cyan-300 dark:hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm">
                <Send className="h-4.5 w-4.5" />
              </Link>
              <Link href="#" className="h-9 w-9 rounded-full bg-rose-100 hover:bg-rose-600 text-rose-600 hover:text-white dark:bg-rose-950 dark:hover:bg-rose-600 dark:text-rose-300 dark:hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm">
                <MessageCircle className="h-4.5 w-4.5" />
              </Link>
            </div>
          </div>
          
          <div>
            <h3 className="font-black text-xs uppercase tracking-widest text-purple-600 dark:text-purple-400 mb-5">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link href="/events" className="text-sm font-semibold text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Find Events</Link></li>
              <li><Link href="/dashboard/create-event" className="text-sm font-semibold text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Create Event</Link></li>
              <li><Link href="/about" className="text-sm font-semibold text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400 transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-sm font-semibold text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Contact Us</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-black text-xs uppercase tracking-widest text-purple-600 dark:text-purple-400 mb-5">Support</h3>
            <ul className="space-y-3">
              <li><Link href="/contact" className="text-sm font-semibold text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Help Center</Link></li>
              <li><Link href="/contact" className="text-sm font-semibold text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Safety Center</Link></li>
              <li><Link href="#" className="text-sm font-semibold text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="text-sm font-semibold text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-black text-xs uppercase tracking-widest text-purple-600 dark:text-purple-400 mb-5">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                  <Mail className="h-4 w-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Email</span>
                  <span className="text-sm font-bold text-foreground">hello@eventify.com</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-500 flex items-center justify-center shrink-0">
                  <Phone className="h-4 w-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Phone</span>
                  <span className="text-sm font-bold text-foreground">+1 (555) 000-0000</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-xl bg-cyan-100 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
                  <MapPin className="h-4 w-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Address</span>
                  <span className="text-sm font-bold text-foreground">123 Event Street, City, ST 12345</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-purple-500/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-muted-foreground">
          <p>© {new Date().getFullYear()} Eventify. Built with passion for communities.</p>
          <div className="flex gap-4.5">
            <Link href="#" className="hover:text-purple-600 transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-purple-600 transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-purple-600 transition-colors">Cookie Settings</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
