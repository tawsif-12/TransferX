import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/middleware';
import { successResponse, errorResponse, handleRouteError } from '@/lib/response';
import { execSync } from 'child_process';
import { writeFileSync, unlinkSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

const SERVER = 'localhost\\SQLEXPRESS';
const DATABASE = 'transferx';

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
 * Parse sqlcmd CSV output
 */
function parsePlayerOutput(output) {
    try {
        const lines = output.trim().split('\n');
        const players = [];
        
        let dataStart = 0;
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].includes('---')) {
                dataStart = i + 1;
                break;
            }
        }

        for (let i = dataStart; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line || line.startsWith('(') || line.includes('rows affected')) continue;
            
            const values = line.split(',');
            if (values.length >= 8) {
                players.push({
                    id: parseInt(values[0]) || 0,
                    first_name: values[1]?.trim() || '',
                    last_name: values[2]?.trim() || '',
                    date_of_birth: values[3]?.trim() || '',
                    position: values[4]?.trim() || '',
                    nationality: values[5]?.trim() || '',
                    club_id: parseInt(values[6]) || 0,
                    club_name: values[7]?.trim() || 'N/A',
                });
            }
        }
        return players;
    } catch (error) {
        console.error('Parse error:', error);
        return [];
    }
}

/**
 * OPTIONS - Handle CORS preflight
 */
export async function OPTIONS(request) {
  return new NextResponse(null, { status: 200 });
}

/**
 * GET /api/admin/players
 * Get all players with optional filters
 */
export async function GET(request) {
  try {
    const authUser = await requireAuth(request, 'ADMIN');
    if (authUser instanceof NextResponse) return authUser;

    try {
      const { searchParams } = new URL(request.url);
      const search = searchParams.get('search');
      const position = searchParams.get('position');
      const page = parseInt(searchParams.get('page') || '1');
      const limit = parseInt(searchParams.get('limit') || '50');
      const offset = (page - 1) * limit;

      // Build SQL query with filters
      let whereClause = '1=1';
      
      if (search) {
        const searchTerm = search.replace(/'/g, "''");
        whereClause += ` AND (p.first_name LIKE '%${searchTerm}%' OR p.last_name LIKE '%${searchTerm}%')`;
      }
      
      if (position) {
        const posTerm = position.replace(/'/g, "''");
        whereClause += ` AND p.position LIKE '%${posTerm}%'`;
      }

      // Get total count
      const countQuery = `
        SELECT COUNT(*) as count FROM [Player] p
        WHERE ${whereClause}
      `;
      const countStr = executeSqlQuery(countQuery);
      const countLines = countStr.split('\n');
      let total = 0;
      for (const line of countLines) {
        const val = parseInt(line.trim());
        if (!isNaN(val) && val > 0) {
          total = val;
          break;
        }
      }

      // Get players data
      const playersQuery = `
        SELECT p.player_id as id, p.first_name, p.last_name, 
               p.date_of_birth, p.position, p.nationality, 
               ISNULL(c.club_id, 0) as club_id, ISNULL(c.name, 'No Club') as club_name
        FROM [Player] p
        LEFT JOIN [Club] c ON p.current_club_id = c.club_id
        WHERE ${whereClause}
        ORDER BY p.last_name, p.first_name
        OFFSET ${offset} ROWS
        FETCH NEXT ${limit} ROWS ONLY
      `;
      
      const playersStr = executeSqlQuery(playersQuery);
      const players = parsePlayerOutput(playersStr);

      return successResponse({
        players,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });

    } catch (err) {
      console.error('❌ Players query error:', err.message);
      return errorResponse('Failed to load players: ' + err.message, 500);
    }
  } catch (error) {
    return handleRouteError(error);
  }
}

/**
 * POST /api/admin/players
 * Create a new player
 */
export async function POST(request) {
  try {
    const authUser = await requireAuth(request, 'ADMIN');
    if (authUser instanceof NextResponse) return authUser;

    const body = await request.json();
    const {
      first_name,
      last_name,
      date_of_birth,
      position,
      nationality,
      current_club_id,
      fee,
      marketValue,
    } = body;

    // Validation
    if (!first_name || !last_name) {
      return errorResponse('First name and last name are required', 400);
    }

    try {
      // Insert player using SQL
      const dob = date_of_birth ? new Date(date_of_birth).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
      const insertQuery = `
        INSERT INTO [Player] (first_name, last_name, date_of_birth, position, nationality, current_club_id, fee)
        VALUES ('${first_name.replace(/'/g, "''")}', '${last_name.replace(/'/g, "''")}', '${dob}', 
                '${(position || '').replace(/'/g, "''")}', '${(nationality || '').replace(/'/g, "''")}', 
                ${current_club_id || 0}, ${fee || 0})
        SELECT CAST(SCOPE_IDENTITY() as int) as id
      `;
      
      executeSqlQuery(insertQuery);

      return successResponse({
        message: 'Player created successfully',
      }, 201);

    } catch (err) {
      console.error('❌ Player creation error:', err.message);
      return errorResponse('Failed to create player: ' + err.message, 500);
    }
  } catch (error) {
    return handleRouteError(error);
  }
}
