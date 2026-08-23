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
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role as UserRole;
        token.name = user.name ?? '';
        token.username = user.name ?? '';
        token.picture = (user as any).image ?? null;
        token.image = (user as any).image ?? null;
      }

      // Always refresh from database so profile changes (name, image, role)
      // are reflected across all components on every page load
      if (token.id) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: parseInt(token.id as string) },
            select: { username: true, image: true, role: true },
          });
          if (dbUser) {
            token.name = dbUser.username;
            token.username = dbUser.username;
            token.image = (dbUser as any).image ?? null;
            token.picture = (dbUser as any).image ?? null;
            token.role = dbUser.role as UserRole;
          }
        } catch {
          // Silently ignore DB errors to avoid breaking auth
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
