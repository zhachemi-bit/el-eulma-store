import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function check() {
  try {
    const productsCount = await prisma.product.count();
    const usersCount = await prisma.user.count();
    const vendorsCount = await prisma.vendor.count();
    console.log(`Products: ${productsCount}`);
    console.log(`Users: ${usersCount}`);
    console.log(`Vendors: ${vendorsCount}`);
  } catch (err) {
    console.error('Check failed:', err);
  } finally {
    await prisma.$disconnect();
  }
}

check();
