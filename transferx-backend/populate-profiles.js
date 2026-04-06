const { exec } = require('child_process');
const { promisify } = require('util');
const fs = require('fs');

const execAsync = promisify(exec);

// Player profile data with position-based realistic stats and market values
const playerProfiles = [
    // Goalkeepers
    { playerId: 13, name: 'Mitul Marma', position: 'GOALKEEPER', height: 188, weight: 82, foot: 'Right', marketValue: 200000, goals: 0, assists: 0, appearances: 45, rating: 7.8 },
    { playerId: 12, name: 'Sujon Hossain', position: 'GOALKEEPER', height: 190, weight: 85, foot: 'Right', marketValue: 175000, goals: 0, assists: 0, appearances: 62, rating: 7.9 },
    { playerId: 1, name: 'Mehedi Hasan Srabon', position: 'GOALKEEPER', height: 186, weight: 80, foot: 'Right', marketValue: 50000, goals: 0, assists: 0, appearances: 28, rating: 7.5 },
    // Defenders - Centre-Backs
    { playerId: 14, name: 'Tariq Kazi', position: 'DEFENDER', height: 192, weight: 88, foot: 'Right', marketValue: 125000, goals: 1, assists: 0, appearances: 35, rating: 7.4 },
    { playerId: 2, name: 'Shakil Ahad Topu', position: 'DEFENDER', height: 190, weight: 86, foot: 'Right', marketValue: 100000, goals: 0, assists: 0, appearances: 22, rating: 7.3 },
    // Defenders - Full-Backs
    { playerId: 22, name: 'Saad Uddin', position: 'DEFENDER', height: 182, weight: 76, foot: 'Left', marketValue: 150000, goals: 2, assists: 3, appearances: 42, rating: 7.6 },
    { playerId: 24, name: 'Abdullah Omar', position: 'DEFENDER', height: 183, weight: 77, foot: 'Left', marketValue: 100000, goals: 1, assists: 2, appearances: 48, rating: 7.2 },
    { playerId: 19, name: 'Zayyan Ahmed', position: 'DEFENDER', height: 180, weight: 74, foot: 'Left', marketValue: 50000, goals: 0, assists: 1, appearances: 18, rating: 7.1 },
    { playerId: 3, name: 'Rahmat Mia', position: 'DEFENDER', height: 184, weight: 78, foot: 'Right', marketValue: 175000, goals: 1, assists: 2, appearances: 46, rating: 7.7 },
    { playerId: 12, name: 'Bishwanath Ghosh', position: 'DEFENDER', height: 181, weight: 75, foot: 'Right', marketValue: 50000, goals: 0, assists: 0, appearances: 38, rating: 7.0 },
    // Midfielders - Defensive
    { playerId: 8, name: 'Hamza Choudhury', position: 'MIDFIELDER', height: 183, weight: 75, foot: 'Right', marketValue: 5000000, goals: 3, assists: 2, appearances: 38, rating: 7.9 },
    { playerId: 5, name: 'Mohammad Ridoy', position: 'MIDFIELDER', height: 179, weight: 71, foot: 'Right', marketValue: 250000, goals: 2, assists: 1, appearances: 28, rating: 7.5 },
    { playerId: 6, name: 'Jamal Bhuyan', position: 'MIDFIELDER', height: 181, weight: 73, foot: 'Right', marketValue: 75000, goals: 1, assists: 1, appearances: 52, rating: 7.2 },
    // Midfielders - Central
    { playerId: 21, name: 'Quazem Shah', position: 'MIDFIELDER', height: 180, weight: 72, foot: 'Right', marketValue: 200000, goals: 4, assists: 5, appearances: 41, rating: 7.7 },
    { playerId: 17, name: 'Sohel Rana', position: 'MIDFIELDER', height: 178, weight: 70, foot: 'Left', marketValue: 175000, goals: 2, assists: 3, appearances: 44, rating: 7.4 },
    { playerId: 23, name: 'Shamit Shome', position: 'MIDFIELDER', height: 181, weight: 72, foot: 'Right', marketValue: 175000, goals: 3, assists: 4, appearances: 39, rating: 7.5 },
    // Midfielders - Attacking/Wingers
    { playerId: 25, name: 'Fahamedul Islam', position: 'MIDFIELDER', height: 175, weight: 64, foot: 'Left', marketValue: 10000, goals: 2, assists: 3, appearances: 15, rating: 7.3 },
    { playerId: 7, name: 'Shekh Morsalin', position: 'MIDFIELDER', height: 177, weight: 66, foot: 'Right', marketValue: 150000, goals: 3, assists: 4, appearances: 32, rating: 7.6 },
    { playerId: 11, name: 'Foysal Ahmed Fahim', position: 'MIDFIELDER', height: 176, weight: 65, foot: 'Left', marketValue: 200000, goals: 5, assists: 6, appearances: 35, rating: 7.7 },
    { playerId: 9, name: 'Shahriar Emon', position: 'MIDFIELDER', height: 178, weight: 67, foot: 'Right', marketValue: 150000, goals: 4, assists: 5, appearances: 33, rating: 7.6 },
    // Forwards
    { playerId: 10, name: 'Mirajul Islam', position: 'FORWARD', height: 182, weight: 74, foot: 'Right', marketValue: 75000, goals: 8, assists: 3, appearances: 28, rating: 7.8 },
    { playerId: 20, name: 'Arman Foysal Akash', position: 'FORWARD', height: 185, weight: 78, foot: 'Right', marketValue: 75000, goals: 6, assists: 2, appearances: 24, rating: 7.5 },
    { playerId: 26, name: 'Sumon Reza', position: 'FORWARD', height: 187, weight: 80, foot: 'Left', marketValue: 50000, goals: 12, assists: 2, appearances: 58, rating: 7.7 },
];

