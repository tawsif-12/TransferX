import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse, handleRouteError } from '@/lib/response';
import { requireAuth } from '@/lib/middleware';
import { getClubs as getClubsFromDB } from '@/lib/dataQueries';

/**
 * GET /api/clubs
 * List all clubs with league info
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name');
    const leagueId = searchParams.get('leagueId');
    const country = searchParams.get('country');

    const filters = {
      ...(name && { name }),
      ...(leagueId && { leagueId }),
      ...(country && { country })
    };

    try {
      const result = await getClubsFromDB(filters);
      if (result.success) {
        return successResponse(result.data);
      } else {
        console.error('Database query failed:', result.error);
        return successResponse([], 200);
      }
    } catch (err) {
      console.error('Query failed:', err.message);
      return successResponse([], 200);
    }
  } catch (error) {
    return handleRouteError(error);
  }
}

/**
 * POST /api/clubs
 * Create a new club (admin only)
 */
export async function POST(request) {
  try {
    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) return auth;

    if (auth.role !== 'ADMIN') {
      return errorResponse('Only admin can create clubs', 403);
    }

    const body = await request.json();
    const { league_id, name, country, founded_year } = body;

    // Validate required fields
    if (!league_id || !name || !country) {
      return errorResponse('Missing required fields: league_id, name, country', 400);
    }

    // Verify league exists
    const league = await prisma.league.findUnique({
      where: { league_id: parseInt(league_id) },
    });

    if (!league) {
      return errorResponse('League not found', 404);
    }

    const club = await prisma.club.create({
      data: {
        league_id: parseInt(league_id),
        name,
        country,
        founded_year: founded_year ? parseInt(founded_year) : null,
      },
      include: {
        league: true,
      },
    });

    return successResponse(club, 201);
  } catch (error) {
    return handleRouteError(error);
  }
}
