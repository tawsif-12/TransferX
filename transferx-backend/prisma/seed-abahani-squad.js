const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// Helper function to parse date from DD/MM/YYYY format
function parseDate(dateStr) {
  if (!dateStr || dateStr === '-' || dateStr === '') return null;
  try {
    const [day, month, year] = dateStr.split('/');
    if (!day || !month || !year) return null;
    return new Date(`${year}-${month}-${day}`);
  } catch (e) {
    return null;
  }
}

// Helper function to parse market value
function parseMarketValue(valueStr) {
  if (!valueStr || valueStr === '-' || valueStr === '') return 0;
  try {
    const cleaned = valueStr.replace('€', '').replace('k', '000').replace('m', '000000').trim();
    return parseFloat(cleaned) || 0;
  } catch (e) {
    return 0;
  }
}

// Calculate age from DOB
function calculateAge(dob) {
  if (!dob) return null;
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
}

// Map position strings to system positions
function mapPosition(positionStr) {
  const pos = positionStr.toLowerCase();
  if (pos.includes('goalkeeper')) return 'GOALKEEPER';
  if (pos.includes('centre-back') || pos.includes('center-back')) return 'DEFENDER';
  if (pos.includes('left-back')) return 'DEFENDER';
  if (pos.includes('right-back')) return 'DEFENDER';
  if (pos.includes('defender')) return 'DEFENDER';
  if (pos.includes('midfield') || pos.includes('midfielder')) return 'MIDFIELDER';
  if (pos.includes('winger')) return 'FORWARD';
  if (pos.includes('striker') || pos.includes('forward') || pos.includes('centre-forward')) return 'FORWARD';
  return 'MIDFIELDER';
}

