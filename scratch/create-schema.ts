import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Connecting to database...');
  await prisma.$connect();
  console.log('Creating schema "strapi" if it does not exist...');
  await prisma.$executeRawUnsafe('CREATE SCHEMA IF NOT EXISTS strapi;');
  console.log('Schema "strapi" successfully created or already exists!');
}

main()
  .catch((e) => {
    console.error('Error creating schema:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
