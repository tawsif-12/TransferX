import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, handleRouteError } from '@/lib/response';

/**
 * GET /api/players
 * Get all players
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const position = searchParams.get('position');
    const nationality = searchParams.get('nationality');
    const minRating = searchParams.get('minRating');
    const maxMarketValue = searchParams.get('maxMarketValue');

    const where = {};
    
    if (position) where.position = position;
    if (nationality) where.nationality = nationality;
    if (minRating) where.rating = { gte: parseFloat(minRating) };
    if (maxMarketValue) where.marketValue = { lte: parseFloat(maxMarketValue) };

    const players = await prisma.playerProfile.findMany({
      where,
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
      take: 100, // Limit to 100 results
    });

    return successResponse(players);
  } catch (error) {
    return handleRouteError(error);
  }
}
