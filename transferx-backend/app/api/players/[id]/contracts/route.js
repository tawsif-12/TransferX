import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse, handleRouteError } from '@/lib/response';

/**
 * GET /api/players/:id/contracts
 * Get all contracts for a player
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

        const contracts = await prisma.contract.findMany({
            where: { player_id: playerId },
            include: {
                player: true,
                club: {
                    include: {
                        league: true,
                    },
                },
            },
            orderBy: {
                start_date: 'desc',
            },
        });

        return successResponse(contracts);
    } catch (error) {
        return handleRouteError(error);
    }
}
