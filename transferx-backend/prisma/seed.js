const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Seed Application Statuses
  console.log('Creating application statuses...');
  const statuses = [
    { status: 'PENDING', description: 'Transfer request submitted and awaiting review' },
    { status: 'UNDER_REVIEW', description: 'Transfer request is being reviewed by the club' },
    { status: 'NEGOTIATING', description: 'Transfer terms are being negotiated' },
    { status: 'ACCEPTED', description: 'Transfer request accepted, awaiting contract signing' },
    { status: 'REJECTED', description: 'Transfer request rejected' },
    { status: 'COMPLETED', description: 'Transfer completed and contract signed' },
  ];

  for (const status of statuses) {
    await prisma.applicationStatus.upsert({
      where: { status: status.status },
      update: {},
      create: status,
    });
  }

  // Seed Admin User
  console.log('Creating admin user...');
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@transferx.com' },
    update: {},
    create: {
      email: 'admin@transferx.com',
      password: adminPassword,
      fullName: 'System Administrator',
      role: 'ADMIN',
    },
  });

  // Seed Leagues
  console.log('Creating leagues...');
  const premierLeague = await prisma.league.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Premier League',
      country: 'England',
      tier: 1,
      description: 'The top tier of English football',
    },
  });

  const laLiga = await prisma.league.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'La Liga',
      country: 'Spain',
      tier: 1,
      description: 'Spain\'s top football division',
    },
  });

  const bundesliga = await prisma.league.upsert({
    where: { id: 3 },
    update: {},
    create: {
      name: 'Bundesliga',
      country: 'Germany',
      tier: 1,
      description: 'Germany\'s premier football league',
    },
  });

  const championship = await prisma.league.upsert({
    where: { id: 4 },
    update: {},
    create: {
      name: 'Championship',
      country: 'England',
      tier: 2,
      description: 'The second tier of English football',
    },
  });

  // Seed Clubs
  console.log('Creating clubs...');
  const clubs = [
    {
      name: 'Manchester United',
      leagueId: premierLeague.id,
      country: 'England',
      city: 'Manchester',
      founded: 1878,
      stadium: 'Old Trafford',
      capacity: 74879,
    },
    {
      name: 'Real Madrid',
      leagueId: laLiga.id,
      country: 'Spain',
      city: 'Madrid',
      founded: 1902,
      stadium: 'Santiago Bernabéu',
      capacity: 81044,
    },
    {
      name: 'Bayern Munich',
      leagueId: bundesliga.id,
      country: 'Germany',
      city: 'Munich',
      founded: 1900,
      stadium: 'Allianz Arena',
      capacity: 75024,
    },
    {
      name: 'Leeds United',
      leagueId: championship.id,
      country: 'England',
      city: 'Leeds',
      founded: 1919,
      stadium: 'Elland Road',
      capacity: 37890,
    },
  ];

  for (const club of clubs) {
    await prisma.club.create({
      data: club,
    });
  }

  // Seed a Player User
  console.log('Creating sample player...');
  const playerPassword = await bcrypt.hash('player123', 10);
  const player = await prisma.user.create({
    data: {
      email: 'player@example.com',
      password: playerPassword,
      fullName: 'John Striker',
      role: 'PLAYER',
      playerProfile: {
        create: {
          position: 'FORWARD',
          nationality: 'England',
          dateOfBirth: new Date('1998-05-15'),
          height: 182,
          weight: 78,
          preferredFoot: 'RIGHT',
          marketValue: 15.5,
          goalsScored: 45,
          assists: 12,
          appearances: 120,
          rating: 7.8,
          bio: 'Promising young striker with excellent finishing ability',
        },
      },
    },
  });

  // Seed an Agent User
  console.log('Creating sample agent...');
  const agentPassword = await bcrypt.hash('agent123', 10);
  const agent = await prisma.user.create({
    data: {
      email: 'agent@example.com',
      password: agentPassword,
      fullName: 'Sarah Johnson',
      role: 'AGENT',
      agentProfile: {
        create: {
          agency: 'Elite Sports Management',
          licenseNumber: 'ESM-2024-001',
          yearsExperience: 8,
          specialization: 'European Transfers',
          successfulDeals: 25,
          averageRating: 4.5,
        },
      },
    },
  });

  // Seed Transfer Opportunities
  console.log('Creating transfer opportunities...');
  const manUtd = await prisma.club.findFirst({ where: { name: 'Manchester United' } });
  const realMadrid = await prisma.club.findFirst({ where: { name: 'Real Madrid' } });

  if (manUtd) {
    await prisma.transferOpportunity.create({
      data: {
        clubId: manUtd.id,
        position: 'MIDFIELDER',
        minRating: 7.0,
        maxBudget: 50,
        description: 'Looking for a creative midfielder to strengthen the squad',
        requirements: JSON.stringify({
          age: 'Under 28',
          experience: 'Minimum 50 professional appearances',
          skills: ['Passing', 'Vision', 'Stamina'],
        }),
        benefits: 'Competitive salary, Champions League football, world-class facilities',
        endDate: new Date('2026-08-31'),
      },
    });
  }

  if (realMadrid) {
    await prisma.transferOpportunity.create({
      data: {
        clubId: realMadrid.id,
        position: 'FORWARD',
        minRating: 8.0,
        maxBudget: 100,
        description: 'Seeking a world-class striker for immediate impact',
        requirements: JSON.stringify({
          age: '23-30',
          experience: 'Proven track record in top European leagues',
          skills: ['Finishing', 'Speed', 'Positioning'],
        }),
        benefits: 'La Liga and Champions League participation, exceptional wages',
        endDate: new Date('2026-06-30'),
      },
    });
  }

  console.log('✅ Seed completed successfully!');
  console.log('\nTest Accounts:');
  console.log('Admin: admin@transferx.com / admin123');
  console.log('Player: player@example.com / player123');
  console.log('Agent: agent@example.com / agent123');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
