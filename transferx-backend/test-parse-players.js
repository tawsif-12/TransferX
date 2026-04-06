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

function parsePlayerOutput(output) {
    try {
        console.log('📊 Raw output:');
        console.log(output);
        console.log('');

        const lines = output.trim().split('\n');
        console.log(`Total lines: ${lines.length}`);
        
        const players = [];
        
        let dataStart = 0;
        for (let i = 0; i < lines.length; i++) {
            console.log(`Line ${i}: "${lines[i]}"`);
            if (lines[i].includes('---')) {
                dataStart = i + 1;
                console.log(`Found separator at line ${i}, data starts at ${dataStart}`);
                break;
            }
        }

        for (let i = dataStart; i < lines.length; i++) {
            const line = lines[i].trim();
            console.log(`Processing line ${i}: "${line}"`);
            
            if (!line || line.startsWith('(') || line.includes('rows affected')) {
                console.log(`  -> Skipping (empty or meta)`);
                continue;
            }
            
            const values = line.split(',');
            console.log(`  -> Split into ${values.length} values`);
            
            if (values.length >= 8) {
                const player = {
                    id: parseInt(values[0]) || 0,
                    first_name: values[1]?.trim() || '',
                    last_name: values[2]?.trim() || '',
                    date_of_birth: values[3]?.trim() || '',
                    position: values[4]?.trim() || '',
                    nationality: values[5]?.trim() || '',
                    club_id: parseInt(values[6]) || 0,
                    club_name: values[7]?.trim() || 'N/A',
                };
                console.log(`  -> Parsed player: ${player.first_name} ${player.last_name}`);
                players.push(player);
            } else {
                console.log(`  -> Not enough values (${values.length} < 8)`);
            }
        }
        
        console.log('');
        console.log(`✅ Parsed ${players.length} players`);
        return players;
    } catch (error) {
        console.error('Parse error:', error);
        return [];
    }
}

const query = `
SELECT TOP 5 p.player_id as id, p.first_name, p.last_name, 
       p.date_of_birth, p.position, p.nationality, 
       ISNULL(c.club_id, 0) as club_id, ISNULL(c.name, 'No Club') as club_name
FROM [Player] p
LEFT JOIN [Club] c ON p.current_club_id = c.club_id
ORDER BY p.last_name, p.first_name
`;

console.log('🔍 Testing parsePlayerOutput function...\n');
const output = executeSqlQuery(query);
const players = parsePlayerOutput(output);
console.log('\nFinal result:', JSON.stringify(players, null, 2));
