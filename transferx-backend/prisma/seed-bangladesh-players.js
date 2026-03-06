const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// Helper function to parse date
function parseDate(dateStr) {
  if (!dateStr) return null;
  const [day, month, year] = dateStr.split('/');
  return new Date(`${year}-${month}-${day}`);
}

// Helper function to parse market value
function parseMarketValue(valueStr) {
  if (!valueStr || valueStr === '-') return 0;
  const cleaned = valueStr.replace('€', '').replace('k', '000').replace('m', '000000');
  return parseFloat(cleaned) || 0;
}

// Helper function to parse height in meters
function parseHeight(heightStr) {
  if (!heightStr || heightStr === '-') return null;
  const height = parseFloat(heightStr.replace('m', '').replace(',', '.'));
  return height * 100; // Convert to cm
}

async function main() {
  try {
    console.log('🌱 Starting Bangladesh Players seed data insertion...');

    // Create Bangladesh Premier League
    let bdLeague = await prisma.league.findFirst({
      where: { name: 'Bangladesh Premier League' }
    });

    if (!bdLeague) {
      bdLeague = await prisma.league.create({
        data: {
          name: 'Bangladesh Premier League',
          country: 'Bangladesh',
        },
      });
      console.log('✓ Bangladesh Premier League created');
    }

    // Create English Premier League for Leicester City
    let englishLeague = await prisma.league.findFirst({
      where: { name: 'Premier League' }
    });

    if (!englishLeague) {
      englishLeague = await prisma.league.create({
        data: {
          name: 'Premier League',
          country: 'England',
        },
      });
      console.log('✓ Premier League created');
    }

    // Create clubs
    const clubs = [
      { name: 'Bashundhara Kings', country: 'Bangladesh', league_id: bdLeague.league_id, founded_year: 2013 },
      { name: 'Mohammedan SC (Dhaka)', country: 'Bangladesh', league_id: bdLeague.league_id, founded_year: 1936 },
      { name: 'Abahani Limited Dhaka', country: 'Bangladesh', league_id: bdLeague.league_id, founded_year: 1972 },
      { name: 'Bangladesh Police FC', country: 'Bangladesh', league_id: bdLeague.league_id, founded_year: 1976 },
      { name: 'Brothers Union', country: 'Bangladesh', league_id: bdLeague.league_id, founded_year: 1960 },
      { name: 'PWD SC (Dhaka)', country: 'Bangladesh', league_id: bdLeague.league_id, founded_year: 1961 },
      { name: 'Fortis FC', country: 'Bangladesh', league_id: bdLeague.league_id, founded_year: 2013 },
      { name: 'Leicester City', country: 'England', league_id: englishLeague.league_id, founded_year: 1884 },
      { name: 'Rimal Al-Sahra SC', country: 'Saudi Arabia', league_id: bdLeague.league_id, founded_year: 2020 },
      { name: 'Gloucester City', country: 'England', league_id: englishLeague.league_id, founded_year: 1889 },
      { name: 'Olbia Calcio 1905', country: 'Italy', league_id: bdLeague.league_id, founded_year: 1905 },
    ];

    const clubMap = {};
    for (const clubData of clubs) {
      let club = await prisma.club.findFirst({
        where: { name: clubData.name }
      });

      if (!club) {
        club = await prisma.club.create({ data: clubData });
        console.log(`✓ Club created: ${club.name}`);
      }
      clubMap[club.name] = club.club_id;
    }

    // Bangladesh National Team Players Data
    const players = [
      // Goalkeepers
      { jerseyNumber: 12, name: 'Sujon Hossain', position: 'GOALKEEPER', dob: '05/08/1996', club: 'Mohammedan SC (Dhaka)', height: '1,80m', foot: 'right', caps: 1, goals: 0, debut: '06/09/2025', marketValue: '€125k' },
      { jerseyNumber: 13, name: 'Mitul Marma', position: 'GOALKEEPER', dob: '11/12/2003', club: 'Abahani Limited Dhaka', height: '1,80m', foot: 'right', caps: 19, goals: 0, debut: '12/10/2023', marketValue: '€100k' },
      { jerseyNumber: 1, name: 'Mehedi Hasan Srabon', position: 'GOALKEEPER', dob: '12/08/2005', club: 'Bashundhara Kings', height: null, foot: 'right', caps: 2, goals: 0, debut: '21/11/2023', marketValue: '€75k' },
      { jerseyNumber: null, name: 'Pappu Hossain', position: 'GOALKEEPER', dob: '07/04/1999', club: 'Abahani Limited Dhaka', height: null, foot: 'right', caps: 0, goals: 0, debut: null, marketValue: '€50k' },
      
      // Defenders - Centre-Back
      { jerseyNumber: 14, name: 'Tariq Kazi', position: 'DEFENDER', dob: '06/10/2000', club: null, height: '1,79m', foot: 'right', caps: 35, goals: 2, debut: '03/06/2021', marketValue: '€200k' },
      { jerseyNumber: 4, name: 'Topu Barman', position: 'DEFENDER', dob: '20/12/1994', club: 'Bashundhara Kings', height: '1,83m', foot: 'right', caps: 66, goals: 6, debut: '02/06/2015', marketValue: '€150k' },
      { jerseyNumber: null, name: 'Sakil Hossain', position: 'DEFENDER', dob: '06/07/2002', club: 'Abahani Limited Dhaka', height: '1,75m', foot: 'right', caps: 10, goals: 2, debut: '12/10/2023', marketValue: '€100k' },
      { jerseyNumber: null, name: 'Mehedi Hasan', position: 'DEFENDER', dob: '24/10/1994', club: 'Mohammedan SC (Dhaka)', height: '1,78m', foot: 'right', caps: 5, goals: 0, debut: '27/03/2021', marketValue: '€100k' },
      { jerseyNumber: null, name: 'Md Jahid Hasan', position: 'DEFENDER', dob: '01/06/2003', club: 'Mohammedan SC (Dhaka)', height: '1,79m', foot: 'right', caps: 0, goals: 0, debut: null, marketValue: '€25k' },
      { jerseyNumber: 2, name: 'Shakil Ahad Topu', position: 'DEFENDER', dob: '06/04/2006', club: 'Mohammedan SC (Dhaka)', height: null, foot: 'right', caps: 9, goals: 0, debut: '13/11/2024', marketValue: '€25k' },
      
      // Defenders - Full-Backs
      { jerseyNumber: null, name: 'Isa Faysal', position: 'DEFENDER', dob: '20/08/1999', club: 'Bangladesh Police FC', height: '1,76m', foot: 'left', caps: 15, goals: 0, debut: '22/06/2023', marketValue: '€250k' },
      { jerseyNumber: 22, name: 'Saad Uddin', position: 'DEFENDER', dob: '01/09/1998', club: 'Bashundhara Kings', height: '1,75m', foot: 'both', caps: 45, goals: 2, debut: '04/09/2018', marketValue: '€150k' },
      { jerseyNumber: null, name: 'Abdullah Omar', position: 'DEFENDER', dob: '17/10/1994', club: 'Fortis FC', height: null, foot: 'right', caps: 0, goals: 0, debut: null, marketValue: '€75k' },
      { jerseyNumber: 19, name: 'Zayyan Ahmed', position: 'DEFENDER', dob: '28/01/2004', club: 'Rimal Al-Sahra SC', height: '1,75m', foot: 'left', caps: 4, goals: 0, debut: '09/10/2025', marketValue: '0' },
      { jerseyNumber: null, name: 'Rahmat Mia', position: 'DEFENDER', dob: '08/12/1999', club: 'Mohammedan SC (Dhaka)', height: '1,70m', foot: 'both', caps: 36, goals: 0, debut: '29/08/2018', marketValue: '€175k' },
      { jerseyNumber: 15, name: 'Md Taj Uddin', position: 'DEFENDER', dob: '18/07/2002', club: 'Bashundhara Kings', height: '1,71m', foot: 'right', caps: 4, goals: 0, debut: '04/06/2025', marketValue: '€75k' },
      
      // Midfielders
      { jerseyNumber: 8, name: 'Hamza Choudhury', position: 'MIDFIELDER', dob: '01/10/1997', club: 'Leicester City', height: '1,78m', foot: 'right', caps: 7, goals: 4, debut: '25/03/2025', marketValue: '€4500k' },
      { jerseyNumber: 5, name: 'Mohammad Ridoy', position: 'MIDFIELDER', dob: '01/01/2002', club: 'Bashundhara Kings', height: '1,80m', foot: 'right', caps: 25, goals: 0, debut: '16/11/2021', marketValue: '€175k' },
      { jerseyNumber: 6, name: 'Jamal Bhuyan', position: 'MIDFIELDER', dob: '10/04/1990', club: 'Brothers Union', height: '1,73m', foot: 'right', caps: 89, goals: 1, debut: '31/08/2013', marketValue: '€100k' },
      { jerseyNumber: 17, name: 'Sohel Rana', position: 'MIDFIELDER', dob: '27/03/1995', club: 'Bashundhara Kings', height: '1,73m', foot: 'right', caps: 71, goals: 1, debut: '02/03/2013', marketValue: '€200k' },
      { jerseyNumber: 23, name: 'Shamit Shome', position: 'MIDFIELDER', dob: '05/09/1997', club: null, height: '1,78m', foot: 'right', caps: 5, goals: 1, debut: '10/06/2025', marketValue: '€200k' },
      { jerseyNumber: 16, name: 'Md Sohel Rana', position: 'MIDFIELDER', dob: '01/06/1996', club: 'Bashundhara Kings', height: '1,73m', foot: 'right', caps: 21, goals: 0, debut: '22/09/2022', marketValue: '€175k' },
      { jerseyNumber: null, name: 'Chandon Roy', position: 'MIDFIELDER', dob: '04/05/2007', club: 'Bashundhara Kings', height: '1,70m', foot: 'right', caps: 5, goals: 0, debut: '21/03/2024', marketValue: '€125k' },
      { jerseyNumber: 21, name: 'Quazem Shah', position: 'MIDFIELDER', dob: '25/10/1998', club: 'Abahani Limited Dhaka', height: '1,74m', foot: 'right', caps: 6, goals: 0, debut: '11/06/2024', marketValue: '€100k' },
      { jerseyNumber: null, name: 'Mojibur Rahman Jony', position: 'MIDFIELDER', dob: '02/06/2005', club: 'Bashundhara Kings', height: '1,65m', foot: 'right', caps: 21, goals: 2, debut: '25/03/2023', marketValue: '€50k' },
      { jerseyNumber: 18, name: 'Cuba Mitchell', position: 'MIDFIELDER', dob: '23/11/2005', club: 'Gloucester City', height: '1,80m', foot: 'right', caps: 1, goals: 0, debut: '13/11/2025', marketValue: '0' },
      { jerseyNumber: null, name: 'Fahamedul Islam', position: 'MIDFIELDER', dob: '30/06/2006', club: 'Olbia Calcio 1905', height: '1,70m', foot: 'right', caps: 4, goals: 0, debut: '04/06/2025', marketValue: '0' },
      { jerseyNumber: null, name: 'Shekh Morsalin', position: 'MIDFIELDER', dob: '25/11/2005', club: 'Abahani Limited Dhaka', height: null, foot: 'right', caps: 21, goals: 7, debut: '15/06/2023', marketValue: '€150k' },
      
      // Forwards/Wingers
      { jerseyNumber: 11, name: 'Foysal Ahmed Fahim', position: 'FORWARD', dob: '24/02/2002', club: 'Bashundhara Kings', height: '1,65m', foot: 'right', caps: 30, goals: 1, debut: '13/11/2021', marketValue: '€150k' },
      { jerseyNumber: 10, name: 'Rakib Hossain', position: 'FORWARD', dob: '18/11/1998', club: 'Bashundhara Kings', height: '1,73m', foot: 'right', caps: 49, goals: 6, debut: '19/01/2020', marketValue: '€250k' },
      { jerseyNumber: 9, name: 'Shahriar Emon', position: 'FORWARD', dob: '07/03/2001', club: 'Bashundhara Kings', height: '1,78m', foot: 'left', caps: 10, goals: 0, debut: '11/06/2024', marketValue: '€150k' },
      { jerseyNumber: null, name: 'Arif Hossain', position: 'FORWARD', dob: '31/12/2001', club: 'Mohammedan SC (Dhaka)', height: '1,67m', foot: 'right', caps: 1, goals: 0, debut: '06/09/2025', marketValue: '€125k' },
      { jerseyNumber: null, name: 'Mohammad Ibrahim', position: 'FORWARD', dob: '07/08/1997', club: 'Abahani Limited Dhaka', height: '1,78m', foot: 'both', caps: 41, goals: 4, debut: '01/10/2018', marketValue: '€100k' },
      { jerseyNumber: null, name: 'Mohammed Abdullah', position: 'FORWARD', dob: '16/10/1997', club: 'PWD SC (Dhaka)', height: '1,75m', foot: 'right', caps: 9, goals: 0, debut: '01/09/2016', marketValue: '€75k' },
      { jerseyNumber: null, name: 'Mursed Ali', position: 'FORWARD', dob: '20/12/2008', club: 'Fortis FC', height: '1,65m', foot: 'left', caps: 0, goals: 0, debut: null, marketValue: '0' },
      { jerseyNumber: null, name: 'Sumon Reza', position: 'FORWARD', dob: '15/06/1995', club: 'Mohammedan SC (Dhaka)', height: '1,69m', foot: 'right', caps: 28, goals: 1, debut: '13/11/2020', marketValue: '€75k' },
      { jerseyNumber: 20, name: 'Arman Foysal Akash', position: 'FORWARD', dob: '13/01/2004', club: 'PWD SC (Dhaka)', height: '1,85m', foot: 'right', caps: 1, goals: 0, debut: '14/10/2025', marketValue: '€75k' },
      { jerseyNumber: null, name: 'Md Alamin Islam', position: 'FORWARD', dob: '29/03/2004', club: 'Abahani Limited Dhaka', height: null, foot: 'right', caps: 2, goals: 0, debut: '04/06/2025', marketValue: '€10k' },
    ];

    console.log(`\n🏃 Creating ${players.length} Bangladesh national team players...\n`);

    const defaultPassword = await bcrypt.hash('player123', 10);
    let createdCount = 0;
    let updatedCount = 0;

    for (const playerData of players) {
      const [firstName, ...lastNameParts] = playerData.name.trim().split(' ');
      const lastName = lastNameParts.join(' ') || firstName;
      
      const clubId = playerData.club ? clubMap[playerData.club] : null;
      const dob = parseDate(playerData.dob);
      const height = parseHeight(playerData.height);
      const marketValue = parseMarketValue(playerData.marketValue);
      const debutDate = parseDate(playerData.debut);

      // Check if player already exists in Player table
      let player = await prisma.player.findFirst({
        where: {
          first_name: firstName,
          last_name: lastName
        }
      });

      if (!player) {
        player = await prisma.player.create({
          data: {
            first_name: firstName,
            last_name: lastName,
            date_of_birth: dob,
            position: playerData.position,
            nationality: 'Bangladesh',
            current_club_id: clubId,
            fee: marketValue / 1000000, // Convert to millions
          },
        });
        console.log(`✓ Player created: ${playerData.name} (${playerData.position})`);
        createdCount++;
      } else {
        // Update existing player
        await prisma.player.update({
          where: { player_id: player.player_id },
          data: {
            date_of_birth: dob,
            position: playerData.position,
            nationality: 'Bangladesh',
            current_club_id: clubId,
            fee: marketValue / 1000000,
          },
        });
        console.log(`✓ Player updated: ${playerData.name}`);
        updatedCount++;
      }
    }

    console.log(`\n✅ Bangladesh Players seed completed!`);
    console.log(`   📊 Created: ${createdCount} players`);
    console.log(`   📝 Updated: ${updatedCount} players`);
    console.log(`   📈 Total: ${players.length} players processed`);

  } catch (error) {
    console.error('❌ Error during seed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  });
