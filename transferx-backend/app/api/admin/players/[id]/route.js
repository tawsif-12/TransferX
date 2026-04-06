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
 * OPTIONS - Handle CORS preflight
 */
export async function OPTIONS(request) {
  return new NextResponse(null, { status: 200 });
}

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
 * GET /api/admin/players/[id]
 * Get player details
 */
export async function GET(request, { params }) {
  try {
    const authUser = await requireAuth(request, 'ADMIN');
    if (authUser instanceof NextResponse) return authUser;

    const playerId = parseInt(params.id);

    const query = `
      SELECT p.player_id as id, p.first_name, p.last_name, 
             p.date_of_birth, p.position, p.nationality, 
             ISNULL(c.club_id, 0) as club_id, ISNULL(c.name, 'No Club') as club_name,
             p.fee
      FROM [Player] p
      LEFT JOIN [Club] c ON p.current_club_id = c.club_id
      WHERE p.player_id = ${playerId}
    `;

    const result = executeSqlQuery(query);
    const lines = result.trim().split('\n');
    
    // Find header and data rows
    let dataStart = 0;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('---')) {
        dataStart = i + 1;
        break;
      }
    }

    if (dataStart === 0 || !lines[dataStart] || lines[dataStart].trim() === '') {
      console.error(`❌ Player ${playerId} not found. DataStart: ${dataStart}, Lines available: ${lines.length}`);
      return errorResponse('Player not found', 404);
    }

    const line = lines[dataStart].trim();
    const values = line.split(',');

    if (values.length < 9) {
      console.error(`❌ Insufficient fields. Expected 9, got ${values.length}`);
      return errorResponse('Player not found', 404);
    }

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

    return successResponse(player);
  } catch (error) {
    return handleRouteError(error);
  }
}

/**
 * PUT /api/admin/players/[id]
 * Update a player
 */
export async function PUT(request, { params }) {
  try {
    const authUser = await requireAuth(request, 'ADMIN');
    if (authUser instanceof NextResponse) return authUser;

    const playerId = parseInt(params.id);
    const body = await request.json();

    console.log(`🔄 Update player ${playerId}:`, JSON.stringify(body, null, 2));

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

    // Check if player exists
    const checkQuery = `
      SELECT player_id FROM [Player] WHERE player_id = ${playerId}
    `;
    
    try {
      const checkResult = executeSqlQuery(checkQuery);
      if (!checkResult || !checkResult.includes(playerId.toString())) {
        console.error(`❌ Player ${playerId} not found during check`);
        return errorResponse('Player not found', 404);
      }
    } catch (err) {
      console.error(`❌ Check query error: ${err.message}`);
      return errorResponse('Player not found', 404);
    }

    // Build UPDATE query with provided fields
    const setClause = [];
    
    if (first_name !== undefined && first_name !== null && first_name !== '') {
      setClause.push(`first_name = '${first_name.replace(/'/g, "''")}'`);
    }
    if (last_name !== undefined && last_name !== null && last_name !== '') {
      setClause.push(`last_name = '${last_name.replace(/'/g, "''")}'`);
    }
    if (date_of_birth !== undefined && date_of_birth !== null && date_of_birth !== '') {
      try {
        // Handle date format - could be "2002-01-01" or full timestamp
        let dob = date_of_birth;
        if (dob.includes('T')) {
          dob = dob.split('T')[0];
        } else if (dob.includes(' ')) {
          dob = dob.split(' ')[0];
        }
        setClause.push(`date_of_birth = '${dob}'`);
        console.log(`  Setting date: ${dob}`);
      } catch (e) {
        console.error(`❌ Date parsing error: ${e.message}`);
        return errorResponse('Invalid date format', 400);
      }
    }
    if (position !== undefined && position !== null && position !== '') {
      setClause.push(`position = '${position.replace(/'/g, "''")}'`);
    }
    if (nationality !== undefined && nationality !== null && nationality !== '') {
      setClause.push(`nationality = '${nationality.replace(/'/g, "''")}'`);
    }
    if (current_club_id !== undefined && current_club_id !== null && current_club_id !== '') {
      const clubId = parseInt(current_club_id) || 0;
      setClause.push(`current_club_id = ${clubId}`);
    }
    if (fee !== undefined && fee !== null && fee !== '') {
      const feeVal = parseFloat(fee) || 0;
      setClause.push(`fee = ${feeVal}`);
    }

    if (setClause.length === 0) {
      console.warn('⚠️ No fields to update');
      return errorResponse('No fields to update', 400);
    }

    console.log(`  Fields to update: ${setClause.length}`);
    setClause.forEach(clause => console.log(`    - ${clause}`));

    // Update player
    const updateQuery = `
      UPDATE [Player]
      SET ${setClause.join(', ')}
      WHERE player_id = ${playerId}
    `;

    console.log(`⚙️ Executing update...`);
    executeSqlQuery(updateQuery);
    console.log(`✅ Update executed`);

    // Get updated player data
    const getQuery = `
      SELECT p.player_id as id, p.first_name, p.last_name, 
             p.date_of_birth, p.position, p.nationality, 
             ISNULL(c.club_id, 0) as club_id, ISNULL(c.name, 'No Club') as club_name,
             p.fee
      FROM [Player] p
      LEFT JOIN [Club] c ON p.current_club_id = c.club_id
      WHERE p.player_id = ${playerId}
    `;

    console.log(`📥 Fetching updated player data...`);
    const result = executeSqlQuery(getQuery);
    const lines = result.trim().split('\n');
    
    let dataStart = 0;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('---')) {
        dataStart = i + 1;
        break;
      }
    }

    if (!lines[dataStart] || lines[dataStart].trim() === '') {
      console.error(`❌ Failed to fetch updated player data`);
      return errorResponse('Updated player data not found', 500);
    }

    const line = lines[dataStart].trim();
    const values = line.split(',');

    if (values.length < 9) {
      console.error(`❌ Insufficient fields in response: ${values.length}`);
      return errorResponse('Invalid response from database', 500);
    }

    const updatedPlayer = {
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

    console.log(`✅ Player updated successfully:`, updatedPlayer);

    return successResponse(updatedPlayer);
  } catch (error) {
    console.error('❌ Update player error:', error.message);
    console.error('Stack:', error.stack);
    return errorResponse('Failed to update player: ' + error.message, 500);
  }
}

