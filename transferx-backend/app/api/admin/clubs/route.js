import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/middleware';
import { successResponse, errorResponse, handleRouteError } from '@/lib/response';
import { validateData, clubCreateSchema } from '@/lib/validation';

/**
 * POST /api/admin/clubs
 * Create a new club (admin only)
 */
export async function POST(request) {
  try {
    const authUser = await requireAuth(request, 'ADMIN');
    if (authUser instanceof NextResponse) return authUser;

    const body = await request.json();
    
    // Validate input
    const validation = validateData(clubCreateSchema, body);
    if (!validation.success) {
      return errorResponse(validation.errors, 400);
    }

    const club = await prisma.club.create({
      data: validation.data,
      include: {
        league: true,
      },
    });

    return successResponse(club, 201);
  } catch (error) {
    return handleRouteError(error);
  }
}

/**
 * GET /api/admin/clubs
 * Get all clubs including inactive (admin only)
 */
export async function GET(request) {
  try {
    const authUser = await requireAuth(request, 'ADMIN');
    if (authUser instanceof NextResponse) return authUser;

    const clubs = await prisma.club.findMany({
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
