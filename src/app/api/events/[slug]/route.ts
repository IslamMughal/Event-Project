import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { fetchStrapi } from '@/lib/strapi';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const session = await getServerSession(authOptions);

    let event: any = null;

    try {
      const checkRes = await fetchStrapi(`events?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=category&populate=organizer`);
      if (checkRes && checkRes.data && checkRes.data.length > 0) {
        event = checkRes.data[0];
      }
    } catch (strapiError) {
      console.warn('Strapi fetch single event failed, using Prisma fallback:', strapiError);
    }

    if (!event) {
      const { prisma } = await import('@/lib/db');
      const prismaEvent = await prisma.event.findUnique({
        where: { slug },
        include: { category: true, organizer: true },
      });

      if (!prismaEvent) {
        return NextResponse.json(
          { error: { status: 404, message: 'Event not found' } },
          { status: 404 }
        );
      }

      event = {
        id: prismaEvent.id,
        documentId: null,
        title: prismaEvent.title,
        slug: prismaEvent.slug,
        description: prismaEvent.description,
        date: prismaEvent.date,
        time: prismaEvent.time,
        venueAddress: prismaEvent.venueAddress,
        coordinatesLat: prismaEvent.coordinatesLat,
        coordinatesLng: prismaEvent.coordinatesLng,
        ticketPrice: prismaEvent.ticketPrice,
        featured: prismaEvent.featured,
        imageUrl: prismaEvent.imageUrl,
        status: prismaEvent.status,
        createdAt: prismaEvent.createdAt,
        updatedAt: prismaEvent.updatedAt,
        category: prismaEvent.category || null,
        organizer: prismaEvent.organizer || null,
      };
    }

    let rsvpCount = 0;
    let userHasRSVPed = false;
    
    const { prisma } = await import('@/lib/db');

    rsvpCount = await prisma.rSVP.count({
      where: { eventId: event.id }
    });

    if (session?.user) {
      const userId = parseInt((session.user as any).id);
      const rsvp = await prisma.rSVP.findUnique({
        where: {
          userId_eventId: {
            userId,
            eventId: event.id,
          },
        },
      });
      userHasRSVPed = !!rsvp;
    }

    return NextResponse.json({
      data: {
        ...event,
        rsvpCount,
        userHasRSVPed,
      },
    });
  } catch (error) {
    console.error('GET event error:', error);
    return NextResponse.json(
      { error: { status: 500, message: 'Internal server error' } },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: { status: 401, message: 'Authentication required' } },
        { status: 401 }
      );
    }

    const userId = parseInt((session.user as any).id);
    const role = (session.user as any).role;

    const checkRes = await fetchStrapi(`events?filters[slug][$eq]=${encodeURIComponent(slug)}`);
    if (!checkRes.data || checkRes.data.length === 0) {
      return NextResponse.json(
        { error: { status: 404, message: 'Event not found' } },
        { status: 404 }
      );
    }
    const event = checkRes.data[0];

    if (event.organizerId !== userId && role !== 'ADMIN') {
      return NextResponse.json(
        { error: { status: 403, message: 'Not authorized to update this event' } },
        { status: 403 }
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
      status,
    } = body;

    const strapiRes = await fetchStrapi(`events/${event.documentId}`, {
      method: 'PUT',
      body: JSON.stringify({
        data: {
          ...(title && { title }),
          ...(description !== undefined && { description }),
          ...(date && { date }),
          ...(time && { time }),
          ...(venueAddress && { venueAddress }),
          ...(coordinatesLat !== undefined && { coordinatesLat: parseFloat(coordinatesLat) }),
          ...(coordinatesLng !== undefined && { coordinatesLng: parseFloat(coordinatesLng) }),
          ...(ticketPrice !== undefined && { ticketPrice: parseFloat(ticketPrice) }),
          ...(featured !== undefined && { featured }),
          ...(imageUrl !== undefined && { imageUrl }),
          ...(categoryId !== undefined && { category: categoryId ? parseInt(categoryId) : null }),
          ...(status && role === 'ADMIN' && { status }),
        }
      })
    });

    if (!strapiRes.data) {
      throw new Error(strapiRes.error?.message || 'Failed to update event in Strapi');
    }

    return NextResponse.json({ data: strapiRes.data });
  } catch (error: any) {
    console.error('PUT event error:', error);
    return NextResponse.json(
      { error: { status: 500, message: error.message || 'Internal server error' } },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: { status: 401, message: 'Authentication required' } },
        { status: 401 }
      );
    }

    const userId = parseInt((session.user as any).id);
    const role = (session.user as any).role;

    const checkRes = await fetchStrapi(`events?filters[slug][$eq]=${encodeURIComponent(slug)}`);
    if (!checkRes.data || checkRes.data.length === 0) {
      return NextResponse.json(
        { error: { status: 404, message: 'Event not found' } },
        { status: 404 }
      );
    }
    const event = checkRes.data[0];

    if (event.organizerId !== userId && role !== 'ADMIN') {
      return NextResponse.json(
        { error: { status: 403, message: 'Not authorized to delete this event' } },
        { status: 403 }
      );
    }

    await fetchStrapi(`events/${event.documentId}`, {
      method: 'DELETE',
    });

    return NextResponse.json({ data: { message: 'Event deleted' } });
  } catch (error) {
    console.error('DELETE event error:', error);
    return NextResponse.json(
      { error: { status: 500, message: 'Internal server error' } },
      { status: 500 }
    );
  }
}
