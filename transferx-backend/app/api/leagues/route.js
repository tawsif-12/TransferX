import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse, handleRouteError } from '@/lib/response';
import { requireAuth } from '@/lib/middleware';
import { getLeagues as getLeaguesFromDB } from '@/lib/dataQueries';

/**
 * GET /api/leagues
 * List all leagues with their clubs
 */
export async function GET(request) {
  try {
    try {
      const result = await getLeaguesFromDB();
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
 * POST /api/leagues
 * Create a new league (admin only)
 */
export async function POST(request) {
  try {
    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) return auth;

    if (auth.role !== 'ADMIN') {
      return errorResponse('Only admin can create leagues', 403);
    }

    const body = await request.json();
    const { name, country } = body;

    // Validate required fields
    if (!name || !country) {
      return errorResponse('Missing required fields: name, country', 400);
    }

    const league = await prisma.league.create({
      data: {
        name,
        country,
      },
      include: {
        clubs: true,
      },
    });

    return successResponse(league, 201);
  } catch (error) {
    return handleRouteError(error);
  }
}
