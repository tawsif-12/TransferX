const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function verify() {
  try {
    console.log('🔍 Verifying Database State After Cleanup...\n');

    // Count users by role
    const adminUsers = await prisma.user.count({ where: { role: 'ADMIN' } });
    const playerUsers = await prisma.user.count({ where: { role: 'PLAYER' } });
    const agentUsers = await prisma.user.count({ where: { role: 'AGENT' } });
    const clubUsers = await prisma.user.count({ where: { role: 'CLUB_MANAGER' } });
    const totalUsers = await prisma.user.count();

    console.log('👥 User Database (User table):');
    console.log(`   Admin: ${adminUsers}`);
    console.log(`   Player: ${playerUsers}`);
    console.log(`   Agent: ${agentUsers}`);
    console.log(`   Club Manager: ${clubUsers}`);
    console.log(`   Total: ${totalUsers}\n`);

    // Count players in Player table
    const totalPlayers = await prisma.player.count();
    const bdPlayers = await prisma.player.count({ where: { nationality: 'Bangladesh' } });

    console.log('⚽ Player Table (Player records):');
    console.log(`   Bangladesh Players: ${bdPlayers}`);
    console.log(`   Total Players: ${totalPlayers}\n`);

    // Count PlayerProfiles
    const totalProfiles = await prisma.playerProfile.count();
    console.log('📊 PlayerProfile Table:');
    console.log(`   Total Profiles: ${totalProfiles}\n`);

    // Show remaining users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
      }
    });

    console.log('📋 Current Users in Database:');
    users.forEach((user) => {
      console.log(`   - ${user.fullName || 'No name'} (${user.email}) - ${user.role}`);
    });

    console.log('\n✅ Verification complete!');
    console.log('   ℹ️ Players exist in Player table, NOT in User table');

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
