import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse, handleRouteError } from '@/lib/response';
import { requireAuth } from '@/lib/middleware';

/**
 * GET /api/leagues
 * List all leagues with their clubs
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name');
    const country = searchParams.get('country');

    const where = {};

    if (name) {
      where.name = { contains: name, mode: 'insensitive' };
    }

    if (country) {
      where.country = { contains: country, mode: 'insensitive' };
    }

    const leagues = await prisma.league.findMany({
      where,
      include: {
        clubs: true,
      },
      orderBy: { league_id: 'asc' },
    });

    return successResponse(leagues);
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
