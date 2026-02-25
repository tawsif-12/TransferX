import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/middleware';
import { successResponse, errorResponse, handleRouteError } from '@/lib/response';
import { validateData, clubCreateSchema } from '@/lib/validation';

/**
 * PUT /api/admin/clubs/[id]
 * Update a club (admin only)
 */
export async function PUT(request, { params }) {
  try {
    const authUser = await requireAuth(request, 'ADMIN');
    if (authUser instanceof NextResponse) return authUser;

    const clubId = parseInt(params.id);
    const body = await request.json();
    
    // Validate input
    const validation = validateData(clubCreateSchema.partial(), body);
    if (!validation.success) {
      return errorResponse(validation.errors, 400);
    }

    const club = await prisma.club.update({
      where: { id: clubId },
      data: validation.data,
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
 * DELETE /api/admin/clubs/[id]
 * Soft delete a club (set isActive = false)
 */
export async function DELETE(request, { params }) {
  try {
    const authUser = await requireAuth(request, 'ADMIN');
    if (authUser instanceof NextResponse) return authUser;

    const clubId = parseInt(params.id);

    const club = await prisma.club.update({
      where: { id: clubId },
      data: { isActive: false },
    });

    return successResponse(club);
  } catch (error) {
    return handleRouteError(error);
  }
}
