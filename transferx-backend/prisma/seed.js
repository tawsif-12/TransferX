const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('🌱 Starting seed data insertion...');

    // Create Admin User
    const adminPassword = await bcrypt.hash('admin123', 10);
    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@transferx.com',
        password: adminPassword,
        fullName: 'Admin User',
        role: 'ADMIN',
      },
    });
    console.log('✓ Admin user created:', { id: adminUser.id, email: adminUser.email, role: adminUser.role });

    // Create Regular User (Player)
    const userPassword = await bcrypt.hash('user123', 10);
    const regularUser = await prisma.user.create({
      data: {
        email: 'user@transferx.com',
        password: userPassword,
        fullName: 'John Doe',
        role: 'PLAYER',
        playerProfile: {
          create: {
            position: 'FORWARD',
            nationality: 'England',
            dateOfBirth: new Date('1995-05-15'),
            height: 180,
            weight: 75,
            preferredFoot: 'Right',
            marketValue: 5000000,
            goalsScored: 25,
            assists: 10,
            appearances: 50,
            rating: 7.5,
            bio: 'Rising star in English football',
          },
        },
      },
    });
    console.log('✓ Regular user created:', { id: regularUser.id, email: regularUser.email, role: regularUser.role });

    // Create League
    const league = await prisma.league.create({
      data: {
        name: 'Premier League',
        country: 'England',
      },
    });
    console.log('✓ League created:', league);

    // Create 2 Clubs
    const club1 = await prisma.club.create({
      data: {
        league_id: league.league_id,
        name: 'Manchester United',
        country: 'England',
        founded_year: 1878,
      },
    });
    console.log('✓ Club 1 created:', club1);

    const club2 = await prisma.club.create({
      data: {
        league_id: league.league_id,
        name: 'Liverpool FC',
        country: 'England',
        founded_year: 1892,
      },
    });
    console.log('✓ Club 2 created:', club2);

    // Create Agent
    const agent = await prisma.agent.create({
      data: {
        agent_name: 'Jorge Mendes',
      },
    });
    console.log('✓ Agent created:', agent);

    // Create Player
    const player = await prisma.player.create({
      data: {
        first_name: 'Cristiano',
        last_name: 'Ronaldo',
        date_of_birth: new Date('1985-02-05'),
        position: 'Forward',
        nationality: 'Portugal',
        current_club_id: club1.club_id,
        fee: 120.5,
      },
    });
    console.log('✓ Player created:', player);

    // Create PlayerAgent relationship
    const playerAgent = await prisma.playerAgent.create({
      data: {
        player_id: player.player_id,
        agent_id: agent.agent_id,
      },
    });
    console.log('✓ PlayerAgent relationship created:', playerAgent);

    // Create Transfer
    const transfer = await prisma.transfer.create({
      data: {
        player_id: player.player_id,
        from_club_id: club2.club_id,
        to_club_id: club1.club_id,
        transfer_fee: 120.5,
        transfer_date: new Date('2023-03-15'),
        transfer_type: 'PERMANENT',
      },
    });
    console.log('✓ Transfer created:', transfer);

    // Create TransferHistory entry
    const transferHistory = await prisma.transferHistory.create({
      data: {
        transfer_id: transfer.transfer_id,
        player_id: player.player_id,
        fee: 120.5,
      },
    });
    console.log('✓ TransferHistory created:', transferHistory);

    // Create Contract
    const contract = await prisma.contract.create({
      data: {
        player_id: player.player_id,
        club_id: club1.club_id,
        start_date: new Date('2023-03-15'),
        end_date: new Date('2026-03-14'),
        salary: 500000,
      },
    });
    console.log('✓ Contract created:', contract);

    console.log('\n✅ Seed data insertion completed successfully!');
  } catch (error) {
    console.error('❌ Error during seed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  });
