import { PrismaClient, Role, SubscriptionPlan, SubscriptionStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash('admin123', 10);

  await prisma.user.upsert({
    where: { email: 'admin@menuqr.com' },
    update: {},
    create: {
      name: 'Platform Admin',
      email: 'admin@menuqr.com',
      passwordHash: hash,
      role: Role.PLATFORM_OWNER,
    },
  });

  const restaurant = await prisma.restaurant.upsert({
    where: { slug: 'demo-cafe' },
    update: {},
    create: {
      name: 'Demo Café',
      slug: 'demo-cafe',
      description: 'Best coffee and pastries in town.',
      phone: '+49 30 1234567',
      address: 'Berlin, Germany',
      latitude: 52.52,
      longitude: 13.405,
      whatsapp: '+49301234567',
      openingHours: {
        monday: '8:00 - 18:00',
        tuesday: '8:00 - 18:00',
        wednesday: '8:00 - 18:00',
        thursday: '8:00 - 18:00',
        friday: '8:00 - 20:00',
        saturday: '9:00 - 20:00',
        sunday: '10:00 - 16:00',
      },
      socialLinks: { instagram: 'https://instagram.com/democafe', facebook: 'https://facebook.com/democafe' },
    },
  });

  await prisma.user.upsert({
    where: { email: 'owner@democafe.com' },
    update: {},
    create: {
      name: 'Restaurant Owner',
      email: 'owner@democafe.com',
      passwordHash: hash,
      role: Role.RESTAURANT_ADMIN,
      restaurantId: restaurant.id,
    },
  });

  const existingSub = await prisma.subscription.findFirst({ where: { restaurantId: restaurant.id } });
  if (!existingSub) {
    await prisma.subscription.create({
      data: {
        restaurantId: restaurant.id,
        plan: SubscriptionPlan.PRO,
        status: SubscriptionStatus.ACTIVE,
        isYearly: false,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });
  }

  const categories = await prisma.category.findMany({ where: { restaurantId: restaurant.id } });
  if (categories.length === 0) {
    const breakfast = await prisma.category.create({
      data: { restaurantId: restaurant.id, name: 'Breakfast', slug: 'breakfast', sortOrder: 0 },
    });
    const coffee = await prisma.category.create({
      data: { restaurantId: restaurant.id, name: 'Coffee', slug: 'coffee', sortOrder: 1 },
    });
    await prisma.product.createMany({
      data: [
        { restaurantId: restaurant.id, categoryId: breakfast.id, name: 'Croissant', slug: 'croissant', price: 3.5, description: 'Fresh butter croissant', isAvailable: true, sortOrder: 0 },
        { restaurantId: restaurant.id, categoryId: breakfast.id, name: 'Avocado Toast', slug: 'avocado-toast', price: 9, description: 'Sourdough, avocado, cherry tomatoes', isAvailable: true, isPopular: true, sortOrder: 1 },
        { restaurantId: restaurant.id, categoryId: coffee.id, name: 'Espresso', slug: 'espresso', price: 2.5, description: 'Single shot', isAvailable: true, sortOrder: 0 },
        { restaurantId: restaurant.id, categoryId: coffee.id, name: 'Cappuccino', slug: 'cappuccino', price: 4, description: 'Double espresso with steamed milk', isAvailable: true, isPopular: true, sortOrder: 1 },
      ],
    });
  }

  console.log('Seed done. Demo café:', restaurant.slug);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => { console.error(e); prisma.$disconnect(); process.exit(1); });
