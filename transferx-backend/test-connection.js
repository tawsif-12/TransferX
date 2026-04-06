#!/usr/bin/env node
import { SERVER, DATABASE } from './lib/dbConfig.js';
import { execSync } from 'child_process';
import { writeFileSync, unlinkSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

console.log('Testing database connection...');
console.log('SERVER:', SERVER);
console.log('DATABASE:', DATABASE);

// Test sqlcmd connection
let tempFile = null;
try {
    const testQuery = 'SELECT SYSDATETIME() as CurrentTime';
    tempFile = join(tmpdir(), `test_${Date.now()}.sql`);
    writeFileSync(tempFile, testQuery, 'utf-8');

    const result = execSync(
        `sqlcmd -S "${SERVER}" -E -C -d "${DATABASE}" -i "${tempFile}"`,
        { encoding: 'utf-8' }
    );

    console.log('✅ Database connection successful!');
    console.log('Query result:', result.split('\n')[0]);
} catch (error) {
    console.error('❌ Database connection failed:', error.message);
} finally {
    if (tempFile) {
        try {
            unlinkSync(tempFile);
        } catch (e) {
            // ignore
        }
    }
}
