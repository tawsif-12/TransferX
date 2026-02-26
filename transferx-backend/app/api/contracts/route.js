import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse, handleRouteError } from '@/lib/response';
import { requireAuth } from '@/lib/middleware';

/**
 * GET /api/contracts
 * List all contracts (admin only)
 */
export async function GET(request) {
    try {
        const auth = await requireAuth(request);
        if (auth instanceof NextResponse) return auth;

        if (auth.role !== 'ADMIN') {
            return errorResponse('Only admin can list all contracts', 403);
        }

        const contracts = await prisma.contract.findMany({
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

/**
 * POST /api/contracts
 * Create a new contract (admin only)
 */
export async function POST(request) {
    try {
        const auth = await requireAuth(request);
        if (auth instanceof NextResponse) return auth;

        if (auth.role !== 'ADMIN') {
            return errorResponse('Only admin can create contracts', 403);
        }

        const body = await request.json();
        const {
            player_id,
            club_id,
            start_date,
            end_date,
            salary,
        } = body;

        // Validate required fields
        if (!player_id || !club_id || !start_date || !end_date) {
            return errorResponse(
                'Missing required fields: player_id, club_id, start_date, end_date',
                400
            );
        }

        const playerId = parseInt(player_id);
        const clubId = parseInt(club_id);

        // Verify entities exist
        const [player, club] = await Promise.all([
            prisma.player.findUnique({ where: { player_id: playerId } }),
            prisma.club.findUnique({ where: { club_id: clubId } }),
        ]);

        if (!player) return errorResponse('Player not found', 404);
        if (!club) return errorResponse('Club not found', 404);

        const contract = await prisma.contract.create({
            data: {
                player_id: playerId,
                club_id: clubId,
                start_date: new Date(start_date),
                end_date: new Date(end_date),
                salary: salary ? parseFloat(salary) : null,
            },
            include: {
                player: true,
                club: {
                    include: {
                        league: true,
                    },
                },
            },
        });

        return successResponse(contract, 201);
    } catch (error) {
        return handleRouteError(error);
    }
}
