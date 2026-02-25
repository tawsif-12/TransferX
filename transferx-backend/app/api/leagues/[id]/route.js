import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse, handleRouteError } from '@/lib/response';

/**
 * GET /api/leagues/[id]
 * Get single league by ID
 */
export async function GET(request, { params }) {
  try {
    const leagueId = parseInt(params.id);

    const league = await prisma.league.findUnique({
      where: { id: leagueId },
      include: {
        clubs: {
          where: {
            isActive: true,
          },
          orderBy: {
            name: 'asc',
          },
        },
      },
    });

    if (!league) {
      return errorResponse('League not found', 404);
    }

    return successResponse(league);
  } catch (error) {
    return handleRouteError(error);
  }
}
