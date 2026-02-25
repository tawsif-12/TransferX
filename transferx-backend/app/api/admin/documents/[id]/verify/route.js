import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/middleware';
import { successResponse, errorResponse, handleRouteError } from '@/lib/response';

/**
 * PUT /api/admin/documents/[id]/verify
 * Verify or reject a document (admin only)
 */
export async function PUT(request, { params }) {
  try {
    const authUser = await requireAuth(request, 'ADMIN');
    if (authUser instanceof NextResponse) return authUser;

    const documentId = parseInt(params.id);
    const body = await request.json();
    
    const { status, note } = body;

    if (!status || !['VERIFIED', 'REJECTED'].includes(status)) {
      return errorResponse('Status must be VERIFIED or REJECTED', 400);
    }

    const document = await prisma.playerDocument.update({
      where: { id: documentId },
      data: {
        status,
        verificationNote: note || null,
        verifiedBy: authUser.userId,
        verifiedAt: new Date(),
      },
    });

    return successResponse(document);
  } catch (error) {
    return handleRouteError(error);
  }
}
