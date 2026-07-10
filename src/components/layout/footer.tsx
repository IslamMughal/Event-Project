import React from 'react'
import Link from 'next/link'
import { Calendar, Mail, Phone, MapPin, Globe, Send, MessageCircle } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="w-full border-t border-neutral-100 dark:border-neutral-900 bg-background/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="h-9 w-9 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 flex items-center justify-center transition-transform group-hover:scale-105 duration-300">
                <Calendar className="h-5 w-5" />
              </div>
              <span className="font-extrabold text-xl tracking-tight uppercase">Eventify</span>
            </Link>
            <p className="text-sm text-neutral-500 dark:text-neutral-450 leading-relaxed max-w-xs">
              Discover and engage with the best events in your community. Join us in making moments matter.
            </p>
            <div className="flex space-x-3 pt-2">
              <Link href="#" className="h-9 w-9 rounded-full bg-neutral-50 hover:bg-neutral-900 text-neutral-600 hover:text-white dark:bg-neutral-900 dark:hover:bg-white dark:text-neutral-400 dark:hover:text-neutral-900 flex items-center justify-center transition-all duration-300">
                <Globe className="h-4.5 w-4.5" />
              </Link>
              <Link href="#" className="h-9 w-9 rounded-full bg-neutral-50 hover:bg-neutral-900 text-neutral-600 hover:text-white dark:bg-neutral-900 dark:hover:bg-white dark:text-neutral-400 dark:hover:text-neutral-900 flex items-center justify-center transition-all duration-300">
                <Send className="h-4.5 w-4.5" />
              </Link>
              <Link href="#" className="h-9 w-9 rounded-full bg-neutral-50 hover:bg-neutral-900 text-neutral-600 hover:text-white dark:bg-neutral-900 dark:hover:bg-white dark:text-neutral-400 dark:hover:text-neutral-900 flex items-center justify-center transition-all duration-300">
                <MessageCircle className="h-4.5 w-4.5" />
              </Link>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold text-xs uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-5">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link href="/events" className="text-sm font-semibold text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors duration-205">Find Events</Link></li>
              <li><Link href="/dashboard/create-event" className="text-sm font-semibold text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors duration-205">Create Event</Link></li>
              <li><Link href="/about" className="text-sm font-semibold text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors duration-205">About Us</Link></li>
              <li><Link href="/contact" className="text-sm font-semibold text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors duration-205">Contact Us</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-xs uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-5">Support</h3>
            <ul className="space-y-3">
              <li><Link href="/contact" className="text-sm font-semibold text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors duration-205">Help Center</Link></li>
              <li><Link href="/contact" className="text-sm font-semibold text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors duration-205">Safety Center</Link></li>
              <li><Link href="#" className="text-sm font-semibold text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors duration-205">Terms of Service</Link></li>
              <li><Link href="#" className="text-sm font-semibold text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors duration-205">Privacy Policy</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-xs uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-5">Contact Us</h3>
            <ul className="space-y-4.5">
              <li className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-lg bg-neutral-50 dark:bg-neutral-900/50 flex items-center justify-center shrink-0">
                  <Mail className="h-4 w-4 text-neutral-550" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Email</span>
                  <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">hello@eventify.com</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-lg bg-neutral-50 dark:bg-neutral-900/50 flex items-center justify-center shrink-0">
                  <Phone className="h-4 w-4 text-neutral-550" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Phone</span>
                  <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">+1 (555) 000-0000</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-lg bg-neutral-50 dark:bg-neutral-900/50 flex items-center justify-center shrink-0">
                  <MapPin className="h-4 w-4 text-neutral-550" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Address</span>
                  <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">123 Event Street, City, ST 12345</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-neutral-100 dark:border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-neutral-500">
          <p>© {new Date().getFullYear()} Eventify. All rights reserved.</p>
          <div className="flex gap-4.5">
            <Link href="#" className="hover:text-black dark:hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-black dark:hover:text-white transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-black dark:hover:text-white transition-colors">Cookie Settings</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

