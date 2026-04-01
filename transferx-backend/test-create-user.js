import { execSync } from 'child_process';
import { writeFileSync, unlinkSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

const SERVER = 'DESKTOP-3HO2U54\\SQLEXPRESS';
const DATABASE = 'transferx';

function executeSqlQuery(sqlQuery) {
    let tempFile = null;
    try {
        tempFile = join(tmpdir(), `query_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.sql`);
        writeFileSync(tempFile, sqlQuery, 'utf-8');

        const result = execSync(
            `sqlcmd -S "${SERVER}" -E -C -d "${DATABASE}" -i "${tempFile}" -s "," -W`,
            {
                encoding: 'utf-8',
                maxBuffer: 50 * 1024 * 1024,
                timeout: 30000
            }
        );

        return result;
    } catch (error) {
        console.error('SQL Execution Error:', error.message);
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

try {
    const uniqueId = Date.now();
    const query = `
INSERT INTO [User] (email, password, fullName, role, created_at, updated_at)
VALUES ('test-${uniqueId}@example.com', 'hashed123', 'Test Debug', 'PLAYER', GETUTCDATE(), GETUTCDATE());
SELECT SCOPE_IDENTITY() as userId;
`;
    
    console.log('Executing query...');
    const output = executeSqlQuery(query);
    console.log('Raw output:');
    console.log(output);
    console.log('---');
    
    const lines = output.trim().split('\n');
    console.log('Lines:');
    lines.forEach((line, index) => {
        console.log(`  ${index}: "${line}"`);
    });
    
    const lastLine = lines[lines.length - 1].trim();
    console.log('Last line:', `"${lastLine}"`);
    const userId = parseInt(lastLine);
    console.log('Parsed userId:', userId);
} catch (error) {
    console.error('Error:', error.message);
}
