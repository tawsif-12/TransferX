import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/middleware';
import { successResponse, errorResponse, handleRouteError } from '@/lib/response';

/**
 * GET /api/admin/documents
 * Get all documents for verification (admin only)
 */
export async function GET(request) {
  try {
    const authUser = await requireAuth(request, 'ADMIN');
    if (authUser instanceof NextResponse) return authUser;

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const where = {};
    if (status) where.status = status;

    const documents = await prisma.playerDocument.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
          },
        },
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
