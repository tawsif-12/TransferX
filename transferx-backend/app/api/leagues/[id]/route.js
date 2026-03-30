import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse, handleRouteError } from '@/lib/response';
import { requireAuth } from '@/lib/middleware';
import { getLeagueById } from '@/lib/dataQueries';

/**
 * GET /api/leagues/:id
 * Get league detail
 */
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const leagueId = parseInt(id);

    try {
      const result = await getLeagueById(leagueId);
      if (result.success && result.data) {
        return successResponse(result.data);
      } else {
        return errorResponse('League not found', 404);
      }
    } catch (err) {
      console.error('Query failed:', err.message);
      return errorResponse('Failed to fetch league', 500);
    }
  } catch (error) {
    return handleRouteError(error);
  }
}

/**
 * PUT /api/leagues/:id
 * Update league (admin only)
 */
export async function PUT(request, { params }) {
  try {
    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) return auth;

    if (auth.role !== 'ADMIN') {
      return errorResponse('Only admin can update leagues', 403);
    }

    const { id } = await params;
    const leagueId = parseInt(id);
    const body = await request.json();
    const { name, country } = body;

    // Verify league exists
    const existingLeague = await prisma.league.findUnique({
      where: { league_id: leagueId },
    });

    if (!existingLeague) {
      return errorResponse('League not found', 404);
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (country !== undefined) updateData.country = country;

    const league = await prisma.league.update({
      where: { league_id: leagueId },
      data: updateData,
      include: {
        clubs: true,
      },
    });

    return successResponse(league);
  } catch (error) {
    return handleRouteError(error);
  }
}

/**
 * DELETE /api/leagues/:id
 * Delete league (admin only)
 */
export async function DELETE(request, { params }) {
  try {
    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) return auth;

    if (auth.role !== 'ADMIN') {
      return errorResponse('Only admin can delete leagues', 403);
    }

    const { id } = await params;
    const leagueId = parseInt(id);

    // Verify league exists
    const league = await prisma.league.findUnique({
      where: { league_id: leagueId },
    });

    if (!league) {
      return errorResponse('League not found', 404);
    }

    // Delete league (cascades will delete clubs and related records)
    await prisma.league.delete({
      where: { league_id: leagueId },
    });

    return successResponse({ message: 'League deleted successfully' });
  } catch (error) {
    return handleRouteError(error);
  }
}
