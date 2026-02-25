import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse, handleRouteError } from '@/lib/response';

/**
 * GET /api/clubs/[id]/ratings
 * Get ratings summary and reviews for a club
 */
export async function GET(request, { params }) {
  try {
    const clubId = parseInt(params.id);

    // Check if club exists
    const club = await prisma.club.findUnique({
      where: { id: clubId },
    });

    if (!club) {
      return errorResponse('Club not found', 404);
    }

    // Get aggregate ratings
    const aggregateData = await prisma.clubRating.aggregate({
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
      _count: {
        id: true,
      },
    });

    // Get individual ratings
    const ratings = await prisma.clubRating.findMany({
      where: {
        clubId,
        isApproved: true,
      },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20, // Limit to 20 most recent
    });

    // Hide user info if anonymous
    const sanitizedRatings = ratings.map(r => {
      if (r.isAnonymous) {
        return {
          ...r,
          user: {
            id: null,
            fullName: 'Anonymous',
          },
        };
      }
      return r;
    });

    return successResponse({
      clubId,
      clubName: club.name,
      summary: {
        averageRating: aggregateData._avg.rating || 0,
        averageProfessionalism: aggregateData._avg.professionalism || 0,
        averageFacilities: aggregateData._avg.facilities || 0,
        averageCommunication: aggregateData._avg.communication || 0,
        totalRatings: aggregateData._count.id,
      },
      ratings: sanitizedRatings,
    });
  } catch (error) {
    return handleRouteError(error);
  }
}
