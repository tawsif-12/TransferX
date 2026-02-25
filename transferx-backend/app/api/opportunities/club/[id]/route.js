import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse, handleRouteError } from '@/lib/response';

/**
 * GET /api/opportunities/club/[id]
 * Get transfer opportunities for a specific club
 */
export async function GET(request, { params }) {
  try {
    const clubId = parseInt(params.id);

    const club = await prisma.club.findUnique({
      where: { id: clubId },
    });

    if (!club) {
      return errorResponse('Club not found', 404);
    }

    const opportunities = await prisma.transferOpportunity.findMany({
      where: {
        clubId,
        isActive: true,
        OR: [
          { endDate: null },
          { endDate: { gte: new Date() } },
        ],
      },
      include: {
        club: {
          include: {
            league: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return successResponse(opportunities);
  } catch (error) {
    return handleRouteError(error);
  }
}
