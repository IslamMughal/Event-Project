import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from './db';
import type { UserRole } from '@/types';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password required');
        }
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user || !(await bcrypt.compare(credentials.password, user.password))) {
          throw new Error('Invalid email or password');
        }
        return {
          id: user.id.toString(),
          email: user.email,
          name: user.username,
          image: (user as any).image ?? undefined,
          role: user.role as UserRole,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role as UserRole;
        token.name = user.name ?? '';
        token.username = user.name ?? '';
        token.picture = (user as any).image ?? null;
        token.image = (user as any).image ?? null;
      }
      if (trigger === 'update' && session) {
        if (session.name) {
          token.name = session.name;
          token.username = session.name;
        }
        if (session.image !== undefined) {
          token.image = session.image;
          token.picture = session.image;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).role = token.role as UserRole;
        session.user.name = (token.name || token.username || session.user.name) as string;
        (session.user as any).username = (token.name || token.username || (session.user as any).username) as string;
        session.user.image = token.image as string | null;
        (session.user as any).image = token.image as string | null;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
