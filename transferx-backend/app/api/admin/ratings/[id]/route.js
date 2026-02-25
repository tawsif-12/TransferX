import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/middleware';
import { successResponse, errorResponse, handleRouteError } from '@/lib/response';

/**
 * PUT /api/admin/ratings/[id]
 * Approve or reject a rating (admin only)
 */
export async function PUT(request, { params }) {
  try {
    const authUser = await requireAuth(request, 'ADMIN');
    if (authUser instanceof NextResponse) return authUser;

    const ratingId = parseInt(params.id);
    const body = await request.json();
    
    const { isApproved } = body;

    if (typeof isApproved !== 'boolean') {
      return errorResponse('isApproved field is required (boolean)', 400);
    }

    const rating = await prisma.clubRating.update({
      where: { id: ratingId },
      data: { isApproved },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
          },
        },
        club: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return successResponse(rating);
  } catch (error) {
    return handleRouteError(error);
  }
}
