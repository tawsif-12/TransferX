import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/middleware';
import { successResponse, errorResponse, handleRouteError } from '@/lib/response';

/**
 * GET /api/admin/ratings
 * Get all ratings for moderation (admin only)
 */
export async function GET(request) {
  try {
    const authUser = await requireAuth(request, 'ADMIN');
    if (authUser instanceof NextResponse) return authUser;

    const { searchParams } = new URL(request.url);
    const isApproved = searchParams.get('isApproved');

    const where = {};
    if (isApproved !== null) where.isApproved = isApproved === 'true';

    const ratings = await prisma.clubRating.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        club: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return successResponse(ratings);
  } catch (error) {
    return handleRouteError(error);
  }
}
