import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse, handleRouteError } from '@/lib/response';
import { requireAuth } from '@/lib/middleware';

/**
 * GET /api/contracts/:id
 * Get contract detail
 */
export async function GET(request, { params }) {
    try {
        const { id } = await params;
        const contractId = parseInt(id);

        const contract = await prisma.contract.findUnique({
            where: { contract_id: contractId },
            include: {
                player: true,
                club: {
                    include: {
                        league: true,
                    },
                },
            },
        });

        if (!contract) {
            return errorResponse('Contract not found', 404);
        }

        return successResponse(contract);
    } catch (error) {
        return handleRouteError(error);
    }
}

/**
 * PUT /api/contracts/:id
 * Update contract (admin only)
 */
export async function PUT(request, { params }) {
    try {
        const auth = await requireAuth(request);
        if (auth instanceof NextResponse) return auth;

        if (auth.role !== 'ADMIN') {
            return errorResponse('Only admin can update contracts', 403);
        }

        const { id } = await params;
        const contractId = parseInt(id);
        const body = await request.json();
        const { start_date, end_date, salary } = body;

        // Verify contract exists
        const existingContract = await prisma.contract.findUnique({
            where: { contract_id: contractId },
        });

        if (!existingContract) {
            return errorResponse('Contract not found', 404);
        }

        const updateData = {};
        if (start_date !== undefined) updateData.start_date = new Date(start_date);
        if (end_date !== undefined) updateData.end_date = new Date(end_date);
        if (salary !== undefined) updateData.salary = salary ? parseFloat(salary) : null;

        const contract = await prisma.contract.update({
            where: { contract_id: contractId },
            data: updateData,
            include: {
                player: true,
                club: {
                    include: {
                        league: true,
                    },
                },
            },
        });

        return successResponse(contract);
    } catch (error) {
        return handleRouteError(error);
    }
}

/**
 * DELETE /api/contracts/:id
 * Delete contract (admin only)
 */
export async function DELETE(request, { params }) {
    try {
        const auth = await requireAuth(request);
        if (auth instanceof NextResponse) return auth;

        if (auth.role !== 'ADMIN') {
            return errorResponse('Only admin can delete contracts', 403);
        }

        const { id } = await params;
        const contractId = parseInt(id);

        // Verify contract exists
        const contract = await prisma.contract.findUnique({
            where: { contract_id: contractId },
        });

        if (!contract) {
            return errorResponse('Contract not found', 404);
        }

        // Delete contract
        await prisma.contract.delete({
            where: { contract_id: contractId },
        });

        return successResponse({ message: 'Contract deleted successfully' });
    } catch (error) {
        return handleRouteError(error);
    }
}
