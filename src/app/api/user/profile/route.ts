import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: { status: 401, message: 'Authentication required' } },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, username: true, email: true, image: true, role: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: { status: 404, message: 'User not found' } },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: user });
  } catch (error) {
    console.error('GET user profile error:', error);
    return NextResponse.json(
      { error: { status: 500, message: 'Internal server error' } },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: { status: 401, message: 'Authentication required' } },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: { status: 404, message: 'User not found' } },
        { status: 404 }
      );
    }

    const body = await req.json();
    const { username, image } = body;

    if (!username && image === undefined) {
      return NextResponse.json(
        { error: { status: 400, message: 'Nothing to update' } },
        { status: 400 }
      );
    }

    // Check username uniqueness if changing to a new username
    if (username && username !== user.username) {
      const existing = await prisma.user.findFirst({
        where: { username, NOT: { id: user.id } },
      });
      if (existing) {
        return NextResponse.json(
          { error: { status: 409, message: 'Username already taken' } },
          { status: 409 }
        );
      }
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        ...(username && { username }),
        ...(image !== undefined && { image }),
      },
      select: { id: true, username: true, email: true, image: true, role: true },
    });

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error('PATCH user profile error:', error);
    return NextResponse.json(
      { error: { status: 500, message: 'Internal server error' } },
      { status: 500 }
    );
  }
}
