const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function verify() {
  try {
    console.log('🔍 Verifying Bangladesh Players Data...\n');

    // Count players by position
    const goalkeepers = await prisma.player.count({ where: { position: 'GOALKEEPER', nationality: 'Bangladesh' } });
    const defenders = await prisma.player.count({ where: { position: 'DEFENDER', nationality: 'Bangladesh' } });
    const midfielders = await prisma.player.count({ where: { position: 'MIDFIELDER', nationality: 'Bangladesh' } });
    const forwards = await prisma.player.count({ where: { position: 'FORWARD', nationality: 'Bangladesh' } });

    console.log('📊 Players by Position:');
    console.log(`   Goalkeepers: ${goalkeepers}`);
    console.log(`   Defenders: ${defenders}`);
    console.log(`   Midfielders: ${midfielders}`);
    console.log(`   Forwards: ${forwards}`);
    console.log(`   Total: ${goalkeepers + defenders + midfielders + forwards}\n`);

    // Count clubs
    const bdClubs = await prisma.club.count({ where: { country: 'Bangladesh' } });
    console.log(`🏟️ Bangladesh Clubs: ${bdClubs}\n`);

    // Show top players by market value
    const topPlayers = await prisma.player.findMany({
      where: { nationality: 'Bangladesh' },
      orderBy: { fee: 'desc' },
      take: 5,
      include: {
        current_club: true
      }
    });

    console.log('💰 Top 5 Players by Market Value:');
    topPlayers.forEach((player, index) => {
      console.log(`   ${index + 1}. ${player.first_name} ${player.last_name} - €${(player.fee * 1000000).toLocaleString()} (${player.current_club?.name || 'No Club'})`);
    });

    // Show players with most international caps
    const topCaps = await prisma.playerProfile.findMany({
      orderBy: { appearances: 'desc' },
      take: 5,
      include: {
        user: true,
        currentClub: true
      }
    });

    console.log('\n🏆 Top 5 Players by International Caps:');
    topCaps.forEach((profile, index) => {
      console.log(`   ${index + 1}. ${profile.user.fullName} - ${profile.appearances} caps, ${profile.goalsScored} goals`);
    });

    // Show sample player details
    const samplePlayer = await prisma.player.findFirst({
      where: { first_name: 'Hamza', last_name: 'Choudhury' },
      include: {
        current_club: {
          include: { league: true }
        }
      }
    });

    if (samplePlayer) {
      console.log('\n🌟 Sample Player Detail (Hamza Choudhury):');
      console.log(`   Name: ${samplePlayer.first_name} ${samplePlayer.last_name}`);
      console.log(`   Position: ${samplePlayer.position}`);
      console.log(`   Nationality: ${samplePlayer.nationality}`);
      console.log(`   Club: ${samplePlayer.current_club?.name}`);
      console.log(`   League: ${samplePlayer.current_club?.league?.name}`);
      console.log(`   Market Value: €${(samplePlayer.fee * 1000000).toLocaleString()}`);
      console.log(`   DOB: ${samplePlayer.date_of_birth?.toLocaleDateString()}`);
    }

    console.log('\n✅ Verification complete!');

  } catch (error) {
    console.error('❌ Error during verification:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

verify()
  .catch((e) => {
    console.error('❌ Verification error:', e);
    process.exit(1);
  });
