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
 * Get all players with optional filters
 */
export async function getPlayers(limit = 500, filters = {}) {
    try {
        // Only show players currently in Bangladesh Premier League clubs (not free agents or without club)
        let whereClause = '(current_club_id IS NOT NULL AND current_club_id NOT IN (999, 0))';

        if (filters.name) {
            const escapedName = filters.name.replace(/'/g, "''");
            whereClause += ` AND CONCAT(first_name, ' ', last_name) LIKE '%${escapedName}%'`;
        }
        if (filters.position) {
            // Map category positions to actual database positions
            const positionMap = {
                'GOALKEEPER': ['Goalkeeper'],
                'DEFENDER': ['Centre-Back', 'Left-Back', 'Right-Back'],
                'MIDFIELDER': ['Central Midfield', 'Defensive Midfield', 'Left Midfield', 'Attacking Midfield'],
                'FORWARD': ['Centre-Forward', 'Left Winger', 'Right Winger', 'Second Striker']
            };

            const positions = positionMap[filters.position] || [];
            if (positions.length > 0) {
                const positionList = positions.map(p => `'${p.replace(/'/g, "''")}'`).join(',');
                whereClause += ` AND position IN (${positionList})`;
            }
        }
        if (filters.nationality) {
            const escapedNationality = filters.nationality.replace(/'/g, "''");
            whereClause += ` AND nationality = '${escapedNationality}'`;
        }
        if (filters.clubId) {
            whereClause += ` AND current_club_id = ${parseInt(filters.clubId)}`;
        }

        const query = `
SET NOCOUNT ON;
SELECT TOP ${limit}
    CAST(player_id as VARCHAR(10)) as player_id,
    CAST(ISNULL(current_club_id, 0) as VARCHAR(10)) as current_club_id,
    first_name,
    last_name,
    position,
    nationality,
    CONVERT(VARCHAR(10), date_of_birth, 121) as date_of_birth,
    LTRIM(STR(ISNULL(fee, 0), 20, 2)) as fee
FROM Player
WHERE ${whereClause}
ORDER BY player_id
`;

        const output = executeSqlQuery(query);
        const columns = ['player_id', 'current_club_id', 'first_name', 'last_name', 'position', 'nationality', 'date_of_birth', 'fee'];
        const rows = parseSqlOutput(output, columns);

        // Fetch club names separately for each player
        const playersData = rows.map(row => ({
            player_id: parseInt(row.player_id),
            current_club_id: parseInt(row.current_club_id) || null,
            first_name: row.first_name,
            last_name: row.last_name,
            position: row.position,
            nationality: row.nationality,
            date_of_birth: row.date_of_birth ? new Date(row.date_of_birth) : null,
            fee: row.fee ? parseFloat(row.fee) : null,
        }));

        // Get club names for players that have clubs
        if (playersData.some(p => p.current_club_id > 0)) {
            try {
                const clubIds = [...new Set(playersData.filter(p => p.current_club_id > 0).map(p => p.current_club_id))];
                const clubQuery = `
SET NOCOUNT ON;
SELECT CAST(club_id as VARCHAR(10)) as club_id, name
FROM Club
WHERE club_id IN (${clubIds.join(',')})
`;
                const clubOutput = executeSqlQuery(clubQuery);
                const clubRows = parseSqlOutput(clubOutput, ['club_id', 'name']);
                const clubMap = Object.fromEntries(clubRows.map(r => [parseInt(r.club_id), r.name]));

                // Attach club info to players
                playersData.forEach(player => {
                    if (player.current_club_id && clubMap[player.current_club_id]) {
                        player.current_club = {
                            club_id: player.current_club_id,
                            name: clubMap[player.current_club_id]
                        };
                    }
                });
            } catch (clubError) {
                console.log('Could not fetch club names:', clubError.message);
                // Continue without club names
            }
        }

        return {
            success: true,
            data: playersData
        };
    } catch (error) {
        console.error('Error getting players:', error.message);
        return { success: false, error: error.message, data: [] };
    }
}

/**
 * Get all clubs with league info
 */
export async function getClubs(filters = {}) {
    try {
        let whereClause = '1=1';

        if (filters.name) {
            const escapedName = filters.name.replace(/'/g, "''");
            whereClause += ` AND c.name LIKE '%${escapedName}%'`;
        }
        if (filters.leagueId) {
            whereClause += ` AND c.league_id = ${parseInt(filters.leagueId)}`;
        }
        if (filters.country) {
            const escapedCountry = filters.country.replace(/'/g, "''");
            whereClause += ` AND c.country = '${escapedCountry}'`;
        }

        const query = `
SET NOCOUNT ON;
SELECT
    CAST(c.club_id as VARCHAR(10)) as club_id,
    c.name,
    c.country,
    CAST(c.founded_year as VARCHAR(4)) as founded_year,
    CAST(c.league_id as VARCHAR(10)) as league_id,
    l.name as league_name,
    CAST(COUNT(DISTINCT p.player_id) as VARCHAR(10)) as player_count
FROM Club c
LEFT JOIN League l ON c.league_id = l.league_id
LEFT JOIN Player p ON c.club_id = p.current_club_id
WHERE ${whereClause}
GROUP BY c.club_id, c.name, c.country, c.founded_year, c.league_id, l.name
ORDER BY c.club_id
`;

        const output = executeSqlQuery(query);
        const columns = ['club_id', 'name', 'country', 'founded_year', 'league_id', 'league_name', 'player_count'];
        const rows = parseSqlOutput(output, columns);

        return {
            success: true,
            data: rows.map(row => ({
                club_id: parseInt(row.club_id),
                name: row.name,
                country: row.country,
                founded_year: row.founded_year ? parseInt(row.founded_year) : null,
                league_id: parseInt(row.league_id),
                league: {
                    league_id: parseInt(row.league_id),
                    name: row.league_name,
                },
                player_count: parseInt(row.player_count || 0),
                players: [],
                contracts: [],
            }))
        };
    } catch (error) {
        console.error('Error getting clubs:', error.message);
        return { success: false, error: error.message, data: [] };
    }
}

/**
 * Get all agents with their players
 */
export async function getAgents(filters = {}) {
    try {
        let whereClause = '1=1';

        if (filters.name) {
            const escapedName = filters.name.replace(/'/g, "''");
            whereClause += ` AND a.agent_name LIKE '%${escapedName}%'`;
        }

        const query = `
SET NOCOUNT ON;
SELECT
    CAST(a.agent_id as VARCHAR(10)) as agent_id,
    a.agent_name,
    CAST(COUNT(DISTINCT pa.player_id) as VARCHAR(10)) as player_count
FROM Agent a
LEFT JOIN PlayerAgent pa ON a.agent_id = pa.agent_id
WHERE ${whereClause}
GROUP BY a.agent_id, a.agent_name
ORDER BY a.agent_id
`;

        const output = executeSqlQuery(query);
        const columns = ['agent_id', 'agent_name', 'player_count'];
        const rows = parseSqlOutput(output, columns);

        return {
            success: true,
            data: rows.map(row => ({
                agent_id: parseInt(row.agent_id),
                agent_name: row.agent_name,
                player_count: parseInt(row.player_count || 0),
                players: [],
            }))
        };
    } catch (error) {
        console.error('Error getting agents:', error.message);
        return { success: false, error: error.message, data: [] };
    }
}

/**
 * Get all leagues
 */
export async function getLeagues() {
    try {
        const query = `
SET NOCOUNT ON;
SELECT
    CAST(league_id as VARCHAR(10)) as league_id,
    name,
    country
FROM League
ORDER BY league_id
`;

        const output = executeSqlQuery(query);
        const columns = ['league_id', 'name', 'country'];
        const rows = parseSqlOutput(output, columns);

        return {
            success: true,
            data: rows.map(row => ({
                league_id: parseInt(row.league_id),
                name: row.name,
                country: row.country,
            }))
        };
    } catch (error) {
        console.error('Error getting leagues:', error.message);
        return { success: false, error: error.message, data: [] };
    }
}

/**
 * Get single player by ID
 */
export async function getPlayerById(playerId) {
    try {
        console.log('[getPlayerById] Fetching player:', playerId);
        const query = `
SET NOCOUNT ON;
SELECT
    CAST(player_id as VARCHAR(10)) as player_id,
    CAST(ISNULL(current_club_id, 0) as VARCHAR(10)) as current_club_id,
    first_name,
    last_name,
    position,
    nationality,
    CONVERT(VARCHAR(10), date_of_birth, 121) as date_of_birth,
    LTRIM(STR(ISNULL(fee, 0), 20, 2)) as fee
FROM Player
WHERE player_id = ${parseInt(playerId)}
`;

        const output = executeSqlQuery(query);
        console.log('[getPlayerById] SQL output:', output.substring(0, 200));
        const columns = ['player_id', 'current_club_id', 'first_name', 'last_name', 'position', 'nationality', 'date_of_birth', 'fee'];
        const rows = parseSqlOutput(output, columns);
        console.log('[getPlayerById] Parsed rows:', rows.length);

        if (rows.length === 0) {
            console.log('[getPlayerById] Player not found');
            return { success: true, data: null };
        }

        const row = rows[0];
        return {
            success: true,
            data: {
                player_id: parseInt(row.player_id),
                current_club_id: parseInt(row.current_club_id) || null,
                first_name: row.first_name,
                last_name: row.last_name,
                position: row.position,
                nationality: row.nationality,
                date_of_birth: row.date_of_birth ? new Date(row.date_of_birth) : null,
                fee: row.fee ? parseFloat(row.fee.trim()) : null,
            }
        };
    } catch (error) {
        console.error('[getPlayerById] Error getting player by ID:', error.message);
        return { success: false, error: error.message, data: null };
    }
}

/**
 * Get single club by ID
 */
export async function getClubById(clubId) {
    try {
        const query = `
SET NOCOUNT ON;
SELECT
    CAST(c.club_id as VARCHAR(10)) as club_id,
    c.name,
    c.country,
    CAST(c.founded_year as VARCHAR(4)) as founded_year,
    CAST(c.league_id as VARCHAR(10)) as league_id,
    l.name as league_name,
    CAST(COUNT(DISTINCT p.player_id) as VARCHAR(10)) as player_count
FROM Club c
LEFT JOIN League l ON c.league_id = l.league_id
LEFT JOIN Player p ON c.club_id = p.current_club_id
WHERE c.club_id = ${parseInt(clubId)}
GROUP BY c.club_id, c.name, c.country, c.founded_year, c.league_id, l.name
`;

        const output = executeSqlQuery(query);
        const columns = ['club_id', 'name', 'country', 'founded_year', 'league_id', 'league_name', 'player_count'];
        const rows = parseSqlOutput(output, columns);

        if (rows.length === 0) {
            return { success: true, data: null };
        }

        const row = rows[0];
        return {
            success: true,
            data: {
                club_id: parseInt(row.club_id),
                name: row.name,
                country: row.country,
                founded_year: row.founded_year ? parseInt(row.founded_year) : null,
                league_id: parseInt(row.league_id),
                league: {
                    league_id: parseInt(row.league_id),
                    name: row.league_name,
                },
                player_count: parseInt(row.player_count || 0),
                players: [],
                contracts: [],
            }
        };
    } catch (error) {
        console.error('Error getting club by ID:', error.message);
        return { success: false, error: error.message, data: null };
    }
}

/**
 * Get single agent by ID with player list
 */
export async function getAgentById(agentId) {
    try {
        const query = `
SET NOCOUNT ON;
SELECT
    CAST(a.agent_id as VARCHAR(10)) as agent_id,
    a.agent_name,
    CAST(COUNT(DISTINCT pa.player_id) as VARCHAR(10)) as player_count
FROM Agent a
LEFT JOIN PlayerAgent pa ON a.agent_id = pa.agent_id
WHERE a.agent_id = ${parseInt(agentId)}
GROUP BY a.agent_id, a.agent_name
`;

        const output = executeSqlQuery(query);
        const columns = ['agent_id', 'agent_name', 'player_count'];
        const rows = parseSqlOutput(output, columns);

        if (rows.length === 0) {
            return { success: true, data: null };
        }

        const row = rows[0];
        return {
            success: true,
            data: {
                agent_id: parseInt(row.agent_id),
                agent_name: row.agent_name,
                player_count: parseInt(row.player_count || 0),
                players: [],
            }
        };
    } catch (error) {
        console.error('Error getting agent by ID:', error.message);
        return { success: false, error: error.message, data: null };
    }
}

/**
 * Get single league by ID with clubs
 */
export async function getLeagueById(leagueId) {
    try {
        const query = `
SET NOCOUNT ON;
SELECT
    CAST(l.league_id as VARCHAR(10)) as league_id,
    l.name,
    l.country,
    CAST(COUNT(DISTINCT c.club_id) as VARCHAR(10)) as club_count
FROM League l
LEFT JOIN Club c ON l.league_id = c.league_id
WHERE l.league_id = ${parseInt(leagueId)}
GROUP BY l.league_id, l.name, l.country
`;

        const output = executeSqlQuery(query);
        const columns = ['league_id', 'name', 'country', 'club_count'];
        const rows = parseSqlOutput(output, columns);

        if (rows.length === 0) {
            return { success: true, data: null };
        }

        const row = rows[0];
        return {
            success: true,
            data: {
                league_id: parseInt(row.league_id),
                name: row.name,
                country: row.country,
                club_count: parseInt(row.club_count || 0),
                clubs: [],
            }
        };
    } catch (error) {
        console.error('Error getting league by ID:', error.message);
        return { success: false, error: error.message, data: null };
    }
}

/**
 * Get transfers with optional filters
 */
export async function getTransfers(filters = {}) {
    try {
        let whereClause = '1=1';

        if (filters.playerId) {
            whereClause += ` AND t.player_id = ${parseInt(filters.playerId)}`;
        }
        if (filters.type) {
            const escapedType = filters.type.replace(/'/g, "''");
            whereClause += ` AND t.transfer_type = '${escapedType}'`;
        }
        if (filters.fromYear) {
            whereClause += ` AND YEAR(t.transfer_date) >= ${parseInt(filters.fromYear)}`;
        }
        if (filters.toYear) {
            whereClause += ` AND YEAR(t.transfer_date) <= ${parseInt(filters.toYear)}`;
        }

        const query = `
SET NOCOUNT ON;
SELECT TOP 500
    CAST(t.transfer_id as VARCHAR(10)) as transfer_id,
    CAST(t.player_id as VARCHAR(10)) as player_id,
    p.first_name,
    p.last_name,
    CAST(t.from_club_id as VARCHAR(10)) as from_club_id,
    fc.name as from_club_name,
    CAST(t.to_club_id as VARCHAR(10)) as to_club_id,
    tc.name as to_club_name,
    CONVERT(VARCHAR(10), t.transfer_date, 121) as transfer_date,
    LTRIM(STR(ISNULL(t.transfer_fee, 0), 20, 2)) as transfer_fee,
    t.transfer_type
FROM Transfer t
LEFT JOIN Player p ON t.player_id = p.player_id
LEFT JOIN Club fc ON t.from_club_id = fc.club_id
LEFT JOIN Club tc ON t.to_club_id = tc.club_id
WHERE ${whereClause}
ORDER BY t.transfer_date DESC
`;

        const output = executeSqlQuery(query);
        const columns = ['transfer_id', 'player_id', 'first_name', 'last_name', 'from_club_id', 'from_club_name', 'to_club_id', 'to_club_name', 'transfer_date', 'transfer_fee', 'transfer_type'];
        const rows = parseSqlOutput(output, columns);

        return {
            success: true,
            data: rows.map(row => ({
                transfer_id: parseInt(row.transfer_id),
                player_id: parseInt(row.player_id),
                player: {
                    first_name: row.first_name,
                    last_name: row.last_name,
                },
                from_club_id: parseInt(row.from_club_id) || null,
                from_club: row.from_club_name ? { name: row.from_club_name } : null,
                to_club_id: parseInt(row.to_club_id) || null,
                to_club: row.to_club_name ? { name: row.to_club_name } : null,
                transfer_date: row.transfer_date ? new Date(row.transfer_date) : null,
                transfer_fee: row.transfer_fee ? parseFloat(row.transfer_fee) : null,
                transfer_type: row.transfer_type,
            }))
        };
    } catch (error) {
        console.error('Error getting transfers:', error.message);
        return { success: false, error: error.message, data: [] };
    }
}

/**
 * Get dashboard statistics
 */
export async function getDashboardStats() {
    try {
        const query = `
SET NOCOUNT ON;
SELECT 
    'TOTAL_PLAYERS' as stat_key, CAST(COUNT(DISTINCT player_id) as VARCHAR(20)) as stat_value FROM Player
UNION ALL
SELECT 'TOTAL_CLUBS', CAST(COUNT(DISTINCT club_id) as VARCHAR(20)) FROM Club
UNION ALL
SELECT 'TOTAL_LEAGUES', CAST(COUNT(DISTINCT league_id) as VARCHAR(20)) FROM League
UNION ALL
SELECT 'TOTAL_AGENTS', CAST(COUNT(DISTINCT agent_id) as VARCHAR(20)) FROM Agent
UNION ALL
SELECT 'TOTAL_TRANSFERS', CAST(COUNT(DISTINCT transfer_id) as VARCHAR(20)) FROM Transfer
UNION ALL
SELECT 'TOTAL_TRANSFER_VALUE', LTRIM(STR(ISNULL(SUM(transfer_fee), 0), 20, 2)) FROM Transfer
`;

        const output = executeSqlQuery(query);
        const columns = ['stat_key', 'stat_value'];
        const rows = parseSqlOutput(output, columns);

        const stats = {};
        rows.forEach(row => {
            const key = row.stat_key.toLowerCase();
            const value = ['TOTAL_TRANSFER_VALUE'].includes(row.stat_key)
                ? parseFloat(row.stat_value)
                : parseInt(row.stat_value);
            stats[key] = value;
        });

        return {
            success: true,
            data: {
                total_players: stats.total_players || 0,
                total_clubs: stats.total_clubs || 0,
                total_leagues: stats.total_leagues || 0,
                total_agents: stats.total_agents || 0,
                total_transfers: stats.total_transfers || 0,
                total_transfer_value: stats.total_transfer_value || 0,
            }
        };
    } catch (error) {
        console.error('Error getting dashboard stats:', error.message);
        return { success: false, error: error.message, data: {} };
    }
}

/**
 * Get news about Bangladesh players
 */
export async function getNews(limit = 10, filters = {}) {
    try {
        let whereClause = '1=1';

        if (filters.playerId) {
            whereClause += ` AND player_id = ${parseInt(filters.playerId)}`;
        }
        if (filters.category) {
            const escapedCategory = filters.category.replace(/'/g, "''");
            whereClause += ` AND category = '${escapedCategory}'`;
        }

        const query = `
SET NOCOUNT ON;
SELECT TOP ${limit}
    CAST(news_id as VARCHAR(10)) as news_id,
    title,
    description,
    category,
    image_url,
    CAST(ISNULL(player_id, 0) as VARCHAR(10)) as player_id,
    CONVERT(VARCHAR(19), created_at, 121) as created_at
FROM News
WHERE ${whereClause}
ORDER BY created_at DESC
`;

        const output = executeSqlQuery(query);
        const columns = ['news_id', 'title', 'description', 'category', 'image_url', 'player_id', 'created_at'];
        const rows = parseSqlOutput(output, columns);

        const newsData = rows.map(row => ({
            news_id: parseInt(row.news_id),
            title: row.title,
            description: row.description,
            category: row.category,
            image_url: row.image_url,
            player_id: parseInt(row.player_id) || null,
            created_at: row.created_at ? new Date(row.created_at) : null,
        }));

        return {
            success: true,
            data: newsData
        };
    } catch (error) {
        console.error('Error getting news:', error.message);
        return { success: false, error: error.message, data: [] };
    }
}
