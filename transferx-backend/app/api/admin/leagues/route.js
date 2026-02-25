import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/middleware';
import { successResponse, errorResponse, handleRouteError } from '@/lib/response';
import { validateData, leagueCreateSchema } from '@/lib/validation';

/**
 * POST /api/admin/leagues
 * Create a new league (admin only)
 */
export async function POST(request) {
  try {
    const authUser = await requireAuth(request, 'ADMIN');
    if (authUser instanceof NextResponse) return authUser;

    const body = await request.json();
    
    // Validate input
    const validation = validateData(leagueCreateSchema, body);
    if (!validation.success) {
      return errorResponse(validation.errors, 400);
    }

    const league = await prisma.league.create({
      data: validation.data,
    });

    return successResponse(league, 201);
  } catch (error) {
    return handleRouteError(error);
  }
}

/**
 * GET /api/admin/leagues
 * Get all leagues including inactive (admin only)
 */
export async function GET(request) {
  try {
    const authUser = await requireAuth(request, 'ADMIN');
    if (authUser instanceof NextResponse) return authUser;

    const leagues = await prisma.league.findMany({
      include: {
        _count: {
          select: { clubs: true },
        },
      },
      orderBy: [
        { tier: 'asc' },
        { name: 'asc' },
      ],
    });

    return successResponse(leagues);
  } catch (error) {
    return handleRouteError(error);
  }
}
