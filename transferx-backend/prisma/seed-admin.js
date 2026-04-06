const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const client = new PrismaClient();

async function seedAdmin() {
  try {
    console.log('🔐 Seeding Admin User...');

    const plainPassword = 'admin123';
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    // Create admin user with hashed password
    const adminUser = await client.user.upsert({
      where: { email: 'admin@transferx.com' },
      update: { password: hashedPassword },
      create: {
        email: 'admin@transferx.com',
        password: hashedPassword,
        fullName: 'Admin User',
        role: 'ADMIN',
      },
    });

    console.log('✅ Admin user created/verified:', adminUser.email);
    console.log('📧 Email: admin@transferx.com');
    console.log('🔑 Password: admin123');
    console.log('🔒 Password: [HASHED]');
    console.log('\n✅ Admin account is ready to use!');

  } catch (error) {
    console.error('❌ Error seeding admin:', error);
  } finally {
    await client.$disconnect();
  }
}

seedAdmin();
