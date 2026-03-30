import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse, handleRouteError } from '@/lib/response';
import { requireAuth } from '@/lib/middleware';
import { getTransfers } from '@/lib/dataQueries';

/**
 * GET /api/transfers
 * List all transfers with optional filtering by playerId, type, fromYear, toYear
 */
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const playerId = searchParams.get('playerId');
        const type = searchParams.get('type');
        const fromYear = searchParams.get('fromYear');
        const toYear = searchParams.get('toYear');

        const filters = {};
        if (playerId) filters.playerId = playerId;
        if (type) filters.type = type;
        if (fromYear) filters.fromYear = fromYear;
        if (toYear) filters.toYear = toYear;

        try {
            const result = await getTransfers(filters);
            if (result.success) {
                return successResponse(result.data);
            } else {
                return successResponse([], 200);
            }
        } catch (err) {
            console.error('Query failed:', err.message);
            return successResponse([], 200);
        }
    } catch (error) {
        return handleRouteError(error);
    }
}

/**
 * POST /api/transfers
 * Create a new transfer (admin only)
 * Automatically creates TransferHistory and updates player's current_club_id
 */
export async function POST(request) {
    try {
        const auth = await requireAuth(request);
        if (auth instanceof NextResponse) return auth;

        if (auth.role !== 'ADMIN') {
            return errorResponse('Only admin can create transfers', 403);
        }

        const body = await request.json();
        const {
            player_id,
            from_club_id,
            to_club_id,
            transfer_fee,
            transfer_date,
            transfer_type,
        } = body;

        // Validate required fields
        if (!player_id || !from_club_id || !to_club_id || !transfer_date || !transfer_type) {
            return errorResponse(
                'Missing required fields: player_id, from_club_id, to_club_id, transfer_date, transfer_type',
                400
            );
        }

        const playerId = parseInt(player_id);
        const fromClubId = parseInt(from_club_id);
        const toClubId = parseInt(to_club_id);

        // Verify all entities exist
        const [player, fromClub, toClub] = await Promise.all([
            prisma.player.findUnique({ where: { player_id: playerId } }),
            prisma.club.findUnique({ where: { club_id: fromClubId } }),
            prisma.club.findUnique({ where: { club_id: toClubId } }),
        ]);

        if (!player) return errorResponse('Player not found', 404);
        if (!fromClub) return errorResponse('From club not found', 404);
        if (!toClub) return errorResponse('To club not found', 404);

        // Use transaction to ensure all operations succeed together
        const transfer = await prisma.$transaction(async (tx) => {
            // Create transfer
            const newTransfer = await tx.transfer.create({
                data: {
                    player_id: playerId,
                    from_club_id: fromClubId,
                    to_club_id: toClubId,
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
                    player_id: playerId,
                    fee: transfer_fee ? parseFloat(transfer_fee) : null,
                },
            });

            // Update player's current club
            await tx.player.update({
                where: { player_id: playerId },
                data: { current_club_id: toClubId },
            });

            return newTransfer;
        });

        return successResponse(transfer, 201);
    } catch (error) {
        return handleRouteError(error);
    }
}
