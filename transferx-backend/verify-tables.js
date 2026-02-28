const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verifyTables() {
  try {
    const user = await prisma.user.count();
    const league = await prisma.league.count();
    const club = await prisma.club.count();
    const player = await prisma.player.count();
    const agent = await prisma.agent.count();
    const playerAgent = await prisma.playerAgent.count();
    const transfer = await prisma.transfer.count();
    const transferHistory = await prisma.transferHistory.count();
    const contract = await prisma.contract.count();

    console.log('\n╔═══════════════════════════════════════════╗');
    console.log('║   DATABASE TABLES & RECORDS SUMMARY       ║');
    console.log('╚═══════════════════════════════════════════╝\n');
    
    console.log('┌──────────────────────┬──────────┐');
    console.log('│ Table Name           │ Records  │');
    console.log('├──────────────────────┼──────────┤');
    console.log(`│ User                 │    ${user.toString().padStart(2)}    │`);
    console.log(`│ League               │    ${league.toString().padStart(2)}    │`);
    console.log(`│ Club                 │    ${club.toString().padStart(2)}    │`);
    console.log(`│ Player               │    ${player.toString().padStart(2)}    │`);
    console.log(`│ Agent                │    ${agent.toString().padStart(2)}    │`);
    console.log(`│ PlayerAgent          │    ${playerAgent.toString().padStart(2)}    │`);
    console.log(`│ Transfer             │    ${transfer.toString().padStart(2)}    │`);
    console.log(`│ TransferHistory      │    ${transferHistory.toString().padStart(2)}    │`);
    console.log(`│ Contract             │    ${contract.toString().padStart(2)}    │`);
    console.log('└──────────────────────┴──────────┘\n');
    
    const totalRecords = user + league + club + player + agent + playerAgent + transfer + transferHistory + contract;
    console.log(`✅ Total Tables: 9`);
    console.log(`✅ Total Records: ${totalRecords}`);
    console.log(`✅ Database: transferx (SQL Server port 9038)\n`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

verifyTables();