async function main() {
  try {
    console.log('🌱 Starting Abahani Limited Squad seed...\n');

    // Create Bangladesh Premier League if not exists
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

    // Find or create Abahani Limited Dhaka club
    let abahaniClub = await prisma.club.findFirst({
      where: { name: 'Abahani Limited Dhaka' }
    });

    if (!abahaniClub) {
      abahaniClub = await prisma.club.create({
        data: {
          name: 'Abahani Limited Dhaka',
          country: 'Bangladesh',
          league_id: bdLeague.league_id,
          founded_year: 1972,
        },
      });
      console.log('✓ Abahani Limited Dhaka club created\n');
    } else {
      console.log(`✓ Abahani Limited Dhaka club found (ID: ${abahaniClub.club_id})\n`);
    }

    // Abahani Limited Squad Data - from Transfermarkt
    const playersData = [
      // GOALKEEPERS
      { name: 'Mitul Marma', position: 'Goalkeeper', dob: '11/12/2003', nationality: 'Bangladesh', marketValue: '€200k', jerseyNumber: 30 },
      { name: 'Sahidul Alam', position: 'Goalkeeper', dob: '01/05/1992', nationality: 'Bangladesh', marketValue: '€50k', jerseyNumber: null },
      { name: 'Pappu Hossain', position: 'Goalkeeper', dob: '07/04/1999', nationality: 'Bangladesh', marketValue: '€25k', jerseyNumber: null },
      { name: 'Mahfuz Hasan Pritom', position: 'Goalkeeper', dob: '05/11/1999', nationality: 'Bangladesh', marketValue: '€10k', jerseyNumber: 30 },
      { name: 'Shamim Hossen', position: 'Goalkeeper', dob: '01/11/1998', nationality: 'Bangladesh', marketValue: '€10k', jerseyNumber: 36 },
      { name: 'SP Rafiz', position: 'Goalkeeper', dob: '21/11/2007', nationality: 'Bangladesh', marketValue: '', jerseyNumber: 33 },

      // DEFENDERS - Centre-Back
      { name: 'Shakir Ahmed', position: 'Defender', dob: '04/02/2002', nationality: 'Bangladesh', marketValue: '€10k', jerseyNumber: 5 },
      { name: 'Sakil Hossain', position: 'Centre-Back', dob: '06/07/2002', nationality: 'Bangladesh', marketValue: '€150k', jerseyNumber: 24 },
      { name: 'Assaduzzaman Bablu', position: 'Centre-Back', dob: '01/01/1996', nationality: 'Bangladesh', marketValue: '€150k', jerseyNumber: null },
      { name: 'Hasan Murad', position: 'Centre-Back', dob: '02/01/1998', nationality: 'Bangladesh', marketValue: '€125k', jerseyNumber: 4 },
      { name: 'Yeasin Khan', position: 'Centre-Back', dob: '16/09/1994', nationality: 'Bangladesh', marketValue: '€100k', jerseyNumber: 44 },
      { name: 'Sabuz Hossain', position: 'Centre-Back', dob: '23/07/2002', nationality: 'Bangladesh', marketValue: '€50k', jerseyNumber: null },
      { name: 'Md Abdul Riyadh Fahim', position: 'Centre-Back', dob: '08/08/2008', nationality: 'Bangladesh', marketValue: '', jerseyNumber: null },

      // DEFENDERS - Left-Back & Right-Back
      { name: 'Kamrul Islam', position: 'Left-Back', dob: '25/12/1998', nationality: 'Bangladesh', marketValue: '€150k', jerseyNumber: 16 },
      { name: 'Alomgir Molla', position: 'Left-Back', dob: '06/11/2000', nationality: 'Bangladesh', marketValue: '€125k', jerseyNumber: null },
      { name: 'Sushanto Tripura', position: 'Right-Back', dob: '05/10/1998', nationality: 'Bangladesh', marketValue: '€175k', jerseyNumber: 13 },

      // MIDFIELDERS - Defensive & Central
      { name: 'Papon Singh', position: 'Defensive Midfield', dob: '31/12/1999', nationality: 'Bangladesh', marketValue: '€125k', jerseyNumber: null },
      { name: 'Sayed Hossain Sayem', position: 'Midfielder', dob: '07/02/2002', nationality: 'Bangladesh', marketValue: '€25k', jerseyNumber: null },
      { name: 'Iftiar Hossain', position: 'Midfielder', dob: '24/10/2006', nationality: 'Bangladesh', marketValue: '', jerseyNumber: 8 },
      { name: 'Quazem Shah', position: 'Central Midfield', dob: '25/10/1998', nationality: 'Canada', marketValue: '€200k', jerseyNumber: null },
      { name: 'Tonmoy Das', position: 'Central Midfield', dob: '01/05/2000', nationality: 'Bangladesh', marketValue: '', jerseyNumber: 7 },

      // MIDFIELDERS - Attacking
      { name: 'Shekh Morsalin', position: 'Attacking Midfield', dob: '25/11/2005', nationality: 'Bangladesh', marketValue: '€150k', jerseyNumber: 9 },
      { name: 'Bruno Matos', position: 'Attacking Midfield', dob: '05/06/1990', nationality: 'Brazil', marketValue: '€50k', jerseyNumber: 21 },

      // WINGERS & FORWARDS
      { name: 'Md Enamul Islam', position: 'Left Winger', dob: '12/10/2001', nationality: 'Bangladesh', marketValue: '€150k', jerseyNumber: null },
      { name: 'Jafar Iqbal', position: 'Left Winger', dob: '27/09/1999', nationality: 'Bangladesh', marketValue: '€125k', jerseyNumber: 19 },
      { name: 'Mohammad Ibrahim', position: 'Right Winger', dob: '07/08/1997', nationality: 'Bangladesh', marketValue: '€100k', jerseyNumber: 23 },
      { name: 'Mirajul Islam', position: 'Second Striker', dob: '01/10/2006', nationality: 'Bangladesh', marketValue: '€75k', jerseyNumber: 10 },

      // FORWARDS
      { name: 'Souleymane Diabate', position: 'Centre-Forward', dob: '23/03/1991', nationality: 'Mali', marketValue: '€150k', jerseyNumber: null },
      { name: 'Md Alamin Islam', position: 'Centre-Forward', dob: '29/03/2004', nationality: 'Bangladesh', marketValue: '€100k', jerseyNumber: null },
      { name: 'Emeka Ogbugh', position: 'Centre-Forward', dob: '22/02/1990', nationality: 'Nigeria', marketValue: '€75k', jerseyNumber: 28 },
      { name: 'Md Asadul Molla', position: 'Striker', dob: '26/12/2006', nationality: 'Bangladesh', marketValue: '€50k', jerseyNumber: null },
    ];

    console.log(`📋 Inserting ${playersData.length} players into Abahani Limited Dhaka squad...\n`);

    const defaultPassword = await bcrypt.hash('player123', 10);
    let createdCount = 0;
    let skippedCount = 0;

    for (const playerData of playersData) {
      try {
        const [firstName, ...lastNameParts] = playerData.name.trim().split(' ');
        const lastName = lastNameParts.join(' ') || firstName;
        const dateOfBirth = parseDate(playerData.dob);
        const marketValue = parseMarketValue(playerData.marketValue);
        const position = mapPosition(playerData.position);

        // Check if player already exists
        let existingPlayer = await prisma.player.findFirst({
          where: {
            AND: [
              { first_name: firstName },
              { last_name: lastName },
            ]
          }
        });

        if (!existingPlayer) {
          const player = await prisma.player.create({
            data: {
              first_name: firstName,
              last_name: lastName,
              date_of_birth: dateOfBirth,
              position: position,
              nationality: playerData.nationality,
              current_club_id: abahaniClub.club_id,
              fee: marketValue > 0 ? marketValue : null,
            },
          });

          console.log(`  ✓ ${playerData.name} (${playerData.position}) - Market Value: ${playerData.marketValue || 'N/A'}`);
          createdCount++;
        } else {
          // Update existing player to ensure they're connected to Abahani
          await prisma.player.update({
            where: { player_id: existingPlayer.player_id },
            data: {
              current_club_id: abahaniClub.club_id,
              date_of_birth: dateOfBirth || existingPlayer.date_of_birth,
              position: position || existingPlayer.position,
              nationality: playerData.nationality || existingPlayer.nationality,
              fee: marketValue > 0 ? marketValue : existingPlayer.fee,
            }
          });

          console.log(`  ↻ ${playerData.name} (${playerData.position}) - Updated club assignment`);
          skippedCount++;
        }
      } catch (error) {
        console.error(`  ✗ Error processing ${playerData.name}:`, error.message);
      }
    }

    console.log(`\n✅ Seed completed!`);
    console.log(`   Created: ${createdCount} new players`);
    console.log(`   Updated: ${skippedCount} existing players`);

    // Get squad statistics
    const squadStats = await prisma.player.groupBy({
      by: ['position'],
      where: { current_club_id: abahaniClub.club_id },
      _count: true,
    });

    console.log(`\n📊 Abahani Limited Dhaka Squad Statistics:`);
    console.log(`   Total Players: ${createdCount + skippedCount}`);
    squadStats.forEach(stat => {
      console.log(`   ${stat.position}: ${stat._count}`);
    });

    // Display some player connections
    console.log(`\n🔗 Sample Player-Club Relationships:`);
    const samplePlayers = await prisma.player.findMany({
      where: { current_club_id: abahaniClub.club_id },
      include: { current_club: true },
      take: 5,
    });

    samplePlayers.forEach(player => {
      console.log(`   ${player.first_name} ${player.last_name} → ${player.current_club.name}`);
    });

    console.log(`\n✨ All Abahani Limited players are now in the database with proper relationships!\n`);

  } catch (error) {
    console.error('❌ Error during seed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error('Fatal error:', e);
  process.exit(1);
});
