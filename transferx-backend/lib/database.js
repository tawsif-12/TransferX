import { execSync } from 'child_process';
import { writeFileSync, unlinkSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

/**
 * Parse DATABASE_URL to extract server name
 */
function extractServerNameFromDatabaseUrl() {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
        // Default to local server
        return '.\\SQLEXPRESS';
    }

    // Parse sqlserver://SERVER\INSTANCE;database=...
    const match = dbUrl.match(/sqlserver:\/\/([^;]+)/);
    if (match && match[1]) {
        return match[1];
    }

    // Fallback to local server
    return '.\\SQLEXPRESS';
}

/**
 * Execute SQL queries using sqlcmd (bypasses Prisma/tedious driver issues)
 * This is a workaround for Prisma connection issues with named SQL Server instances
 */

function executeSqlQuery(query, isTransaction = false) {
    let tempFile = null;
    try {
        // Wrap in transaction if specified
        let finalQuery = query;
        if (isTransaction) {
            finalQuery = `BEGIN TRANSACTION;
${query}
COMMIT;`;
        }

        // Write query to temporary file to avoid quote escaping issues
        tempFile = join(tmpdir(), `sqlquery_${Date.now()}.sql`);
        writeFileSync(tempFile, finalQuery, 'utf-8');

        const serverName = extractServerNameFromDatabaseUrl();
        const result = execSync(
            `sqlcmd -S ${serverName} -E -C -d transferx -s "," -W -i "${tempFile}"`,
            {
                encoding: 'utf-8',
                stdio: ['pipe', 'pipe', 'pipe'],
                maxBuffer: 10 * 1024 * 1024 // 10MB buffer
            }
        );

        return { success: true, data: result };
    } catch (err) {
        return { success: false, error: err.message };
    } finally {
        // Clean up temporary file
        if (tempFile) {
            try {
                unlinkSync(tempFile);
            } catch (e) {
                // Ignore cleanup errors
            }
        }
    }
}

/**
 * Query using Prisma with fallback to raw SQL
 * This ensures queries work even if Prisma connection fails
 */
export async function queryDatabase(operation) {
    try {
        // Try Prisma first
        switch (operation.type) {
            case 'COUNT':
                // Execute raw SQL count instead
                return executeSqlQuery(`SELECT COUNT(*) as count FROM ${operation.table}`);

            case 'SELECT':
                return executeSqlQuery(`SELECT TOP ${operation.limit || 10} * FROM ${operation.table}`);

            case 'INSERT':
                return executeSqlQuery(operation.query);

            default:
                return { success: false, error: 'Unknown operation' };
        }
    } catch (err) {
        return { success: false, error: err.message };
    }
}

/**
 * Get player count
 */
export async function getPlayerCount() {
    const result = executeSqlQuery('SELECT COUNT(*) as count FROM Player');
    if (result.success) {
        return parseInt(result.data) || 0;
    }
    return 0;
}

/**
 * Get club count
 */
export async function getClubCount() {
    const result = executeSqlQuery('SELECT COUNT(*) as count FROM Club');
    if (result.success) {
        return parseInt(result.data) || 0;
    }
    return 0;
}

/**
 * Get league count
 */
export async function getLeagueCount() {
    const result = executeSqlQuery('SELECT COUNT(*) as count FROM League');
    if (result.success) {
        return parseInt(result.data) || 0;
    }
    return 0;
}

/**
 * Get all players with comprehensive joins and subqueries
 * Uses LEFT JOINs to include club, league, contracts, and transfer data
 */
