import { execSync } from 'child_process';
import { writeFileSync, unlinkSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { SERVER, DATABASE } from './dbConfig.js';

/**
 * Execute SQL query using sqlcmd
 */
function executeSqlQuery(sqlQuery) {
    let tempFile = null;
    try {
        tempFile = join(tmpdir(), `query_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.sql`);
        writeFileSync(tempFile, sqlQuery, 'utf-8');

        const sqlcmdCommand = `sqlcmd -S "${SERVER}" -E -C -d "${DATABASE}" -i "${tempFile}" -s "," -W`;
        console.log('[authDB.js] Executing sqlcmd with SERVER:', SERVER, 'DATABASE:', DATABASE);
        console.log('[authDB.js] Full command:', sqlcmdCommand);

        const result = execSync(
            sqlcmdCommand,
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

/**
 * Parse sqlcmd CSV output into objects
 */
function parseSqlOutput(output, columnNames) {
    const lines = output.trim().split('\n');
    const rows = [];

    let dataStartIndex = 0;
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('---') || lines[i].includes('-,-')) {
            dataStartIndex = i + 1;
            break;
        }
    }

    for (let i = dataStartIndex; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line && !line.includes('row')) {
            const values = [];
            let current = '';
            let inQuotes = false;

            for (let j = 0; j < line.length; j++) {
                const char = line[j];
                if (char === '"') {
                    inQuotes = !inQuotes;
                } else if (char === ',' && !inQuotes) {
                    values.push(current.trim());
                    current = '';
                } else {
                    current += char;
                }
            }
            values.push(current.trim());

            if (values.length === columnNames.length && values[0]) {
                const row = {};
                columnNames.forEach((col, idx) => {
                    const val = values[idx] || '';
                    row[col] = val === '' || val === 'NULL' ? null : val;
                });
                rows.push(row);
            }
        }
    }
    return rows;
}

/**
 * Create a new user with profile
 */
export async function createUser(email, hashedPassword, fullName, role = 'PLAYER') {
    try {
        const escapedEmail = email.replace(/'/g, "''");
        const escapedName = fullName.replace(/'/g, "''");

        const query = `
INSERT INTO [User] (email, password, fullName, role, created_at, updated_at)
VALUES ('${escapedEmail}', '${hashedPassword}', '${escapedName}', '${role}', GETUTCDATE(), GETUTCDATE());
SELECT SCOPE_IDENTITY() as userId;
`;

        const output = executeSqlQuery(query);

        // Parse the SCOPE_IDENTITY result
        const lines = output.trim().split('\n');
        let userId = null;

        // Find the line with just the number (userId value)
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            // Skip empty lines, lines with column headers, dashes, and status messages
            if (line && !line.includes('---') && !line.includes('rows affected') && !line.includes('userId') && !line.includes('-')) {
                const parsed = parseInt(line);
                if (!isNaN(parsed) && parsed > 0) {
                    userId = parsed;
                    break;
                }
            }
        }

        if (!userId) {
            console.error('Failed to parse userId from output:', output);
            return { success: false, error: 'Failed to create user' };
        }

        console.log('User created with ID:', userId);

        // Create profile based on role
        if (role === 'PLAYER') {
            const profileQuery = `
INSERT INTO PlayerProfile (userId, position, nationality, marketValue, goalsScored, assists, appearances, rating)
VALUES (${userId}, 'FORWARD', '', 0, 0, 0, 0, 0);
`;
            executeSqlQuery(profileQuery);
        } else if (role === 'AGENT') {
            const profileQuery = `
INSERT INTO AgentProfile (userId, agency, licenseNumber, yearsExperience)
VALUES (${userId}, '', 'LIC-${Date.now()}', 0);
`;
            executeSqlQuery(profileQuery);
        }

        return { success: true, userId };
    } catch (error) {
        console.error('Error creating user:', error);
        if (error.message.includes('violation')) {
            return { success: false, error: 'Email already registered' };
        }
        return { success: false, error: error.message };
    }
}

/**
 * Find user by email using sqlcmd
 */
export async function findUserByEmail(email) {
    try {
        console.log('Finding user by email:', email);

        const escapedEmail = email.replace(/'/g, "''");
        const query = `
SET NOCOUNT ON;
SELECT 
    CAST(id as VARCHAR(10)) as id,
    email,
    password,
    fullName,
    role,
    CONVERT(VARCHAR(30), created_at, 121) as created_at,
    CONVERT(VARCHAR(30), updated_at, 121) as updated_at
FROM [User] 
WHERE email = '${escapedEmail}'
`;

        const output = executeSqlQuery(query);
        const columns = ['id', 'email', 'password', 'fullName', 'role', 'created_at', 'updated_at'];
        const rows = parseSqlOutput(output, columns);

        if (rows.length === 0) {
            console.log('User not found');
            return { success: true, user: null };
        }

        const user = rows[0];
        console.log('User found:', user.email);

        return {
            success: true,
            user: {
                id: parseInt(user.id),
                email: user.email,
                password: user.password,
                fullName: user.fullName,
                role: user.role,
                created_at: new Date(user.created_at),
                updated_at: new Date(user.updated_at),
            }
        };
    } catch (error) {
        console.error('Error finding user:', error.message);
        return { success: false, error: error.message };
    }
}

/**
 * Get user with profile details using sqlcmd
 */
export async function getUserWithProfile(userId) {
    try {
        console.log('Getting user with profile for ID:', userId);

        const query = `
SET NOCOUNT ON;
SELECT 
    CAST(u.id as VARCHAR(10)) as id,
    u.email,
    u.password,
    u.fullName,
    u.role,
    CONVERT(VARCHAR(30), u.created_at, 121) as created_at,
    CONVERT(VARCHAR(30), u.updated_at, 121) as updated_at,
    ISNULL(CAST(pp.id as VARCHAR(10)), '-1') as playerProfileId,
    ISNULL(pp.position, '') as position,
    ISNULL(pp.nationality, '') as nationality,
    ISNULL(CAST(pp.marketValue as VARCHAR(20)), '0') as marketValue,
    ISNULL(CAST(pp.rating as VARCHAR(10)), '0') as rating,
    ISNULL(pp.bio, '') as bio,
    ISNULL(CAST(ap.id as VARCHAR(10)), '-1') as agentProfileId,
    ISNULL(ap.agency, '') as agency
FROM [User] u
LEFT JOIN PlayerProfile pp ON u.id = pp.userId
LEFT JOIN AgentProfile ap ON u.id = ap.userId
WHERE u.id = ${userId}
`;

        const output = executeSqlQuery(query);
        const columns = ['id', 'email', 'password', 'fullName', 'role', 'created_at', 'updated_at', 'playerProfileId', 'position', 'nationality', 'marketValue', 'rating', 'bio', 'agentProfileId', 'agency'];
        const rows = parseSqlOutput(output, columns);

        if (rows.length === 0) {
            console.log('User with profile not found');
            return { success: true, user: null };
        }

        const row = rows[0];
        return {
            success: true,
            user: {
                id: parseInt(row.id),
                email: row.email,
                password: row.password,
                fullName: row.fullName,
                role: row.role,
                created_at: new Date(row.created_at),
                updated_at: new Date(row.updated_at),
                playerProfile: parseInt(row.playerProfileId) !== -1 ? {
                    id: parseInt(row.playerProfileId),
                    position: row.position,
                    nationality: row.nationality,
                    marketValue: parseFloat(row.marketValue || '0'),
                    rating: parseFloat(row.rating || '0'),
                    bio: row.bio,
                } : null,
                agentProfile: parseInt(row.agentProfileId) !== -1 ? {
                    id: parseInt(row.agentProfileId),
                    agency: row.agency,
                } : null,
            }
        };
    } catch (error) {
        console.error('Error getting user with profile:', error.message);
        return { success: false, error: error.message };
    }
}

/**
 * Check if email exists
 */
export async function emailExists(email) {
    try {
        console.log('Checking if email exists:', email);
        const result = await findUserByEmail(email);
        return result.success && result.user !== null;
    } catch (error) {
        console.error('Error checking email existence:', error);
        return false;
    }
}
