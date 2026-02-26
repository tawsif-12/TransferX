import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse, handleRouteError } from '@/lib/response';

/**
 * GET /api/clubs/:id/transfers
 * Get all transfers involving this club (from or to)
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

        const transfers = await prisma.transfer.findMany({
            where: {
                OR: [
                    { from_club_id: clubId },
                    { to_club_id: clubId },
                ],
            },
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
            orderBy: {
                transfer_date: 'desc',
            },
        });

        return successResponse(transfers);
    } catch (error) {
        return handleRouteError(error);
    }
}
