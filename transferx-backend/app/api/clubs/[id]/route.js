import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse, handleRouteError } from '@/lib/response';

/**
 * GET /api/clubs/[id]
 * Get single club by ID
 */
export async function GET(request, { params }) {
  try {
    const clubId = parseInt(params.id);

    const club = await prisma.club.findUnique({
      where: { id: clubId },
      include: {
        league: true,
        manager: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        players: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
              },
            },
          },
        },
        transferOpportunities: {
          where: {
            isActive: true,
          },
        },
        _count: {
          select: {
            ratings: true,
          },
        },
      },
    });

    if (!club) {
      return errorResponse('Club not found', 404);
    }

    // Calculate average rating
    const ratingsData = await prisma.clubRating.aggregate({
      where: {
        clubId,
        isApproved: true,
      },
      _avg: {
        rating: true,
        professionalism: true,
        facilities: true,
        communication: true,
      },
    });

    return successResponse({
      ...club,
      averageRatings: ratingsData._avg,
    });
  } catch (error) {
    return handleRouteError(error);
  }
}
