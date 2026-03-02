import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/middleware';
import { successResponse, errorResponse, handleRouteError } from '@/lib/response';

/**
 * GET /api/admin/transfers/[id]
 * Get transfer details with full history
 */
export async function GET(request, { params }) {
  try {
    const authUser = await requireAuth(request, 'ADMIN');
    if (authUser instanceof NextResponse) return authUser;

    const transferId = parseInt(params.id);

    const transfer = await prisma.transfer.findUnique({
      where: { transfer_id: transferId },
      include: {
        player: {
          include: {
            current_club: true,
          },
        },
        from_club: {
          include: {
            league: true,
          },
        },
        to_club: {
          include: {
            league: true,
          },
        },
        transfer_history: true,
      },
    });

    if (!transfer) {
      return errorResponse('Transfer not found', 404);
    }

    return successResponse(transfer);
  } catch (error) {
    return handleRouteError(error);
  }
}

/**
 * PUT /api/admin/transfers/[id]
 * Update a transfer
 */
export async function PUT(request, { params }) {
  try {
    const authUser = await requireAuth(request, 'ADMIN');
    if (authUser instanceof NextResponse) return authUser;

    const transferId = parseInt(params.id);
    const body = await request.json();

    const {
      player_id,
      from_club_id,
      to_club_id,
      transfer_fee,
      transfer_date,
      transfer_type,
    } = body;

    // Check if transfer exists
    const existingTransfer = await prisma.transfer.findUnique({
      where: { transfer_id: transferId },
    });

    if (!existingTransfer) {
      return errorResponse('Transfer not found', 404);
    }

    // Validate transfer fee is not negative
    if (transfer_fee !== null && transfer_fee !== undefined && parseFloat(transfer_fee) < 0) {
      return errorResponse('Transfer fee cannot be negative', 400);
    }

    const updateData = {};
    if (player_id !== undefined) updateData.player_id = parseInt(player_id);
    if (from_club_id !== undefined) updateData.from_club_id = parseInt(from_club_id);
    if (to_club_id !== undefined) updateData.to_club_id = parseInt(to_club_id);
    if (transfer_fee !== undefined) updateData.transfer_fee = transfer_fee ? parseFloat(transfer_fee) : null;
    if (transfer_date !== undefined) updateData.transfer_date = new Date(transfer_date);
    if (transfer_type !== undefined) updateData.transfer_type = transfer_type;

    const transfer = await prisma.transfer.update({
      where: { transfer_id: transferId },
      data: updateData,
      include: {
        player: true,
        from_club: true,
        to_club: true,
        transfer_history: true,
      },
    });

    return successResponse(transfer);
  } catch (error) {
    return handleRouteError(error);
  }
}

/**
 * DELETE /api/admin/transfers/[id]
 * Delete a transfer
 */
export async function DELETE(request, { params }) {
  try {
    const authUser = await requireAuth(request, 'ADMIN');
    if (authUser instanceof NextResponse) return authUser;

    const transferId = parseInt(params.id);

    // Check if transfer exists
    const transfer = await prisma.transfer.findUnique({
      where: { transfer_id: transferId },
      include: {
        transfer_history: true,
      },
    });

    if (!transfer) {
      return errorResponse('Transfer not found', 404);
    }

    // Delete in transaction to maintain referential integrity
    await prisma.$transaction(async (tx) => {
      // Delete transfer history first
      await tx.transferHistory.deleteMany({
        where: { transfer_id: transferId },
      });

      // Delete the transfer
      await tx.transfer.delete({
        where: { transfer_id: transferId },
      });
    });

    return successResponse({ message: 'Transfer deleted successfully' });
  } catch (error) {
    return handleRouteError(error);
  }
}
