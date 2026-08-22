import React from 'react'
import { ShieldCheck, Lock, Eye, FileText } from 'lucide-react'

export const metadata = {
  title: 'Privacy Policy | Eventify',
  description: 'Learn how Eventify protects your personal data and privacy.',
}

export default function PrivacyPage() {
  return (
    <div className="container max-w-4xl px-4 py-16 md:py-24 space-y-10 animate-in fade-in duration-500">
      <div className="space-y-4 border-b border-purple-500/20 pb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-100 dark:bg-purple-950/60 border border-purple-300 dark:border-purple-800 text-purple-700 dark:text-purple-400 text-xs font-black">
          <ShieldCheck className="h-4 w-4" /> Data Protection & Security
        </div>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-foreground">Privacy Policy</h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Last updated: August 22, 2026. Your privacy and trust are our top priorities.
        </p>
      </div>

      <div className="space-y-8 text-foreground/90 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-2xl font-extrabold flex items-center gap-2.5 text-purple-700 dark:text-purple-400">
            <Eye className="h-6 w-6" /> 1. Information We Collect
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Eventify collects information to provide better services to all users. We collect:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-sm sm:text-base text-muted-foreground">
            <li><strong>Account Information:</strong> Name, email address, profile preferences, and role details upon registration.</li>
            <li><strong>Event Activity:</strong> RSVPs, favorite events, submitted event details, and reviews.</li>
            <li><strong>Technical Logs:</strong> IP addresses, browser types, device information, and site interaction data for performance optimization.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-extrabold flex items-center gap-2.5 text-purple-700 dark:text-purple-400">
            <Lock className="h-6 w-6" /> 2. How We Use Your Data
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            We process your information strictly for the following legitimate purposes:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-sm sm:text-base text-muted-foreground">
            <li>Facilitating event discovery, registration, RSVP tracking, and ticketing details.</li>
            <li>Sending critical event updates, booking confirmations, and account security notices.</li>
            <li>Improving site functionality, detecting fraud, and preventing security threats.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-extrabold flex items-center gap-2.5 text-purple-700 dark:text-purple-400">
            <FileText className="h-6 w-6" /> 3. Data Sharing & Privacy Rights
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Eventify does not sell your personal information to third parties. We share data only with event organizers when you explicitly RSVP to an event, or when required by law.
          </p>
          <p className="text-sm sm:text-base text-muted-foreground">
            You have the right to request access to, correction of, or deletion of your personal data at any time by contacting our support team at <a href="mailto:BC240440606mis@vu.edu.pk" className="text-purple-600 dark:text-purple-400 font-bold underline">BC240440606mis@vu.edu.pk</a>.
          </p>
        </section>
      </div>
    </div>
  )
}
