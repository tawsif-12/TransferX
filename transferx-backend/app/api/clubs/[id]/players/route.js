import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse, handleRouteError } from '@/lib/response';

/**
 * GET /api/clubs/[id]/players
 * Get all players in a club
 */
export async function GET(request, { params }) {
  try {
    const clubId = parseInt(params.id);

    // Verify club exists
    const club = await prisma.club.findUnique({
      where: { id: clubId },
    });

    if (!club) {
      return errorResponse('Club not found', 404);
    }

    const players = await prisma.playerProfile.findMany({
      where: {
        currentClubId: clubId,
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        currentClub: {
          include: {
            league: true,
          },
        },
      },
      orderBy: {
        rating: 'desc',
      },
    });

    return successResponse(players);
  } catch (error) {
    return handleRouteError(error);
  }
}
