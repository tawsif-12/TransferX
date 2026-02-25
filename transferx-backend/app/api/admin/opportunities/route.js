import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/middleware';
import { successResponse, errorResponse, handleRouteError } from '@/lib/response';
import { validateData, transferOpportunitySchema } from '@/lib/validation';

/**
 * POST /api/admin/opportunities
 * Create transfer opportunity (admin only)
 */
export async function POST(request) {
  try {
    const authUser = await requireAuth(request, 'ADMIN');
    if (authUser instanceof NextResponse) return authUser;

    const body = await request.json();
    
    // Validate input
    const validation = validateData(transferOpportunitySchema, body);
    if (!validation.success) {
      return errorResponse(validation.errors, 400);
    }

    const data = validation.data;
    
    // Convert endDate string to Date if provided
    if (data.endDate) {
      data.endDate = new Date(data.endDate);
    }

    const opportunity = await prisma.transferOpportunity.create({
      data,
      include: {
        club: {
          include: {
            league: true,
          },
        },
      },
    });

    return successResponse(opportunity, 201);
  } catch (error) {
    return handleRouteError(error);
  }
}

/**
 * GET /api/admin/opportunities
 * Get all opportunities including inactive (admin only)
 */
export async function GET(request) {
  try {
    const authUser = await requireAuth(request, 'ADMIN');
    if (authUser instanceof NextResponse) return authUser;

    const opportunities = await prisma.transferOpportunity.findMany({
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
