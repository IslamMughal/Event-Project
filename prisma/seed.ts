import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data to ensure only seeded events exist
  console.log('🧹 Cleaning database...');
  await prisma.rSVP.deleteMany({});
  await prisma.favorite.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.event.deleteMany({});

  // ---------------------------------------------------------------------------
  // Users
  // ---------------------------------------------------------------------------
  const adminPassword = await bcrypt.hash('admin123', 10);
  const userPassword = await bcrypt.hash('user123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@eventify.com' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@eventify.com',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  const regularUser = await prisma.user.upsert({
    where: { email: 'user@eventify.com' },
    update: {},
    create: {
      username: 'user',
      email: 'user@eventify.com',
      password: userPassword,
      role: 'USER',
    },
  });

  console.log(`✅ Users seeded: admin (id=${admin.id}), user (id=${regularUser.id})`);

  // ---------------------------------------------------------------------------
  // Categories
  // ---------------------------------------------------------------------------
  const music = await prisma.category.upsert({
    where: { slug: 'music' },
    update: {},
    create: { name: 'Music', slug: 'music', color: '#FF6B6B', icon: '🎵' },
  });

  const tech = await prisma.category.upsert({
    where: { slug: 'tech' },
    update: {},
    create: { name: 'Tech', slug: 'tech', color: '#4ECDC4', icon: '💻' },
  });

  const food = await prisma.category.upsert({
    where: { slug: 'food' },
    update: {},
    create: { name: 'Food', slug: 'food', color: '#F38181', icon: '🍕' },
  });

  const sports = await prisma.category.upsert({
    where: { slug: 'sports' },
    update: {},
    create: { name: 'Sports', slug: 'sports', color: '#95E1D3', icon: '⚽' },
  });

  const art = await prisma.category.upsert({
    where: { slug: 'art' },
    update: {},
    create: { name: 'Art', slug: 'art', color: '#AA96DA', icon: '🎨' },
  });

  console.log('✅ Categories seeded: Music, Tech, Food, Sports, Art');

  // ---------------------------------------------------------------------------
  // Events  (6 published; 3 featured)
  // ---------------------------------------------------------------------------
  const eventsData = [
    {
      title: 'Lahore Literary Festival 2025',
      slug: 'lahore-literary-festival-2025',
      description:
        'Celebrate literature, art, and culture at the Lahore Literary Festival (LLF) at Alhamra Arts Council. Featuring local and international writers, thinkers, and artists.',
      date: '2025-11-20',
      time: '10:00',
      venueAddress: 'Alhamra Arts Council, Mall Road, Lahore, Pakistan',
      coordinatesLat: 31.5583,
      coordinatesLng: 74.3275,
      ticketPrice: 0.0,
      featured: true,
      imageUrl: '/images/lahore-literary.png',
      status: 'PUBLISHED',
      categoryId: art.id,
      organizerId: admin.id,
    },
    {
      title: 'Karachi Eat Food Festival 2025',
      slug: 'karachi-eat-food-festival-2025',
      description:
        "Pakistan's biggest food festival is back in Karachi! Taste a variety of street foods, gourmet cuisines, desserts, and home-based food ventures at Frere Hall.",
      date: '2025-12-12',
      time: '16:00',
      venueAddress: 'Frere Hall, Fatima Jinnah Rd, Civil Lines, Karachi, Pakistan',
      coordinatesLat: 24.8472,
      coordinatesLng: 67.0329,
      ticketPrice: 1.50,
      featured: true,
      imageUrl: '/images/karachi-eat.png',
      status: 'PUBLISHED',
      categoryId: food.id,
      organizerId: admin.id,
    },
    {
      title: 'Coke Studio Live Islamabad 2025',
      slug: 'coke-studio-live-islamabad-2025',
      description:
        'Experience the magic of Coke Studio live in Islamabad! Featuring sensational performances by top Pakistani pop, rock, and folk artists at the Lok Virsa Amphitheatre.',
      date: '2025-10-18',
      time: '20:00',
      venueAddress: 'Lok Virsa Amphitheatre, Shakarparian, Islamabad, Pakistan',
      coordinatesLat: 33.6938,
      coordinatesLng: 73.0673,
      ticketPrice: 15.0,
      featured: true,
      imageUrl: '/images/coke-studio.png',
      status: 'PUBLISHED',
      categoryId: music.id,
      organizerId: admin.id,
    },
    {
      title: 'Pakistan Auto Show Lahore 2025',
      slug: 'pakistan-auto-show-lahore-2025',
      description:
        'The biggest exhibition of automobiles, auto parts, and accessories in Pakistan. Come see classic cars, modern sports cars, and new electric vehicle models at Expo Centre Lahore.',
      date: '2025-09-15',
      time: '10:00',
      venueAddress: 'Lahore Expo Centre, Johar Town, Lahore, Pakistan',
      coordinatesLat: 31.4673,
      coordinatesLng: 74.2625,
      ticketPrice: 2.0,
      featured: false,
      imageUrl: '/images/auto-show.png',
      status: 'PUBLISHED',
      categoryId: tech.id,
      organizerId: admin.id,
    },
    {
      title: 'Shandur Polo Festival 2025',
      slug: 'shandur-polo-festival-2025',
      description:
        'Watch the traditional polo match played on the highest polo ground in the world at Shandur Pass. Experience unique culture, folk dances, and camping under the stars.',
      date: '2025-08-07',
      time: '09:00',
      venueAddress: 'Shandur Polo Ground, Shandur Pass, Chitral, Pakistan',
      coordinatesLat: 36.0827,
      coordinatesLng: 72.5244,
      ticketPrice: 0.0,
      featured: false,
      imageUrl: '/images/shandur-polo.png',
      status: 'PUBLISHED',
      categoryId: sports.id,
      organizerId: admin.id,
    },
  ];

  const createdEvents: { id: number }[] = [];

  for (const eventData of eventsData) {
    const event = await prisma.event.upsert({
      where: { slug: eventData.slug },
      update: {},
      create: eventData,
    });
    createdEvents.push(event);
  }

  console.log(`✅ Events seeded: ${createdEvents.length} published events (3 featured)`);

  // ---------------------------------------------------------------------------
  // RSVPs  (regular user → event 1 and event 2)
  // ---------------------------------------------------------------------------
  const rsvp1 = await prisma.rSVP.upsert({
    where: { userId_eventId: { userId: regularUser.id, eventId: createdEvents[0].id } },
    update: {},
    create: { userId: regularUser.id, eventId: createdEvents[0].id },
  });

  const rsvp2 = await prisma.rSVP.upsert({
    where: { userId_eventId: { userId: regularUser.id, eventId: createdEvents[1].id } },
    update: {},
    create: { userId: regularUser.id, eventId: createdEvents[1].id },
  });

  console.log(`✅ RSVPs seeded: user RSVPed to event ${rsvp1.eventId} and event ${rsvp2.eventId}`);

  // ---------------------------------------------------------------------------
  // Favorites  (regular user → event 1)
  // ---------------------------------------------------------------------------
  const favorite = await prisma.favorite.upsert({
    where: { userId_eventId: { userId: regularUser.id, eventId: createdEvents[0].id } },
    update: {},
    create: { userId: regularUser.id, eventId: createdEvents[0].id },
  });

  console.log(`✅ Favorites seeded: user favorited event ${favorite.eventId}`);

  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
