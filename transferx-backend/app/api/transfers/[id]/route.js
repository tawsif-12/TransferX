import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse, handleRouteError } from '@/lib/response';
import { requireAuth } from '@/lib/middleware';

/**
 * GET /api/transfers/:id
 * Get transfer detail
 */
export async function GET(request, { params }) {
    try {
        const { id } = await params;
        const transferId = parseInt(id);

        const transfer = await prisma.transfer.findUnique({
            where: { transfer_id: transferId },
            include: {
                player: true,
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
 * PUT /api/transfers/:id
 * Update transfer (admin only)
 */
export async function PUT(request, { params }) {
    try {
        const auth = await requireAuth(request);
        if (auth instanceof NextResponse) return auth;

        if (auth.role !== 'ADMIN') {
            return errorResponse('Only admin can update transfers', 403);
        }

        const { id } = await params;
        const transferId = parseInt(id);
        const body = await request.json();
        const { transfer_fee, transfer_date, transfer_type } = body;

        // Verify transfer exists
        const existingTransfer = await prisma.transfer.findUnique({
            where: { transfer_id: transferId },
        });

        if (!existingTransfer) {
            return errorResponse('Transfer not found', 404);
        }

        const updateData = {};
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
            },
        });

        return successResponse(transfer);
    } catch (error) {
        return handleRouteError(error);
    }
}

/**
 * DELETE /api/transfers/:id
 * Delete transfer (admin only)
 */
export async function DELETE(request, { params }) {
    try {
        const auth = await requireAuth(request);
        if (auth instanceof NextResponse) return auth;

        if (auth.role !== 'ADMIN') {
            return errorResponse('Only admin can delete transfers', 403);
        }

        const { id } = await params;
        const transferId = parseInt(id);

        // Verify transfer exists
        const transfer = await prisma.transfer.findUnique({
            where: { transfer_id: transferId },
            include: {
                player: true,
            },
        });

        if (!transfer) {
            return errorResponse('Transfer not found', 404);
        }

        // Delete transfer (cascades to TransferHistory)
        await prisma.transfer.delete({
            where: { transfer_id: transferId },
        });

        return successResponse({ message: 'Transfer deleted successfully' });
    } catch (error) {
        return handleRouteError(error);
    }
}
