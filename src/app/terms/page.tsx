import React from 'react'
import { FileCheck, AlertCircle, Scale, ShieldAlert } from 'lucide-react'

export const metadata = {
  title: 'Terms of Service | Eventify',
  description: 'Terms and conditions governing the use of Eventify platform.',
}

export default function TermsPage() {
  return (
    <div className="container max-w-4xl px-4 py-16 md:py-24 space-y-10 animate-in fade-in duration-500">
      <div className="space-y-4 border-b border-purple-500/20 pb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-100 dark:bg-purple-950/60 border border-purple-300 dark:border-purple-800 text-purple-700 dark:text-purple-400 text-xs font-black">
          <FileCheck className="h-4 w-4" /> Legal Agreement
        </div>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-foreground">Terms of Service</h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Effective Date: August 22, 2026. Please read these terms carefully before using Eventify.
        </p>
      </div>

      <div className="space-y-8 text-foreground/90 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-2xl font-extrabold flex items-center gap-2.5 text-purple-700 dark:text-purple-400">
            <Scale className="h-6 w-6" /> 1. Acceptance of Terms
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            By accessing or using the Eventify website and services, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you may not use our services.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-extrabold flex items-center gap-2.5 text-purple-700 dark:text-purple-400">
            <AlertCircle className="h-6 w-6" /> 2. User Responsibilities & Conduct
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            When creating accounts or submitting events on Eventify, you agree to:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-sm sm:text-base text-muted-foreground">
            <li>Provide accurate, current, and complete registration information.</li>
            <li>Maintain the security of your password and accept responsibility for all account activities.</li>
            <li>Post only authentic events, avoiding misleading content, illegal activities, or hate speech.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-extrabold flex items-center gap-2.5 text-purple-700 dark:text-purple-400">
            <ShieldAlert className="h-6 w-6" /> 3. Event Submissions & Moderation
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Eventify administrators reserve the right to review, edit, reject, or remove any event listing that violates platform policies or community standards.
          </p>
          <p className="text-sm sm:text-base text-muted-foreground">
            For questions or disputes regarding terms, contact us at <a href="mailto:BC240440606mis@vu.edu.pk" className="text-purple-600 dark:text-purple-400 font-bold underline">BC240440606mis@vu.edu.pk</a>.
          </p>
        </section>
      </div>
    </div>
  )
}
