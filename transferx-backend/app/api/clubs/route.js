import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, handleRouteError } from '@/lib/response';

/**
 * GET /api/clubs
 * Get all clubs
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const leagueId = searchParams.get('leagueId');
    const country = searchParams.get('country');
    const search = searchParams.get('search');

    const where = {
      isActive: true,
    };
    
    if (leagueId) where.leagueId = parseInt(leagueId);
    if (country) where.country = country;
    if (search) {
      where.name = {
        contains: search,
        mode: 'insensitive',
      };
    }

    const clubs = await prisma.club.findMany({
      where,
      include: {
        league: true,
        _count: {
          select: {
            players: true,
            transferOpportunities: true,
            ratings: true,
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
