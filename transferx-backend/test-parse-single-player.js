const { execSync } = require('child_process');
const { writeFileSync, unlinkSync } = require('fs');
const { tmpdir } = require('os');
const { join } = require('path');

function executeSqlQuery(sqlQuery) {
    let tempFile = null;
    try {
        tempFile = join(tmpdir(), `query_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.sql`);
        writeFileSync(tempFile, sqlQuery, 'utf-8');

        const result = execSync(
            `sqlcmd -S "localhost\\SQLEXPRESS" -E -C -d "transferx" -i "${tempFile}" -s "," -W`,
            {
                encoding: 'utf-8',
                maxBuffer: 50 * 1024 * 1024,
                timeout: 30000
            }
        );
        return result;
    } catch (error) {
        console.error('SQL Query Error:', error.message);
        throw error;
    } finally {
        if (tempFile) {
            try {
                unlinkSync(tempFile);
            } catch (e) {
                // ignore cleanup errors
            }
        }
    }
}

const playerId = 1;
const query = `
  SELECT p.player_id as id, p.first_name, p.last_name, 
         p.date_of_birth, p.position, p.nationality, 
         ISNULL(c.club_id, 0) as club_id, ISNULL(c.name, 'No Club') as club_name,
         p.fee
  FROM [Player] p
  LEFT JOIN [Club] c ON p.current_club_id = c.club_id
  WHERE p.player_id = ${playerId}
`;

console.log('Executing query...');
const result = executeSqlQuery(query);
console.log('Raw result:');
console.log(result);
console.log('');

const lines = result.trim().split('\n');
console.log(`Total lines: ${lines.length}`);

let dataStart = 0;
for (let i = 0; i < lines.length; i++) {
    console.log(`Line ${i}: "${lines[i]}"`);
    if (lines[i].includes('---')) {
        dataStart = i + 1;
        console.log(`Found separator at line ${i}, data starts at ${dataStart}`);
        break;
    }
}

console.log('');
console.log(`Data line (${dataStart}): "${lines[dataStart]}"`);

if (dataStart === 0 || !lines[dataStart] || lines[dataStart].trim() === '') {
    console.log('ERROR: Player not found');
} else {
    const line = lines[dataStart].trim();
    console.log(`Trimmed line: "${line}"`);
    
    const values = line.split(',');
    console.log(`Total values: ${values.length}`);
    values.forEach((v, i) => {
        console.log(`Value ${i}: "${v}"`);
    });

    if (values.length < 9) {
        console.log('ERROR: Not enough values');
    } else {
        const player = {
            id: parseInt(values[0]),
            first_name: values[1]?.trim(),
            last_name: values[2]?.trim(),
            date_of_birth: values[3]?.trim(),
            position: values[4]?.trim(),
            nationality: values[5]?.trim(),
            club_id: parseInt(values[6]),
            club_name: values[7]?.trim(),
            fee: values[8]?.trim(),
        };
        
        console.log('');
        console.log('Parsed player:');
        console.log(player);
    }
}
