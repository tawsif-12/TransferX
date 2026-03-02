import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/middleware';
import { successResponse, errorResponse, handleRouteError } from '@/lib/response';

/**
 * GET /api/admin/players/[id]
 * Get full player profile with career history
 */
export async function GET(request, { params }) {
  try {
    const authUser = await requireAuth(request, 'ADMIN');
    if (authUser instanceof NextResponse) return authUser;

    const playerId = parseInt(params.id);

    const player = await prisma.player.findUnique({
      where: { player_id: playerId },
      include: {
        current_club: {
          include: {
            league: true,
          },
        },
        agents: {
          include: {
            agent: true,
          },
        },
        contracts: {
          include: {
            club: true,
          },
          orderBy: {
            start_date: 'desc',
          },
        },
        transfers_from: {
          include: {
            from_club: true,
            to_club: true,
          },
          orderBy: {
            transfer_date: 'desc',
          },
        },
        transfer_history: {
          include: {
            transfer: {
              include: {
                from_club: true,
                to_club: true,
              },
            },
          },
          orderBy: {
            transfer_id: 'desc',
          },
        },
      },
    });

    if (!player) {
      return errorResponse('Player not found', 404);
    }

    // Get career statistics
    const careerStats = await prisma.$queryRaw`
      SELECT 
        COUNT(DISTINCT c.club_id) as clubs_played,
        COUNT(t.transfer_id) as total_transfers,
        SUM(CAST(t.transfer_fee AS float)) as total_transfer_value,
        COUNT(DISTINCT ct.contract_id) as total_contracts
      FROM Player p
      LEFT JOIN Transfer t ON p.player_id = t.player_id
      LEFT JOIN Contract ct ON p.player_id = ct.player_id
      WHERE p.player_id = ${playerId}
      GROUP BY p.player_id
    `;

    return successResponse({
      ...player,
      careerStats: careerStats[0] || {
        clubs_played: 0,
        total_transfers: 0,
        total_transfer_value: 0,
        total_contracts: 0,
      },
    });
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

    const {
      first_name,
      last_name,
      date_of_birth,
      position,
      nationality,
      current_club_id,
      fee,
    } = body;

    // Check if player exists
    const existingPlayer = await prisma.player.findUnique({
      where: { player_id: playerId },
    });

    if (!existingPlayer) {
      return errorResponse('Player not found', 404);
    }

    // Check for duplicate (excluding current player)
    if (first_name && last_name && date_of_birth) {
      const duplicate = await prisma.player.findFirst({
        where: {
          AND: [
            { player_id: { not: playerId } },
            { first_name },
            { last_name },
            { date_of_birth: new Date(date_of_birth) },
          ],
        },
      });

      if (duplicate) {
        return errorResponse('Another player with the same name and date of birth already exists', 400);
      }
    }

    const updateData = {};
    if (first_name !== undefined) updateData.first_name = first_name;
    if (last_name !== undefined) updateData.last_name = last_name;
    if (date_of_birth !== undefined) updateData.date_of_birth = new Date(date_of_birth);
    if (position !== undefined) updateData.position = position;
    if (nationality !== undefined) updateData.nationality = nationality;
    if (current_club_id !== undefined) {
      updateData.current_club_id = current_club_id ? parseInt(current_club_id) : null;
    }
    if (fee !== undefined) updateData.fee = fee ? parseFloat(fee) : null;

    const player = await prisma.player.update({
      where: { player_id: playerId },
      data: updateData,
      include: {
        current_club: true,
        agents: {
          include: {
            agent: true,
          },
        },
      },
    });

    return successResponse(player);
  } catch (error) {
    return handleRouteError(error);
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

    // Check if player exists
    const player = await prisma.player.findUnique({
      where: { player_id: playerId },
      include: {
        _count: {
          select: {
            transfers_from: true,
            contracts: true,
            transfer_history: true,
          },
        },
      },
    });

    if (!player) {
      return errorResponse('Player not found', 404);
    }

    // Check if player has related records
    const hasRelatedRecords = 
      player._count.transfers_from > 0 ||
      player._count.contracts > 0 ||
      player._count.transfer_history > 0;

    if (hasRelatedRecords) {
      return errorResponse(
        'Cannot delete player with existing transfers, contracts, or history. Please remove related records first.',
        400
      );
    }

    // Delete player
    await prisma.player.delete({
      where: { player_id: playerId },
    });

    return successResponse({ message: 'Player deleted successfully' });
  } catch (error) {
    return handleRouteError(error);
  }
}
