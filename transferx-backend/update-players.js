const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

// Player data from the provided list
const playersData = [
    { id: 13, name: 'Mitul Marma', position: 'Goalkeeper', age: 22, club: 'Abahani Limited', marketValue: '200k' },
    { id: 12, name: 'Sujon Hossain', position: 'Goalkeeper', age: 29, club: 'Mohammedan Sporting Club', marketValue: '175k' },
    { id: 1, name: 'Mehedi Hasan Srabon', position: 'Goalkeeper', age: 20, club: 'Bashundhara Kings', marketValue: '50k' },
    { id: 14, name: 'Tariq Kazi', position: 'Centre-Back', age: 25, club: 'Without Club', marketValue: '125k' },
    { id: 2, name: 'Shakil Ahad Topu', position: 'Centre-Back', age: 20, club: 'Mohammedan Sporting Club', marketValue: '100k' },
    { id: 22, name: 'Saad Uddin', position: 'Left-Back', age: 27, club: 'Bashundhara Kings', marketValue: '150k' },
    { id: 24, name: 'Abdullah Omar', position: 'Left-Back', age: 31, club: 'Fortuna Dhaka', marketValue: '100k' },
    { id: 19, name: 'Zayyan Ahmed', position: 'Left-Back', age: 22, club: 'Royal Bengal FC', marketValue: '50k' },
    { id: 3, name: 'Rahmat Mia', position: 'Right-Back', age: 26, club: 'Mohammedan Sporting Club', marketValue: '175k' },
    { id: 12, name: 'Bishwanath Ghosh', position: 'Right-Back', age: 26, club: 'Bashundhara Kings', marketValue: '50k' },
    { id: 8, name: 'Hamza Choudhury', position: 'Defensive Midfield', age: 28, club: 'Bashundhara Kings', marketValue: '5m' },
    { id: 5, name: 'Mohammad Ridoy', position: 'Defensive Midfield', age: 24, club: 'Bashundhara Kings', marketValue: '250k' },
    { id: 6, name: 'Jamal Bhuyan', position: 'Defensive Midfield', age: 35, club: 'Brothers Union', marketValue: '75k' },
    { id: 21, name: 'Quazem Shah', position: 'Central Midfield', age: 27, club: 'Abahani Limited', marketValue: '200k' },
    { id: 17, name: 'Sohel Rana', position: 'Central Midfield', age: 31, club: 'Bashundhara Kings', marketValue: '175k' },
    { id: 23, name: 'Shamit Shome', position: 'Central Midfield', age: 28, club: 'Without Club', marketValue: '175k' },
    { id: 25, name: 'Fahamedul Islam', position: 'Left Midfield', age: 19, club: 'Sajeeb Wazed Joy SC', marketValue: '10k' },
    { id: 7, name: 'Shekh Morsalin', position: 'Attacking Midfield', age: 20, club: 'Abahani Limited', marketValue: '150k' },
    { id: 11, name: 'Foysal Ahmed Fahim', position: 'Left Winger', age: 24, club: 'Bashundhara Kings', marketValue: '200k' },
    { id: 9, name: 'Shahriar Emon', position: 'Right Winger', age: 25, club: 'Bashundhara Kings', marketValue: '150k' },
    { id: 10, name: 'Mirajul Islam', position: 'Second Striker', age: 19, club: 'Abahani Limited', marketValue: '75k' },
    { id: 20, name: 'Arman Foysal Akash', position: 'Centre-Forward', age: 22, club: 'Bangladesh Police FC', marketValue: '75k' },
    { id: 26, name: 'Sumon Reza', position: 'Centre-Forward', age: 30, club: 'Mohammedan Sporting Club', marketValue: '50k' },
];

// Club mapping
const clubMapping = {
    'Abahani Limited': 2,
    'Mohammedan Sporting Club': 3,
    'Bashundhara Kings': 11,
    'Brothers Union': 12,
    'Fortuna Dhaka': 7,
    'Royal Bengal FC': 10,
    'Sajeeb Wazed Joy SC': 9,
    'Bangladesh Police FC': 6,
    'Without Club': null,
};

// Parse market value to decimal number
function parseMarketValue(valueStr) {
    const value = valueStr.toLowerCase();
    if (value.includes('m')) {
        return parseFloat(value.replace('m', '')) * 1000000;
    } else if (value.includes('k')) {
        return parseFloat(value.replace('k', '')) * 1000;
    }
    return parseFloat(value);
}

// Calculate date of birth from age
function calculateDOB(age) {
    const today = new Date();
    const year = today.getFullYear() - age;
    // Use January 1st of the calculated year for simplicity
    return new Date(year, 0, 1);
}

// Generate SQL UPDATE statements
function generateSQL() {
    let sql = '';

    playersData.forEach(player => {
        const [firstName, ...lastNameParts] = player.name.split(' ');
        const lastName = lastNameParts.join(' ') || 'Player';
        const dob = calculateDOB(player.age);
        const dobStr = dob.toISOString().split('T')[0]; // YYYY-MM-DD format
        const marketValue = parseMarketValue(player.marketValue);
        const clubId = clubMapping[player.club];
        const clubIdStr = clubId !== null ? clubId : 'NULL';

        sql += `UPDATE Player SET first_name = '${firstName.replace(/'/g, "''")}', last_name = '${lastName.replace(/'/g, "''")}', date_of_birth = '${dobStr}', position = '${player.position.replace(/'/g, "''")}', current_club_id = ${clubIdStr}, fee = ${marketValue} WHERE player_id = ${player.id};\n`;
    });

    return sql;
}

const sql = generateSQL();
console.log('Generated SQL statements:');
console.log(sql);

// Write to file
const fs = require('fs');
fs.writeFileSync('update-players.sql', sql, 'utf-8');
console.log('\n✅ SQL statements written to update-players.sql');

// Execute the SQL
const dbServer = '.\\SQLEXPRESS';
const dbName = 'transferx';

async function executeSQL() {
    try {
        console.log('\n🚀 Executing SQL updates...');
        const { stdout, stderr } = await execAsync(`sqlcmd -S "${dbServer}" -d "${dbName}" -C -i "update-players.sql"`, {
            maxBuffer: 1024 * 1024 * 10,
        });

        if (stdout) console.log('✅ Output:', stdout);
        if (stderr) console.log('⚠️  Warnings:', stderr);
        console.log('\n✅ Players updated successfully!');
    } catch (error) {
        console.error('❌ Error executing SQL:', error.message);
        if (error.stdout) console.log('Stdout:', error.stdout);
        if (error.stderr) console.log('Stderr:', error.stderr);
    }
}

executeSQL();