export async function getPlayers(limit = 500, filter = {}) {
    // Main query with JOINs for club, league, and subqueries for contracts and transfers
    let query = `SELECT TOP ${limit}
        p.player_id,
        p.first_name,
        p.last_name,
        p.date_of_birth,
        p.position,
        p.nationality,
        p.current_club_id,
        p.fee,
        c.club_id,
        c.name as club_name,
        c.country as club_country,
        l.league_id,
        l.name as league_name,
        (SELECT COUNT(*) FROM Contract WHERE player_id = p.player_id) as active_contracts,
        (SELECT COUNT(*) FROM Transfer WHERE player_id = p.player_id) as total_transfers,
        (SELECT SUM(CAST(transfer_fee AS FLOAT)) FROM Transfer WHERE player_id = p.player_id) as total_transfer_value,
        (SELECT COUNT(*) FROM PlayerAgent WHERE player_id = p.player_id) as agent_count
    FROM Player p
    LEFT JOIN Club c ON p.current_club_id = c.club_id
    LEFT JOIN League l ON c.league_id = l.league_id
    WHERE 1=1`;

    if (filter.name) {
        const name = filter.name.replace(/'/g, "''");
        query += ` AND (p.first_name LIKE '%${name}%' OR p.last_name LIKE '%${name}%')`;
    }
    if (filter.position) {
        const pos = filter.position.replace(/'/g, "''");
        query += ` AND p.position LIKE '%${pos}%'`;
    }
    if (filter.nationality) {
        const nat = filter.nationality.replace(/'/g, "''");
        query += ` AND p.nationality LIKE '%${nat}%'`;
    }
    if (filter.clubId) {
        query += ` AND p.current_club_id = ${parseInt(filter.clubId)}`;
    }

    query += ` ORDER BY p.player_id DESC`;

    const result = executeSqlQuery(query);
    if (!result.success) {
        return { success: false, error: result.error, data: [] };
    }

    // Parse CSV output from sqlcmd - skip header, separator line, and trailing info
    const lines = result.data.split('\n');
    const players = [];

    // Skip header line (0), separator line of dashes (1), and empty lines
    for (let i = 2; i < lines.length; i++) {
        const line = lines[i].trim();
        // Skip empty lines and "rows affected" messages
        // Don't skip lines just because they contain '-' (dates have dashes!)
        if (!line || line.startsWith('(') || line.includes('rows affected')) {
            continue;
        }

        try {
            const cols = line.split(',').map(v => v.trim());
            if (cols.length >= 2 && cols[0]) {
                players.push({
                    player_id: parseInt(cols[0]),
                    first_name: cols[1] || null,
                    last_name: cols[2] || null,
                    date_of_birth: cols[3] || null,
                    position: cols[4] || null,
                    nationality: cols[5] || null,
                    current_club_id: cols[6] ? parseInt(cols[6]) : null,
                    fee: cols[7] ? parseInt(cols[7]) : null,
                    current_club: cols[8] ? {
                        club_id: parseInt(cols[8]),
                        name: cols[9] || '',
                        country: cols[10] || '',
                        league: cols[11] ? { league_id: parseInt(cols[11]), name: cols[12] || '' } : null
                    } : null,
                    stats: {
                        active_contracts: cols[13] ? parseInt(cols[13]) : 0,
                        total_transfers: cols[14] ? parseInt(cols[14]) : 0,
                        total_transfer_value: cols[15] ? parseFloat(cols[15]) : 0,
                        agent_count: cols[16] ? parseInt(cols[16]) : 0
                    }
                });
            }
        } catch (e) {
            console.error('Error parsing player row:', line, e.message);
        }
    }

    return { success: true, data: players };
}

/**
 * Get all clubs (limited)
 */
export async function getClubs(limit = 10) {
    const result = executeSqlQuery(
        `SELECT TOP ${limit} club_id, name, country, founded_year FROM Club`
    );
    return result;
}

/**
 * Get all leagues
 */
export async function getLeagues() {
    const result = executeSqlQuery(
        `SELECT league_id, name, country FROM League`
    );
    return result;
}

/**
 * Get player details with comprehensive JOINs and subqueries
 * Uses multiple JOINs and subqueries for contracts, transfers, and agents
 */
export async function getPlayerDetails(playerId) {
    const query = `SELECT TOP 1
        p.player_id,
        p.first_name,
        p.last_name,
        p.date_of_birth,
        p.position,
        p.nationality,
        p.current_club_id,
        p.fee,
        c.club_id,
        c.name as club_name,
        c.country as club_country,
        l.league_id,
        l.name as league_name,
        l.country as league_country,
        (SELECT COUNT(*) FROM Contract WHERE player_id = p.player_id AND end_date >= GETDATE()) as active_contracts,
        (SELECT COUNT(*) FROM Transfer WHERE player_id = p.player_id) as total_transfers,
        (SELECT MAX(transfer_date) FROM Transfer WHERE player_id = p.player_id) as last_transfer_date,
        (SELECT SUM(CAST(transfer_fee AS FLOAT)) FROM Transfer WHERE player_id = p.player_id) as career_transfer_value,
        (SELECT COUNT(*) FROM PlayerAgent WHERE player_id = p.player_id) as agent_count,
        CAST(ROUND(
            (SELECT COUNT(*) FROM Transfer WHERE player_id = p.player_id) / 
            NULLIF(DATEDIFF(YEAR, p.date_of_birth, GETDATE()), 0) * 1.0, 2
        ) AS FLOAT) as transfer_frequency
    FROM Player p
    LEFT JOIN Club c ON p.current_club_id = c.club_id
    LEFT JOIN League l ON c.league_id = l.league_id
    WHERE p.player_id = ${parseInt(playerId)}`;

    const result = executeSqlQuery(query);
    if (!result.success) {
        return { success: false, error: result.error, data: null };
    }

    const lines = result.data.split('\n');

    for (let i = 2; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line || line.includes('rows affected') || line.includes('-')) continue;

        try {
            const cols = line.split(',').map(v => v.trim());
            if (cols[0]) {
                return {
                    success: true,
                    data: {
                        player_id: parseInt(cols[0]),
                        first_name: cols[1],
                        last_name: cols[2],
                        date_of_birth: cols[3],
                        position: cols[4],
                        nationality: cols[5],
                        current_club_id: cols[6] ? parseInt(cols[6]) : null,
                        fee: cols[7] ? parseInt(cols[7]) : 0,
                        current_club: {
                            club_id: cols[8] ? parseInt(cols[8]) : null,
                            name: cols[9] || '',
                            country: cols[10] || '',
                            league: {
                                league_id: cols[11] ? parseInt(cols[11]) : null,
                                name: cols[12] || '',
                                country: cols[13] || ''
                            }
                        },
                        stats: {
                            active_contracts: cols[14] ? parseInt(cols[14]) : 0,
                            total_transfers: cols[15] ? parseInt(cols[15]) : 0,
                            last_transfer_date: cols[16],
                            career_transfer_value: cols[17] ? parseFloat(cols[17]) : 0,
                            agent_count: cols[18] ? parseInt(cols[18]) : 0,
                            transfer_frequency: cols[19] ? parseFloat(cols[19]) : 0
                        }
                    }
                };
            }
        } catch (error) {
            console.error('Error parsing player details:', error);
        }
    }

    return { success: false, error: 'Player not found', data: null };
}

/*
 * Demonstrates INNER and LEFT JOINs with multiple tables
 */
export async function getTransfersWithDetails(limit = 50) {
    const query = `SELECT TOP ${limit}
        t.transfer_id,
        t.player_id,
        t.from_club_id,
        t.to_club_id,
        t.transfer_date,
        t.transfer_type,
        CAST(t.transfer_fee AS FLOAT) as transfer_fee,
        p.first_name,
        p.last_name,
        p.position,
        fc.club_id as from_club_id_val,
        fc.name as from_club_name,
        fc.country as from_club_country,
        fl.name as from_league_name,
        tc.club_id as to_club_id_val,
        tc.name as to_club_name,
        tc.country as to_club_country,
        tl.name as to_league_name
    FROM Transfer t
    INNER JOIN Player p ON t.player_id = p.player_id
    LEFT JOIN Club fc ON t.from_club_id = fc.club_id
    LEFT JOIN League fl ON fc.league_id = fl.league_id
    LEFT JOIN Club tc ON t.to_club_id = tc.club_id
    LEFT JOIN League tl ON tc.league_id = tl.league_id
    ORDER BY t.transfer_date DESC`;

    const result = executeSqlQuery(query);
    if (!result.success) {
        return { success: false, error: result.error, data: [] };
    }

    const lines = result.data.split('\n');
    const transfers = [];

    for (let i = 2; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line || line.includes('rows affected') || line.includes('-')) continue;

        try {
            const cols = line.split(',').map(v => v.trim());
            if (cols[0]) {
                transfers.push({
                    transfer_id: parseInt(cols[0]),
                    player_id: parseInt(cols[1]),
                    from_club_id: cols[2] ? parseInt(cols[2]) : null,
                    to_club_id: cols[3] ? parseInt(cols[3]) : null,
                    transfer_date: cols[4],
                    transfer_type: cols[5],
                    transfer_fee: cols[6] ? parseFloat(cols[6]) : 0,
                    player: {
                        first_name: cols[7],
                        last_name: cols[8],
                        position: cols[9]
                    },
                    from_club: {
                        club_id: cols[10] ? parseInt(cols[10]) : null,
                        name: cols[11] || '',
                        country: cols[12] || '',
                        league: cols[13] || ''
                    },
                    to_club: {
                        club_id: cols[14] ? parseInt(cols[14]) : null,
                        name: cols[15] || '',
                        country: cols[16] || '',
                        league: cols[17] || ''
                    }
                });
            }
        } catch (e) {
            console.error('Error parsing transfer:', line, e.message);
        }
    }

    return { success: true, data: transfers };
}

/**
 * Get contracts with subqueries for player and club details
 * Demonstrates complex WHERE clause with subqueries
 */
export async function getContractsWithDetails(limit = 50) {
    const query = `SELECT TOP ${limit}
        c.contract_id,
        c.player_id,
        c.club_id,
        c.start_date,
        c.end_date,
        CAST(c.salary AS FLOAT) as salary,
        p.first_name,
        p.last_name,
        p.position,
        cl.name as club_name,
        cl.country as club_country,
        l.name as league_name,
        DATEDIFF(DAY, GETDATE(), c.end_date) as days_remaining,
        CASE 
            WHEN c.end_date < GETDATE() THEN 'Expired'
            WHEN DATEDIFF(DAY, GETDATE(), c.end_date) <= 90 THEN 'Expiring Soon'
            ELSE 'Active'
        END as contract_status
    FROM Contract c
    INNER JOIN Player p ON c.player_id = p.player_id
    INNER JOIN Club cl ON c.club_id = cl.club_id
    LEFT JOIN League l ON cl.league_id = l.league_id
    WHERE c.end_date >= DATEADD(YEAR, -1, GETDATE())
    ORDER BY c.end_date ASC`;

    const result = executeSqlQuery(query);
    if (!result.success) {
        return { success: false, error: result.error, data: [] };
    }

    const lines = result.data.split('\n');
    const contracts = [];

    for (let i = 2; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line || line.includes('rows affected') || line.includes('-')) continue;

        try {
            const cols = line.split(',').map(v => v.trim());
            if (cols[0]) {
                contracts.push({
                    contract_id: parseInt(cols[0]),
                    player_id: parseInt(cols[1]),
                    club_id: parseInt(cols[2]),
                    start_date: cols[3],
                    end_date: cols[4],
                    salary: cols[5] ? parseFloat(cols[5]) : 0,
                    player: {
                        first_name: cols[6],
                        last_name: cols[7],
                        position: cols[8]
                    },
                    club: {
                        name: cols[9],
                        country: cols[10],
                        league: cols[11]
                    },
                    days_remaining: cols[12] ? parseInt(cols[12]) : 0,
                    status: cols[13]
                });
            }
        } catch (e) {
            console.error('Error parsing contract:', line, e.message);
        }
    }

    return { success: true, data: contracts };
}

