const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkPlayerFees() {
  try {
    const players = await prisma.player.findMany({
      select: {
        player_id: true,
        first_name: true,
        last_name: true,
        fee: true,
      },
    });

    console.log('Players and their fees:');
    console.log('========================');
    players.forEach(p => {
      console.log(`${p.first_name} ${p.last_name}: €${p.fee || 0}M`);
    });

    const total = players.reduce((sum, p) => {
      const feeValue = p.fee ? parseFloat(p.fee.toString()) : 0;
      return sum + feeValue;
    }, 0);

    console.log('\n========================');
    console.log(`Total fee sum: €${total}M`);
    console.log(`Total players: ${players.length}`);
    
    // Also check aggregate
    const aggregate = await prisma.player.aggregate({
      _sum: {
        fee: true,
      },
    });
    
    console.log(`\nAggregate sum from Prisma: €${aggregate._sum.fee || 0}M`);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkPlayerFees();
