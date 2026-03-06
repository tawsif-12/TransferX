const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function cleanup() {
  try {
    console.log('🧹 Starting cleanup of Bangladesh player user accounts...\n');

    // Find all users with @bd.football emails (Bangladesh players)
    const playerUsers = await prisma.user.findMany({
      where: {
        email: {
          endsWith: '@bd.football'
        }
      },
      include: {
        playerProfile: true
      }
    });

    console.log(`Found ${playerUsers.length} Bangladesh player user accounts to remove.\n`);

    let deletedProfiles = 0;
    let deletedUsers = 0;

    for (const user of playerUsers) {
      // Delete PlayerProfile first (if exists)
      if (user.playerProfile) {
        await prisma.playerProfile.delete({
          where: { userId: user.id }
        });
        deletedProfiles++;
        console.log(`✓ Deleted PlayerProfile for: ${user.fullName}`);
      }

      // Delete User
      await prisma.user.delete({
        where: { id: user.id }
      });
      deletedUsers++;
      console.log(`✓ Deleted User account for: ${user.fullName} (${user.email})`);
    }

    console.log(`\n✅ Cleanup completed!`);
    console.log(`   🗑️ Deleted ${deletedProfiles} player profiles`);
    console.log(`   🗑️ Deleted ${deletedUsers} user accounts`);
    console.log(`   ℹ️ Player records remain in the Player table`);

  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

cleanup()
  .catch((e) => {
    console.error('❌ Cleanup error:', e);
    process.exit(1);
  });
