import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse, handleRouteError } from '@/lib/response';

/**
 * GET /api/players/:id/transfer-history
 * Get full transfer history of a player ordered by transfer_date DESC
 */
export async function GET(request, { params }) {
    try {
        const { id } = await params;
        const playerId = parseInt(id);

        // Verify player exists
        const player = await prisma.player.findUnique({
            where: { player_id: playerId },
        });

        if (!player) {
            return errorResponse('Player not found', 404);
        }

        const transferHistory = await prisma.transferHistory.findMany({
            where: { player_id: playerId },
            include: {
                transfer: {
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
                    },
                },
            },
            orderBy: {
                transfer: {
                    transfer_date: 'desc',
                },
            },
        });

        return successResponse(transferHistory);
    } catch (error) {
        return handleRouteError(error);
    }
}
