const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('🧹 Starting cleanup of dummy data...');

    // Find and delete dummy players (non-Bangladesh players)
    const dummyPlayers = await prisma.player.findMany({
      where: {
        OR: [
          { first_name: 'Cristiano' },
          { last_name: 'Ronaldo' },
          { nationality: 'Portugal' },
        ],
      },
    });

    if (dummyPlayers.length > 0) {
      console.log(`Found ${dummyPlayers.length} dummy player(s) to remove`);

      for (const player of dummyPlayers) {
        console.log(`Deleting player: ${player.first_name} ${player.last_name}`);

        // Delete related records first
        await prisma.transferHistory.deleteMany({
          where: { player_id: player.player_id },
        });

        await prisma.contract.deleteMany({
          where: { player_id: player.player_id },
        });

        await prisma.playerAgent.deleteMany({
          where: { player_id: player.player_id },
        });

        await prisma.transfer.deleteMany({
          where: { player_id: player.player_id },
        });

        // Delete the player
        await prisma.player.delete({
          where: { player_id: player.player_id },
        });

        console.log(`✓ Deleted player and related records: ${player.first_name} ${player.last_name}`);
      }
    } else {
      console.log('No dummy players found');
    }

    // Delete dummy agents (non-Bangladesh)
    const dummyAgents = await prisma.agent.findMany({
      where: {
        OR: [
          { agent_name: { contains: 'Mendes' } },
          { agent_name: { contains: 'Jorge' } },
        ],
      },
    });

    if (dummyAgents.length > 0) {
      for (const agent of dummyAgents) {
        console.log(`Deleting agent: ${agent.agent_name}`);

        await prisma.playerAgent.deleteMany({
          where: { agent_id: agent.agent_id },
        });

        await prisma.agent.delete({
          where: { agent_id: agent.agent_id },
        });

        console.log(`✓ Deleted agent: ${agent.agent_name}`);
      }
    }

    // Delete dummy clubs (Manchester United, Liverpool FC - keep only Bangladesh or real used clubs)
    const dummyClubs = await prisma.club.findMany({
      where: {
        AND: [
          { country: 'England' },
          {
            OR: [
              { name: { contains: 'Manchester United' } },
              { name: { contains: 'Liverpool FC' } },
            ],
          },
        ],
      },
    });

    if (dummyClubs.length > 0) {
      for (const club of dummyClubs) {
        // Check if club has any players assigned
        const playerCount = await prisma.player.count({
          where: { current_club_id: club.club_id },
        });

        if (playerCount === 0) {
          console.log(`Deleting unused club: ${club.name}`);

          // Delete related transfers
          await prisma.transfer.deleteMany({
            where: {
              OR: [
                { from_club_id: club.club_id },
                { to_club_id: club.club_id },
              ],
            },
          });

          await prisma.contract.deleteMany({
            where: { club_id: club.club_id },
          });

          await prisma.club.delete({
            where: { club_id: club.club_id },
          });

          console.log(`✓ Deleted club: ${club.name}`);
        } else {
          console.log(`Skipping club ${club.name} (has ${playerCount} players)`);
        }
      }
    }

    // Delete dummy league (Premier League if not used)
    const premierLeague = await prisma.league.findFirst({
      where: {
        AND: [
          { name: 'Premier League' },
          { country: 'England' },
        ],
      },
    });

    if (premierLeague) {
      const clubCount = await prisma.club.count({
        where: { league_id: premierLeague.league_id },
      });

      if (clubCount === 0) {
        console.log('Deleting unused Premier League');
        await prisma.league.delete({
          where: { league_id: premierLeague.league_id },
        });
        console.log('✓ Deleted unused Premier League');
      }
    }

    console.log('\n✅ Cleanup completed successfully!');
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error('❌ Cleanup error:', e);
    process.exit(1);
  });
