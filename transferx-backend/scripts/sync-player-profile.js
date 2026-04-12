// Script to sync Player table details into PlayerProfile table for all users
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function syncPlayerProfiles() {
  const players = await prisma.player.findMany();
  for (const player of players) {
    // Find userId for this player (assuming PlayerProfile.userId = Player.player_id)
    const profile = await prisma.playerProfile.findFirst({
      where: { userId: player.player_id },
    });
    if (profile) {
      await prisma.playerProfile.update({
        where: { id: profile.id },
        data: {
          position: player.position || profile.position,
          nationality: player.nationality || profile.nationality,
          dateOfBirth: player.date_of_birth || profile.dateOfBirth,
          height: profile.height, // No height in Player table
          weight: profile.weight, // No weight in Player table
          preferredFoot: profile.preferredFoot, // No foot in Player table
          marketValue: player.fee ? Number(player.fee) : profile.marketValue,
          // You can add more mappings if Player table has more fields
        },
      });
      console.log(`Updated PlayerProfile for userId=${profile.userId}`);
    }
  }
  await prisma.$disconnect();
}

syncPlayerProfiles().catch(e => {
  console.error(e);
  process.exit(1);
});
