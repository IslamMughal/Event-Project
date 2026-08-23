import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { fetchStrapi } from '@/lib/strapi';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || undefined;
    const category = searchParams.get('category') || undefined;
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.max(1, parseInt(searchParams.get('limit') || '12'));
    const featured = searchParams.get('featured');

    let data: any[] = [];
    let total = 0;
    let fallbackToPrisma = false;

    try {
      const qs = new URLSearchParams();
      qs.set('populate', 'category');
      qs.set('pagination[page]', String(page));
      qs.set('pagination[pageSize]', String(limit));
      qs.set('sort[0]', 'createdAt:desc');
      qs.set('filters[status][$eq]', 'PUBLISHED');

      if (search) {
        qs.set('filters[$or][0][title][$contains]', search);
        qs.set('filters[$or][1][venueAddress][$contains]', search);
      }
      if (category) {
        qs.set('filters[category][slug][$eq]', category);
      }
      if (featured === 'true') {
        qs.set('filters[featured][$eq]', 'true');
      }

      const strapiRes = await fetchStrapi(`events?${qs.toString()}`);
      if (strapiRes && strapiRes.data) {
        data = strapiRes.data.map((item: any) => ({
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
          rsvpCount: 0,
        }));
        total = strapiRes.meta?.pagination?.total || 0;
      } else {
        fallbackToPrisma = true;
      }
    } catch (strapiError) {
      console.warn('Strapi fetch failed, using Prisma fallback:', strapiError);
      fallbackToPrisma = true;
    }

    if (fallbackToPrisma) {
      const { prisma } = await import('@/lib/db');
      const where: any = {
        status: 'PUBLISHED',
      };

      if (search) {
        where.OR = [
          { title: { contains: search, mode: 'insensitive' } },
          { venueAddress: { contains: search, mode: 'insensitive' } },
        ];
      }
      if (category) {
        where.category = {
          slug: category,
        };
      }
      if (featured === 'true') {
        where.featured = true;
      }

      total = await prisma.event.count({ where });
      const prismaEvents = await prisma.event.findMany({
        where,
        include: {
          category: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip: (page - 1) * limit,
        take: limit,
      });

      data = prismaEvents.map((item: any) => ({
        id: item.id,
        documentId: null,
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
        organizer: null,
        rsvpCount: 0,
      }));
    }

    // Hydrate the rsvpCount from local database
    const eventIds = data.map((e: any) => e.id);
    if (eventIds.length > 0) {
      const { prisma } = await import('@/lib/db');
      const rsvps = await prisma.rSVP.groupBy({
        by: ['eventId'],
        where: { eventId: { in: eventIds } },
        _count: { id: true },
      });
      const rsvpMap = new Map(rsvps.map((r: any) => [r.eventId, r._count.id]));
      data.forEach((e: any) => {
        e.rsvpCount = rsvpMap.get(e.id) || 0;
      });
    }

    return NextResponse.json({
      data,
      meta: {
        pagination: {
          page,
          pageSize: limit,
          total,
          pageCount: Math.ceil(total / limit) || 1,
        },
      },
    });
  } catch (error) {
    console.error('GET events error:', error);
    return NextResponse.json(
      { error: { status: 500, message: 'Internal server error' } },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Require auth
    if (!session?.user) {
      return NextResponse.json(
        { error: { status: 401, message: 'Authentication required' } },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      title,
      description,
      date,
      time,
      venueAddress,
      coordinatesLat,
      coordinatesLng,
      ticketPrice,
      featured,
      imageUrl,
      categoryId,
    } = body;

    // Validate required fields
    if (!title || !date || !time || !venueAddress) {
      return NextResponse.json(
        { error: { status: 400, message: 'title, date, time, and venueAddress are required' } },
        { status: 400 }
      );
    }

    const { prisma } = await import('@/lib/db');
    const { slugify } = await import('@/lib/utils');
    const organizerId = parseInt((session.user as any).id);

    // Auto-generate slug from title, ensure uniqueness in local Prisma DB
    let baseSlug = slugify(title);
    let slug = baseSlug;
    let counter = 2;

    while (true) {
      const existing = await prisma.event.findUnique({ where: { slug } });
      if (!existing) break;
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    let createdEvent = null;

    // Try posting to Strapi first
    try {
      const strapiRes = await fetchStrapi('events', {
        method: 'POST',
        body: JSON.stringify({
          data: {
            title,
            slug,
            description,
            date,
            time,
            venueAddress,
            coordinatesLat: coordinatesLat ? parseFloat(coordinatesLat) : undefined,
            coordinatesLng: coordinatesLng ? parseFloat(coordinatesLng) : undefined,
            ticketPrice: ticketPrice ? parseFloat(ticketPrice) : 0,
            featured: featured || false,
            imageUrl,
            category: categoryId ? parseInt(categoryId) : null,
            organizerId,
            status: 'DRAFT',
          }
        })
      });

      if (strapiRes && strapiRes.data) {
        createdEvent = {
          id: strapiRes.data.id,
          documentId: strapiRes.data.documentId,
          title: strapiRes.data.title,
          slug: strapiRes.data.slug,
          description: strapiRes.data.description,
          date: strapiRes.data.date,
          time: strapiRes.data.time,
          venueAddress: strapiRes.data.venueAddress,
          ticketPrice: strapiRes.data.ticketPrice,
          imageUrl: strapiRes.data.imageUrl,
          status: strapiRes.data.status,
        };
      }
    } catch (strapiError) {
      console.warn('Strapi event creation failed, falling back to Prisma:', strapiError);
    }

    // Fallback directly to Prisma database
    if (!createdEvent) {
      const prismaRes = await prisma.event.create({
        data: {
          title,
          slug,
          description,
          date,
          time,
          venueAddress,
          coordinatesLat: coordinatesLat ? parseFloat(coordinatesLat) : null,
          coordinatesLng: coordinatesLng ? parseFloat(coordinatesLng) : null,
          ticketPrice: ticketPrice ? parseFloat(ticketPrice) : 0,
          featured: featured || false,
          imageUrl,
          categoryId: categoryId ? parseInt(categoryId) : 1, // Fallback to category 1
          organizerId,
          status: 'PENDING',
        }
      });

      createdEvent = {
        id: prismaRes.id,
        documentId: null,
        title: prismaRes.title,
        slug: prismaRes.slug,
        description: prismaRes.description,
        date: prismaRes.date,
        time: prismaRes.time,
        venueAddress: prismaRes.venueAddress,
        ticketPrice: prismaRes.ticketPrice,
        imageUrl: prismaRes.imageUrl,
        status: prismaRes.status,
      };
    }

    return NextResponse.json({ data: createdEvent });
  } catch (error: any) {
    console.error('POST event error:', error);
    return NextResponse.json(
      { error: { status: 500, message: error.message || 'Internal server error' } },
      { status: 500 }
    );
  }
}