/**
 * DELETE /api/admin/players/[id]
 * Delete a player (with cascading checks)
 */
export async function DELETE(request, { params }) {
  try {
    const authUser = await requireAuth(request, 'ADMIN');
    if (authUser instanceof NextResponse) return authUser;

    const playerId = parseInt(params.id);

    // Check if player exists and count related records
    const checkQuery = `
      SELECT 
        p.player_id,
        (SELECT COUNT(*) FROM [Transfer] WHERE player_id = ${playerId}) as transfer_count,
        (SELECT COUNT(*) FROM [Contract] WHERE player_id = ${playerId}) as contract_count,
        (SELECT COUNT(*) FROM [TransferHistory] WHERE player_id = ${playerId}) as transfer_history_count
      FROM [Player] p
      WHERE p.player_id = ${playerId}
    `;

    const result = executeSqlQuery(checkQuery);
    const lines = result.trim().split('\n');

    let dataStart = 0;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('---')) {
        dataStart = i + 1;
        break;
      }
    }

    if (!lines[dataStart] || lines[dataStart].trim() === '') {
      return errorResponse('Player not found', 404);
    }

    const line = lines[dataStart].trim();
    const values = line.split(',');

    const transferCount = parseInt(values[1]) || 0;
    const contractCount = parseInt(values[2]) || 0;
    const transferHistoryCount = parseInt(values[3]) || 0;

    // Check if player has related records
    if (transferCount > 0 || contractCount > 0 || transferHistoryCount > 0) {
      return errorResponse(
        `Cannot delete player. Has ${transferCount} transfers, ${contractCount} contracts, and ${transferHistoryCount} transfer history records. Remove related records first.`,
        400
      );
    }

    // Delete player
    const deleteQuery = `
      DELETE FROM [Player] WHERE player_id = ${playerId}
    `;

    executeSqlQuery(deleteQuery);

    return successResponse({ message: 'Player deleted successfully' });
  } catch (error) {
    console.error('❌ Delete player error:', error.message);
    return errorResponse('Failed to delete player: ' + error.message, 500);
  }
}
