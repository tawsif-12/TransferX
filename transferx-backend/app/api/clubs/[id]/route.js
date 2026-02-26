import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse, handleRouteError } from '@/lib/response';
import { requireAuth } from '@/lib/middleware';

/**
 * GET /api/clubs/:id
 * Get club detail with current players and contracts
 */
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const clubId = parseInt(id);

    const club = await prisma.club.findUnique({
      where: { club_id: clubId },
      include: {
        league: true,
        players: {
          include: {
            agents: {
              include: {
                agent: true,
              },
            },
          },
        },
        contracts: {
          include: {
            player: true,
          },
        },
      },
    });

    if (!club) {
      return errorResponse('Club not found', 404);
    }

    return successResponse(club);
  } catch (error) {
    return handleRouteError(error);
  }
}

/**
 * PUT /api/clubs/:id
 * Update club (admin only)
 */
export async function PUT(request, { params }) {
  try {
    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) return auth;

    if (auth.role !== 'ADMIN') {
      return errorResponse('Only admin can update clubs', 403);
    }

    const { id } = await params;
    const clubId = parseInt(id);
    const body = await request.json();
    const { name, country, founded_year } = body;

    // Verify club exists
    const existingClub = await prisma.club.findUnique({
      where: { club_id: clubId },
    });

    if (!existingClub) {
      return errorResponse('Club not found', 404);
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (country !== undefined) updateData.country = country;
    if (founded_year !== undefined) updateData.founded_year = founded_year ? parseInt(founded_year) : null;

    const club = await prisma.club.update({
      where: { club_id: clubId },
      data: updateData,
      include: {
        league: true,
      },
    });

    return successResponse(club);
  } catch (error) {
    return handleRouteError(error);
  }
}

/**
 * DELETE /api/clubs/:id
 * Delete club (admin only)
 */
export async function DELETE(request, { params }) {
  try {
    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) return auth;

    if (auth.role !== 'ADMIN') {
      return errorResponse('Only admin can delete clubs', 403);
    }

    const { id } = await params;
    const clubId = parseInt(id);

    // Verify club exists
    const club = await prisma.club.findUnique({
      where: { club_id: clubId },
    });

    if (!club) {
      return errorResponse('Club not found', 404);
    }

    // Delete club and cascade to related records
    await prisma.club.delete({
      where: { club_id: clubId },
    });

    return successResponse({ message: 'Club deleted successfully' });
  } catch (error) {
    return handleRouteError(error);
  }
}
