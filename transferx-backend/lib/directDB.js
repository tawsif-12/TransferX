/**
 * Database connection using Direct SQL Execution
 * Fallback when Prisma/tedious TCP/IP fails
 */

import { execSync, spawn } from 'child_process';
import { writeFileSync, unlinkSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

const SERVER = 'DESKTOP-3HO2U54\\SQLEXPRESS';
const DATABASE = 'transferx';

/**
 * Execute SQL query using sqlcmd (Windows integrated auth)
 */
export function executeSql(sqlQuery) {
    let tempFile = null;
    try {
        tempFile = join(tmpdir(), `query_${Date.now()}.sql`);
        writeFileSync(tempFile, sqlQuery, 'utf-8');

        const result = execSync(
            `sqlcmd -S "${SERVER}" -E -C -d "${DATABASE}" -i "${tempFile}" -s "|"`,
            {
                encoding: 'utf-8',
                maxBuffer: 50 * 1024 * 1024,
                timeout: 30000
            }
        );

        return { success: true, data: result };
    } catch (error) {
        console.error('SQL Execution Error:', error.message);
        return { success: false, error: error.message };
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

/**
 * Get user by email and password
 */
export function queryUserByEmail(email) {
    const sql = `SELECT id, email, password, fullName, role, created_at, updated_at FROM [User] WHERE email = '${email.replace(/'/g, "''")}'`;
    return executeSql(sql);
}

/**
 * Get full user profile by ID
 */
export function queryUserProfile(userId) {
    const sql = `
        SELECT u.id, u.email, u.password, u.fullName, u.role, u.created_at, u.updated_at,
               pp.id as playerProfileId, pp.position, pp.nationality, pp.marketValue,
               ap.id as agentProfileId, ap.agency
        FROM [User] u
        LEFT JOIN PlayerProfile pp ON u.id = pp.userId
        LEFT JOIN AgentProfile ap ON u.id = ap.userId
        WHERE u.id = ${userId}
    `;
    return executeSql(sql);
}

export default { executeSql, queryUserByEmail, queryUserProfile };
