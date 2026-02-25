import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/middleware';
import { successResponse, errorResponse, handleRouteError } from '@/lib/response';
import { validateData, transferRequestSchema } from '@/lib/validation';

/**
 * GET /api/applications
 * Get current user's transfer requests
 */
export async function GET(request) {
  try {
    const authUser = await requireAuth(request);
    if (authUser instanceof NextResponse) return authUser;

    const applications = await prisma.transferRequest.findMany({
      where: {
        userId: authUser.userId,
      },
      include: {
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

/**
 * POST /api/applications
 * Create a new transfer request
 */
export async function POST(request) {
  try {
    const authUser = await requireAuth(request);
    if (authUser instanceof NextResponse) return authUser;

    // Only players can create transfer requests
    if (authUser.role !== 'PLAYER') {
      return errorResponse('Only players can submit transfer requests', 403);
    }

    const body = await request.json();
    
    // Validate input
    const validation = validateData(transferRequestSchema, body);
    if (!validation.success) {
      return errorResponse(validation.errors, 400);
    }

    const data = validation.data;

    // Check if club exists
    const club = await prisma.club.findUnique({
      where: { id: data.clubId },
    });

    if (!club) {
      return errorResponse('Club not found', 404);
    }

    // Create transfer request
    const application = await prisma.transferRequest.create({
      data: {
        userId: authUser.userId,
        clubId: data.clubId,
        leagueId: data.leagueId,
        proposedFee: data.proposedFee,
        proposedSalary: data.proposedSalary,
        contractLength: data.contractLength,
        transferWindow: data.transferWindow,
        coverLetter: data.coverLetter,
        status: 'PENDING',
      },
      include: {
        club: {
          include: {
            league: true,
          },
        },
      },
    });

    return successResponse(application, 201);
  } catch (error) {
    return handleRouteError(error);
  }
}