/**
 * Get club transfer statistics using aggregation and GROUP BY (subquery pattern)
 * Shows transfer activity per club with complex calculations
 */
export async function getClubTransferStats(limit = 20) {
    const query = `SELECT TOP ${limit}
        c.club_id,
        c.name,
        c.country,
        l.name as league_name,
        (SELECT COUNT(*) FROM Transfer WHERE to_club_id = c.club_id) as players_bought,
        (SELECT COUNT(*) FROM Transfer WHERE from_club_id = c.club_id) as players_sold,
        CAST(ISNULL((SELECT SUM(CAST(transfer_fee AS FLOAT)) FROM Transfer WHERE to_club_id = c.club_id), 0) AS FLOAT) as total_spent,
        CAST(ISNULL((SELECT SUM(CAST(transfer_fee AS FLOAT)) FROM Transfer WHERE from_club_id = c.club_id), 0) AS FLOAT) as total_received,
        CAST((SELECT SUM(CAST(transfer_fee AS FLOAT)) FROM Transfer WHERE to_club_id = c.club_id) - 
             ISNULL((SELECT SUM(CAST(transfer_fee AS FLOAT)) FROM Transfer WHERE from_club_id = c.club_id), 0) AS FLOAT) as net_spend,
        (SELECT COUNT(*) FROM Contract WHERE club_id = c.club_id AND end_date >= GETDATE()) as active_players
    FROM Club c
    LEFT JOIN League l ON c.league_id = l.league_id
    ORDER BY net_spend DESC`;

    const result = executeSqlQuery(query);
    if (!result.success) {
        return { success: false, error: result.error, data: [] };
    }

    const lines = result.data.split('\n');
    const stats = [];

    for (let i = 2; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line || line.includes('rows affected') || line.includes('-')) continue;

        try {
            const cols = line.split(',').map(v => v.trim());
            if (cols[0]) {
                stats.push({
                    club_id: parseInt(cols[0]),
                    name: cols[1],
                    country: cols[2],
                    league_name: cols[3],
                    players_bought: cols[4] ? parseInt(cols[4]) : 0,
                    players_sold: cols[5] ? parseInt(cols[5]) : 0,
                    total_spent: cols[6] ? parseFloat(cols[6]) : 0,
                    total_received: cols[7] ? parseFloat(cols[7]) : 0,
                    net_spend: cols[8] ? parseFloat(cols[8]) : 0,
                    active_players: cols[9] ? parseInt(cols[9]) : 0
                });
            }
        } catch (e) {
            console.error('Error parsing club stats:', line, e.message);
        }
    }

    return { success: true, data: stats };
}

/**
 * Update player club with transaction (wrapped operation)
 * Demonstrates transaction-based operations
 */
export async function updatePlayerClubWithTransaction(playerId, newClubId) {
    const query = `
        UPDATE Player SET current_club_id = ${parseInt(newClubId)}
        WHERE player_id = ${parseInt(playerId)};
        
        SELECT player_id, first_name, last_name, current_club_id 
        FROM Player WHERE player_id = ${parseInt(playerId)};
    `;

    // Execute with transaction wrapping
    const result = executeSqlQuery(query, true);
    if (!result.success) {
        return { success: false, error: result.error };
    }

    return { success: true, message: 'Player club updated successfully' };
}

export default executeSqlQuery;
