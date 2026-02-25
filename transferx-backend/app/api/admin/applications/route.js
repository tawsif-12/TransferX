import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/middleware';
import { successResponse, handleRouteError } from '@/lib/response';

/**
 * GET /api/admin/applications
 * Get all applications (admin only)
 */
export async function GET(request) {
  try {
    const authUser = await requireAuth(request, 'ADMIN');
    if (authUser instanceof NextResponse) return authUser;

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const clubId = searchParams.get('clubId');

    const where = {};
    if (status) where.status = status;
    if (clubId) where.clubId = parseInt(clubId);

    const applications = await prisma.transferRequest.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            playerProfile: true,
          },
        },
        club: {
          include: {
            league: true,
          },
        },
        outcome: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return successResponse(applications);
  } catch (error) {
    return handleRouteError(error);
  }
}
