import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse, handleRouteError } from '@/lib/response';

/**
 * GET /api/clubs/:id/contracts
 * Get all contracts for a club
 */
export async function GET(request, { params }) {
    try {
        const { id } = await params;
        const clubId = parseInt(id);

        // Verify club exists
        const club = await prisma.club.findUnique({
            where: { club_id: clubId },
        });

        if (!club) {
            return errorResponse('Club not found', 404);
        }

        const contracts = await prisma.contract.findMany({
            where: { club_id: clubId },
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
