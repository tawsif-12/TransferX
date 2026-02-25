import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/middleware';
import { successResponse, errorResponse, handleRouteError } from '@/lib/response';
import { validateData, ratingSchema } from '@/lib/validation';

/**
 * POST /api/ratings/club/[id]
 * Create a rating for a club
 */
export async function POST(request, { params }) {
  try {
    const authUser = await requireAuth(request);
    if (authUser instanceof NextResponse) return authUser;

    const clubId = parseInt(params.id);
    const body = await request.json();
    
    // Validate input
    const validation = validateData(ratingSchema, body);
    if (!validation.success) {
      return errorResponse(validation.errors, 400);
    }

    const { rating, review, professionalism, facilities, communication, isAnonymous } = validation.data;

    // Check if club exists
    const club = await prisma.club.findUnique({
      where: { id: clubId },
    });

    if (!club) {
      return errorResponse('Club not found', 404);
    }

    // Optional: Verify user has a completed transfer with this club
    // (You can enable this check if needed)
    const hasTransfer = await prisma.transferRequest.findFirst({
      where: {
        userId: authUser.userId,
        clubId,
        status: 'COMPLETED',
      },
    });

    if (!hasTransfer) {
      return errorResponse(
        'You can only rate clubs where you have completed a transfer',
        403
      );
    }

    // Check if user already rated this club for this transfer
    const existingRating = await prisma.clubRating.findFirst({
      where: {
        userId: authUser.userId,
        clubId,
        transferRequestId: hasTransfer.id,
      },
    });

    if (existingRating) {
      return errorResponse('You have already rated this club for this transfer', 409);
    }

    // Create rating
    const clubRating = await prisma.clubRating.create({
      data: {
        userId: authUser.userId,
        clubId,
        transferRequestId: hasTransfer.id,
        rating,
        review,
        professionalism,
        facilities,
        communication,
        isAnonymous: isAnonymous || false,
        isApproved: true, // Auto-approve, or set to false for moderation
      },
    });

    return successResponse(clubRating, 201);
  } catch (error) {
    return handleRouteError(error);
  }
}
