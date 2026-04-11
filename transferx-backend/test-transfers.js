const prisma = require('./lib/prisma.js');

async function test() {
  try {
    const count = await prisma.transfer.count();
    console.log('Transfer count:', count);
    
    const transfers = await prisma.transfer.findMany({ 
      take: 2,
      include: {
        player: true,
        from_club: true,
        to_club: true,
      }
    });
    console.log('Transfers:', JSON.stringify(transfers, null, 2));
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

test();
