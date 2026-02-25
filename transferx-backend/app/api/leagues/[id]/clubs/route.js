import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse, handleRouteError } from '@/lib/response';

/**
 * GET /api/leagues/[id]/clubs
 * Get all clubs in a league
 */
export async function GET(request, { params }) {
  try {
    const leagueId = parseInt(params.id);

    // Verify league exists
    const league = await prisma.league.findUnique({
      where: { id: leagueId },
    });

    if (!league) {
      return errorResponse('League not found', 404);
    }

    const clubs = await prisma.club.findMany({
      where: {
        leagueId,
        isActive: true,
      },
      include: {
        league: true,
        _count: {
          select: {
            players: true,
            transferOpportunities: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    return successResponse(clubs);
  } catch (error) {
    return handleRouteError(error);
  }
}
