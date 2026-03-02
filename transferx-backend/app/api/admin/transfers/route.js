import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/middleware';
import { successResponse, errorResponse, handleRouteError } from '@/lib/response';

/**
 * GET /api/admin/transfers
 * Get all transfers with comprehensive filters
 */
export async function GET(request) {
  try {
    const authUser = await requireAuth(request, 'ADMIN');
    if (authUser instanceof NextResponse) return authUser;

    const { searchParams } = new URL(request.url);
    const transferType = searchParams.get('type');
    const clubId = searchParams.get('clubId');
    const playerId = searchParams.get('playerId');
    const season = searchParams.get('season');
    const minFee = searchParams.get('minFee');
    const maxFee = searchParams.get('maxFee');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = (page - 1) * limit;

    // Build filter conditions
    const where = {};
    
    if (transferType) {
      where.transfer_type = transferType;
    }
    
    if (clubId) {
      const cId = parseInt(clubId);
      where.OR = [
        { from_club_id: cId },
        { to_club_id: cId },
      ];
    }
    
    if (playerId) {
      where.player_id = parseInt(playerId);
    }
    
    if (season) {
      const year = parseInt(season);
      where.transfer_date = {
        gte: new Date(year, 0, 1),
        lt: new Date(year + 1, 0, 1),
      };
    }
    
    if (minFee || maxFee) {
      where.transfer_fee = {};
      if (minFee) where.transfer_fee.gte = parseFloat(minFee);
      if (maxFee) where.transfer_fee.lte = parseFloat(maxFee);
    }

    const [transfers, total] = await Promise.all([
      prisma.transfer.findMany({
        where,
        include: {
          player: true,
          from_club: {
            include: {
              league: true,
            },
          },
          to_club: {
            include: {
              league: true,
            },
          },
          transfer_history: true,
        },
        orderBy: {
          transfer_date: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.transfer.count({ where }),
    ]);

    return successResponse({
      transfers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return handleRouteError(error);
  }
}

/**
 * POST /api/admin/transfers
 * Create a new transfer and update related records
 */
export async function POST(request) {
  try {
    const authUser = await requireAuth(request, 'ADMIN');
    if (authUser instanceof NextResponse) return authUser;

    const body = await request.json();
    const {
      player_id,
      from_club_id,
      to_club_id,
      transfer_fee,
      transfer_date,
      transfer_type,
    } = body;

    // Validation
    if (!player_id || !from_club_id || !to_club_id || !transfer_date || !transfer_type) {
      return errorResponse('Player, clubs, date, and transfer type are required', 400);
    }

    // Validate transfer fee is not negative
    if (transfer_fee !== null && transfer_fee !== undefined && parseFloat(transfer_fee) < 0) {
      return errorResponse('Transfer fee cannot be negative', 400);
    }

    // Check if player exists
    const player = await prisma.player.findUnique({
      where: { player_id: parseInt(player_id) },
    });

    if (!player) {
      return errorResponse('Player not found', 404);
    }

    // Check if clubs exist
    const [fromClub, toClub] = await Promise.all([
      prisma.club.findUnique({ where: { club_id: parseInt(from_club_id) } }),
      prisma.club.findUnique({ where: { club_id: parseInt(to_club_id) } }),
    ]);

    if (!fromClub || !toClub) {
      return errorResponse('One or both clubs not found', 404);
    }

    // Create transfer with transaction to ensure data integrity
    const transfer = await prisma.$transaction(async (tx) => {
      // Create the transfer
      const newTransfer = await tx.transfer.create({
        data: {
          player_id: parseInt(player_id),
          from_club_id: parseInt(from_club_id),
          to_club_id: parseInt(to_club_id),
          transfer_fee: transfer_fee ? parseFloat(transfer_fee) : null,
          transfer_date: new Date(transfer_date),
          transfer_type,
        },
        include: {
          player: true,
          from_club: true,
          to_club: true,
        },
      });

      // Create transfer history entry
      await tx.transferHistory.create({
        data: {
          transfer_id: newTransfer.transfer_id,
          player_id: parseInt(player_id),
          fee: transfer_fee ? parseFloat(transfer_fee) : null,
        },
      });

      // Update player's current club
      await tx.player.update({
        where: { player_id: parseInt(player_id) },
        data: { current_club_id: parseInt(to_club_id) },
      });

      // End old contracts (if permanent transfer)
      if (transfer_type === 'PERMANENT') {
        await tx.contract.updateMany({
          where: {
            player_id: parseInt(player_id),
            club_id: parseInt(from_club_id),
            end_date: { gte: new Date(transfer_date) },
          },
          data: {
            end_date: new Date(transfer_date),
          },
        });
      }

      return newTransfer;
    });

    return successResponse(transfer, 201);
  } catch (error) {
    return handleRouteError(error);
  }
}
