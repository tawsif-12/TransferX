import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse, handleRouteError } from '@/lib/response';

/**
 * GET /api/clubs/[id]/players
 * Get all players in a club
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

    // Get players from Player model
    const players = await prisma.player.findMany({
      where: {
        current_club_id: clubId,
      },
      include: {
        current_club: {
          include: {
            league: true,
          },
        },
      },
      orderBy: {
        position: 'asc',
      },
    });

    return successResponse(players);
  } catch (error) {
    return handleRouteError(error);
  }
}
