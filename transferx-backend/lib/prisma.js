import { PrismaClient } from '@prisma/client';

const globalForPrisma = global;

// Create Prisma client with improved connection handling
let prismaInstance;

try {
  prismaInstance = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    errorFormat: 'pretty',
  });

  // Test connection immediately
  prismaInstance.$connect().then(() => {
    console.log('✅ Prisma successfully connected to database');
  }).catch((err) => {
    console.error('❌ Prisma connection error:', err.message);
  });

} catch (err) {
  console.error('⚠️ Prisma initialization error:', err.message);
  prismaInstance = null;
}

// Use cached instance or create new one
export const prisma = prismaInstance || (globalForPrisma.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
}));

if (process.env.NODE_ENV !== 'production' && prismaInstance) {
  globalForPrisma.prisma = prismaInstance;
}

export default prisma;
