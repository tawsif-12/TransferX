import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/middleware';
import { successResponse, errorResponse, handleRouteError } from '@/lib/response';

/**
 * GET /api/applications/[id]
 * Get single transfer request by ID
 */
export async function GET(request, { params }) {
  try {
    const authUser = await requireAuth(request);
    if (authUser instanceof NextResponse) return authUser;

    const applicationId = parseInt(params.id);

    const application = await prisma.transferRequest.findUnique({
      where: { id: applicationId },
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
    });

    if (!application) {
      return errorResponse('Application not found', 404);
    }

    // Check permissions: user must own the application or be an admin
    if (authUser.userId !== application.userId && authUser.role !== 'ADMIN') {
      return errorResponse('Unauthorized to view this application', 403);
    }

    return successResponse(application);
  } catch (error) {
    return handleRouteError(error);
  }
}
