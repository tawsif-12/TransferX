import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/middleware';
import { successResponse, handleRouteError } from '@/lib/response';

/**
 * GET /api/documents/list
 * Get current user's documents
 */
export async function GET(request) {
  try {
    const authUser = await requireAuth(request);
    if (authUser instanceof NextResponse) return authUser;

    const documents = await prisma.playerDocument.findMany({
      where: {
        userId: authUser.userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return successResponse(documents);
  } catch (error) {
    return handleRouteError(error);
  }
}
