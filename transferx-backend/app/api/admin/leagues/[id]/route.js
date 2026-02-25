import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/middleware';
import { successResponse, errorResponse, handleRouteError } from '@/lib/response';
import { validateData, leagueCreateSchema } from '@/lib/validation';

/**
 * PUT /api/admin/leagues/[id]
 * Update a league (admin only)
 */
export async function PUT(request, { params }) {
  try {
    const authUser = await requireAuth(request, 'ADMIN');
    if (authUser instanceof NextResponse) return authUser;

    const leagueId = parseInt(params.id);
    const body = await request.json();
    
    // Validate input
    const validation = validateData(leagueCreateSchema.partial(), body);
    if (!validation.success) {
      return errorResponse(validation.errors, 400);
    }

    const league = await prisma.league.update({
      where: { id: leagueId },
      data: validation.data,
    });

    return successResponse(league);
  } catch (error) {
    return handleRouteError(error);
  }
}

/**
 * DELETE /api/admin/leagues/[id]
 * Soft delete a league (set isActive = false)
 */
export async function DELETE(request, { params }) {
  try {
    const authUser = await requireAuth(request, 'ADMIN');
    if (authUser instanceof NextResponse) return authUser;

    const leagueId = parseInt(params.id);

    const league = await prisma.league.update({
      where: { id: leagueId },
      data: { isActive: false },
    });

    return successResponse(league);
  } catch (error) {
    return handleRouteError(error);
  }
}
