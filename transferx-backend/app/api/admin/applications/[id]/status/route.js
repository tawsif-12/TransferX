import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/middleware';
import { successResponse, errorResponse, handleRouteError } from '@/lib/response';

/**
 * PUT /api/admin/applications/[id]/status
 * Update application status (admin only)
 */
export async function PUT(request, { params }) {
  try {
    const authUser = await requireAuth(request, 'ADMIN');
    if (authUser instanceof NextResponse) return authUser;

    const applicationId = parseInt(params.id);
    const body = await request.json();
    
    const { status, adminNotes } = body;

    const validStatuses = ['PENDING', 'UNDER_REVIEW', 'NEGOTIATING', 'ACCEPTED', 'REJECTED', 'COMPLETED'];
    
    if (!status || !validStatuses.includes(status)) {
      return errorResponse(`Status must be one of: ${validStatuses.join(', ')}`, 400);
    }

    const application = await prisma.transferRequest.update({
      where: { id: applicationId },
      data: {
        status,
        adminNotes: adminNotes || undefined,
        reviewedBy: authUser.userId,
        reviewedAt: new Date(),
      },
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
      },
    });

    return successResponse(application);
  } catch (error) {
    return handleRouteError(error);
  }
}
