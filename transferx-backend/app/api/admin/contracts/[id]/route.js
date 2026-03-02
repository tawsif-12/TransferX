import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/middleware';
import { successResponse, errorResponse, handleRouteError } from '@/lib/response';

/**
 * GET /api/admin/contracts/[id]
 * Get contract details
 */
export async function GET(request, { params }) {
  try {
    const authUser = await requireAuth(request, 'ADMIN');
    if (authUser instanceof NextResponse) return authUser;

    const contractId = parseInt(params.id);

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

    // Calculate status
    const now = new Date();
    const threeMonthsFromNow = new Date(now);
    threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);

    let status = 'active';
    if (contract.end_date < now) {
      status = 'expired';
    } else if (contract.end_date <= threeMonthsFromNow) {
      status = 'expiring';
    }

    return successResponse({
      ...contract,
      status,
    });
  } catch (error) {
    return handleRouteError(error);
  }
}

/**
 * PUT /api/admin/contracts/[id]
 * Update a contract
 */
export async function PUT(request, { params }) {
  try {
    const authUser = await requireAuth(request, 'ADMIN');
    if (authUser instanceof NextResponse) return authUser;

    const contractId = parseInt(params.id);
    const body = await request.json();

    const {
      player_id,
      club_id,
      start_date,
      end_date,
      salary,
    } = body;

    // Check if contract exists
    const existingContract = await prisma.contract.findUnique({
      where: { contract_id: contractId },
    });

    if (!existingContract) {
      return errorResponse('Contract not found', 404);
    }

    // Validate dates
    const startDate = start_date ? new Date(start_date) : existingContract.start_date;
    const endDate = end_date ? new Date(end_date) : existingContract.end_date;

    if (endDate <= startDate) {
      return errorResponse('End date must be after start date', 400);
    }

    const updateData = {};
    if (player_id !== undefined) updateData.player_id = parseInt(player_id);
    if (club_id !== undefined) updateData.club_id = parseInt(club_id);
    if (start_date !== undefined) updateData.start_date = new Date(start_date);
    if (end_date !== undefined) updateData.end_date = new Date(end_date);
    if (salary !== undefined) updateData.salary = salary ? parseFloat(salary) : null;

    const contract = await prisma.contract.update({
      where: { contract_id: contractId },
      data: updateData,
      include: {
        player: true,
        club: true,
      },
    });

    return successResponse(contract);
  } catch (error) {
    return handleRouteError(error);
  }
}

/**
 * DELETE /api/admin/contracts/[id]
 * Delete a contract
 */
export async function DELETE(request, { params }) {
  try {
    const authUser = await requireAuth(request, 'ADMIN');
    if (authUser instanceof NextResponse) return authUser;

    const contractId = parseInt(params.id);

    // Check if contract exists
    const contract = await prisma.contract.findUnique({
      where: { contract_id: contractId },
    });

    if (!contract) {
      return errorResponse('Contract not found', 404);
    }

    await prisma.contract.delete({
      where: { contract_id: contractId },
    });

    return successResponse({ message: 'Contract deleted successfully' });
  } catch (error) {
    return handleRouteError(error);
  }
}
