import React from 'react';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Event Categories - Eventify',
  description: 'Browse all event categories on Eventify',
};

export const dynamic = 'force-dynamic';

export default async function CategoriesPage() {
  // Fetch all categories, along with a count of published events
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: {
          events: {
            where: { status: 'PUBLISHED' },
          },
        },
      },
    },
    orderBy: {
      name: 'asc',
    },
  });

  return (
    <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Browse <span className="text-purple-700 dark:text-purple-400">Categories</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Explore diverse community events across different categories. Find the perfect
            gathering that matches your interests.
          </p>
        </div>
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-20 bg-muted/30 rounded-2xl border border-dashed">
          <p className="text-muted-foreground text-lg">No categories found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/events?category=${category.slug}`}
              className="group relative flex flex-col justify-between p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden isolate"
            >
              {/* Abstract decorative background */}
              <div 
                className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] transition-opacity duration-300 group-hover:opacity-[0.08] dark:group-hover:opacity-10 pointer-events-none -z-10"
                style={{ backgroundColor: category.color }}
              />
              <div 
                className="absolute -right-8 -top-8 w-32 h-32 rounded-full blur-3xl opacity-20 transition-opacity duration-300 group-hover:opacity-40 -z-10"
                style={{ backgroundColor: category.color }}
              />

              <div>
                <div 
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-sm border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950"
                  style={{ color: category.color }}
                >
                  {category.icon}
                </div>
                <h3 className="text-2xl font-bold mb-2 group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors">
                  {category.name}
                </h3>
                <p className="text-muted-foreground font-medium mb-6">
                  {category._count.events} active {category._count.events === 1 ? 'event' : 'events'}
                </p>
              </div>

              <div className="flex items-center text-sm font-bold text-slate-900 dark:text-white group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors mt-auto">
                Explore Category
                <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
