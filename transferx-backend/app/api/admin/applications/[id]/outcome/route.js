import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/middleware';
import { successResponse, errorResponse, handleRouteError } from '@/lib/response';

/**
 * POST /api/admin/applications/[id]/outcome
 * Create transfer outcome for an application (admin only)
 */
export async function POST(request, { params }) {
  try {
    const authUser = await requireAuth(request, 'ADMIN');
    if (authUser instanceof NextResponse) return authUser;

    const applicationId = parseInt(params.id);
    const body = await request.json();
    
    const { approved, finalFee, finalSalary, contractYears, notes } = body;

    if (typeof approved !== 'boolean') {
      return errorResponse('approved field is required (boolean)', 400);
    }

    // Check if application exists
    const application = await prisma.transferRequest.findUnique({
      where: { id: applicationId },
      include: {
        outcome: true,
      },
    });

    if (!application) {
      return errorResponse('Application not found', 404);
    }

    if (application.outcome) {
      return errorResponse('Outcome already exists for this application', 409);
    }

    const outcome = await prisma.transferOutcome.create({
      data: {
        transferRequestId: applicationId,
        approved,
        finalFee: finalFee || null,
        finalSalary: finalSalary || null,
        contractYears: contractYears || null,
        notes: notes || null,
      },
    });

    // Update application status
    await prisma.transferRequest.update({
      where: { id: applicationId },
      data: {
        status: approved ? 'COMPLETED' : 'REJECTED',
      },
    });

    return successResponse(outcome, 201);
  } catch (error) {
    return handleRouteError(error);
  }
}

/**
 * GET /api/admin/applications/[id]/outcome
 * Get outcome for an application
 */
export async function GET(request, { params }) {
  try {
    const authUser = await requireAuth(request, 'ADMIN');
    if (authUser instanceof NextResponse) return authUser;

    const applicationId = parseInt(params.id);

    const outcome = await prisma.transferOutcome.findUnique({
      where: { transferRequestId: applicationId },
      include: {
        transferRequest: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
              },
            },
            club: true,
          },
        },
      },
    });

    if (!outcome) {
      return errorResponse('Outcome not found', 404);
    }

    return successResponse(outcome);
  } catch (error) {
    return handleRouteError(error);
  }
}