function generateSQL() {
    let sql = '';

    // First, create User accounts for each player
    sql += '-- Create User accounts for players\n';
    playerProfiles.forEach((profile) => {
        const email = profile.name.toLowerCase().replace(/\s+/g, '.') + '@transferx.com';
        sql += `IF NOT EXISTS (SELECT 1 FROM [User] WHERE email = '${email}')\n`;
        sql += `INSERT INTO [User] (email, password, fullName, role, created_at, updated_at) VALUES ('${email}', '$2a$10$dummy', '${profile.name}', 'PLAYER', GETDATE(), GETDATE());\n`;
        sql += `GO\n`;
    });

    // Insert PlayerProfile data
    sql += '\n-- Insert PlayerProfile data\n';
    playerProfiles.forEach(profile => {
        const email = profile.name.toLowerCase().replace(/\s+/g, '.') + '@transferx.com';
        sql += `DECLARE @userId INT; \n`;
        sql += `SELECT @userId = id FROM [User] WHERE email = '${email}';\n`;
        sql += `IF @userId IS NOT NULL\n`;
        sql += `INSERT INTO PlayerProfile (userId, position, nationality, height, weight, preferredFoot, marketValue, goalsScored, assists, appearances, rating, bio) `;
        sql += `VALUES (@userId, '${profile.position}', 'Bangladesh', ${profile.height}, ${profile.weight}, '${profile.foot}', ${profile.marketValue}, ${profile.goals}, ${profile.assists}, ${profile.appearances}, ${profile.rating}, '${profile.name} - Professional footballer playing as ${profile.position}');\n`;
        sql += `GO\n`;
    });

    return sql;
}

const sql = generateSQL();
console.log('✅ Generated SQL statements');
console.log(`   - Creating ${playerProfiles.length} user accounts`);
console.log(`   - Creating ${playerProfiles.length} player profiles`);

// Write to file
fs.writeFileSync('insert-player-profiles.sql', sql, 'utf-8');
console.log('\n✅ SQL written to insert-player-profiles.sql');

// Execute the SQL
const dbServer = '.\\SQLEXPRESS';
const dbName = 'transferx';

async function executeSQL() {
    try {
        console.log('\n🚀 Executing SQL inserts...');
        const { stdout, stderr } = await execAsync(`sqlcmd -S "${dbServer}" -d "${dbName}" -C -i "insert-player-profiles.sql"`, {
            maxBuffer: 1024 * 1024 * 10,
        });

        if (stdout) {
            const lines = stdout.split('\n');
            console.log('✅ SUCCESS - Inserts completed!');
            console.log('   Last 10 lines of output:');
            lines.slice(-10).forEach(line => console.log('   ' + line));
        }

        // Verify the inserts
        console.log('\n📊 Verifying inserted data...');
        const { stdout: profileOut } = await execAsync(
            `sqlcmd -S "${dbServer}" -d "${dbName}" -C -Q "SELECT COUNT(*) as ProfileCount FROM PlayerProfile; SELECT COUNT(*) as PlayerCount FROM [User] WHERE role='PLAYER'"`,
            { maxBuffer: 1024 * 1024 * 10 }
        );
        console.log(profileOut);

        // Show sample data
        console.log('\n📋 Sample PlayerProfile data:');
        const { stdout: sampleOut } = await execAsync(
            `sqlcmd -S "${dbServer}" -d "${dbName}" -C -Q "SELECT TOP 5 id, userId, position, height, weight, marketValue, goalsScored, rating FROM PlayerProfile"`,
            { maxBuffer: 1024 * 1024 * 10 }
        );
        console.log(sampleOut);

    } catch (error) {
        console.error('❌ Error executing SQL:', error.message);
        if (error.stdout) console.log('\nStdout:', error.stdout.substring(0, 1500));
        if (error.stderr) console.log('\nStderr:', error.stderr.substring(0, 1500));
    }
}

executeSQL();
