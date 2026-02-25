import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, handleRouteError } from '@/lib/response';

/**
 * GET /api/opportunities
 * Get all active transfer opportunities
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const position = searchParams.get('position');
    const clubId = searchParams.get('clubId');
    const leagueId = searchParams.get('leagueId');

    const where = {
      isActive: true,
      OR: [
        { endDate: null },
        { endDate: { gte: new Date() } },
      ],
    };
    
    if (position) where.position = position;
    if (clubId) where.clubId = parseInt(clubId);
    if (leagueId) {
      where.club = {
        leagueId: parseInt(leagueId),
      };
    }

    const opportunities = await prisma.transferOpportunity.findMany({
      where,
      include: {
        club: {
          include: {
            league: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return successResponse(opportunities);
  } catch (error) {
    return handleRouteError(error);
  }
}
