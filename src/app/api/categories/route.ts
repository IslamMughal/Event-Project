import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { fetchStrapi } from '@/lib/strapi';

export async function GET() {
  try {
    let data: any[] = [];
    try {
      const strapiRes = await fetchStrapi('categories?sort[0]=name:asc');
      if (strapiRes && strapiRes.data) {
        data = strapiRes.data;
      } else {
        throw new Error('No data returned from Strapi');
      }
    } catch (strapiError) {
      console.warn('Strapi fetch categories failed, using Prisma fallback:', strapiError);
      const { prisma } = await import('@/lib/db');
      const prismaCategories = await prisma.category.findMany({
        orderBy: { name: 'asc' },
      });
      data = prismaCategories.map((c: any) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        color: c.color,
        icon: c.icon,
      }));
    }
    return NextResponse.json({ data });
  } catch (error) {
    console.error('GET categories error:', error);
    return NextResponse.json(
      { error: { status: 500, message: 'Internal server error' } },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      return NextResponse.json(
        { error: { status: 403, message: 'Admin access required' } },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { name, color, icon } = body;

    if (!name) {
      return NextResponse.json(
        { error: { status: 400, message: 'Name is required' } },
        { status: 400 }
      );
    }

    const { slugify } = await import('@/lib/utils');
    const slug = slugify(name);

    const checkRes = await fetchStrapi(`categories?filters[slug][$eq]=${slug}`);
    if (checkRes.data && checkRes.data.length > 0) {
      return NextResponse.json(
        { error: { status: 409, message: 'Category slug already exists' } },
        { status: 409 }
      );
    }

    const strapiRes = await fetchStrapi('categories', {
      method: 'POST',
      body: JSON.stringify({
        data: {
          name,
          slug,
          color: color || '#000000',
          icon,
        }
      })
    });

    if (!strapiRes.data) {
      throw new Error(strapiRes.error?.message || 'Failed to create category in Strapi');
    }

    return NextResponse.json({ data: strapiRes.data });
  } catch (error: any) {
    console.error('POST category error:', error);
    return NextResponse.json(
      { error: { status: 500, message: error.message || 'Internal server error' } },
      { status: 500 }
    );
  }
}
