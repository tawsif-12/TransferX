import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/middleware';
import { successResponse, errorResponse, handleRouteError } from '@/lib/response';

/**
 * GET /api/applications/[id]/outcome
 * Get transfer outcome for an application
 */
export async function GET(request, { params }) {
  try {
    const authUser = await requireAuth(request);
    if (authUser instanceof NextResponse) return authUser;

    const applicationId = parseInt(params.id);

    // Check if application exists and belongs to user
    const application = await prisma.transferRequest.findUnique({
      where: { id: applicationId },
      include: {
        outcome: true,
      },
    });

    if (!application) {
      return errorResponse('Application not found', 404);
    }

    // Check permissions
    if (authUser.userId !== application.userId && authUser.role !== 'ADMIN') {
      return errorResponse('Unauthorized to view this outcome', 403);
    }

    if (!application.outcome) {
      return errorResponse('No outcome available for this application yet', 404);
    }

    return successResponse(application.outcome);
  } catch (error) {
    return handleRouteError(error);
  }
}
