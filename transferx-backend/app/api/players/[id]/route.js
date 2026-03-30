import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse, handleRouteError } from '@/lib/response';
import { requireAuth } from '@/lib/middleware';
import { getPlayerById } from '@/lib/dataQueries';

/**
 * GET /api/players/:id
 * Get player details with contracts, transfer history, and agents
 */
export async function GET(request, { params }) {
    try {
        const { id } = await params;
        const playerId = parseInt(id);

        try {
            const result = await getPlayerById(playerId);
            if (result.success && result.data) {
                return successResponse(result.data);
            } else {
                return errorResponse('Player not found', 404);
            }
        } catch (err) {
            console.error('Query failed:', err.message);
            return errorResponse('Failed to fetch player', 500);
        }
    } catch (error) {
        return handleRouteError(error);
    }
}

/**
 * PUT /api/players/:id
 * Update player details (admin only)
 */
export async function PUT(request, { params }) {
    try {
        const auth = await requireAuth(request);
        if (auth instanceof NextResponse) return auth;

        if (auth.role !== 'ADMIN') {
            return errorResponse('Only admin can update players', 403);
        }

        const { id } = await params;
        const playerId = parseInt(id);
        const body = await request.json();
        const {
            first_name,
            last_name,
            date_of_birth,
            position,
            nationality,
            current_club_id,
            fee,
        } = body;

        // Verify player exists
        const existingPlayer = await prisma.player.findUnique({
            where: { player_id: playerId },
        });

        if (!existingPlayer) {
            return errorResponse('Player not found', 404);
        }

        const updateData = {};
        if (first_name !== undefined) updateData.first_name = first_name;
        if (last_name !== undefined) updateData.last_name = last_name;
        if (date_of_birth !== undefined) updateData.date_of_birth = new Date(date_of_birth);
        if (position !== undefined) updateData.position = position;
        if (nationality !== undefined) updateData.nationality = nationality;
        if (current_club_id !== undefined) updateData.current_club_id = current_club_id ? parseInt(current_club_id) : null;
        if (fee !== undefined) updateData.fee = fee ? parseFloat(fee) : null;

        const player = await prisma.player.update({
            where: { player_id: playerId },
            data: updateData,
            include: {
                current_club: {
                    include: {
                        league: true,
                    },
                },
            },
        });

        return successResponse(player);
    } catch (error) {
        return handleRouteError(error);
    }
}

/**
 * DELETE /api/players/:id
 * Delete player (admin only)
 */
export async function DELETE(request, { params }) {
    try {
        const auth = await requireAuth(request);
        if (auth instanceof NextResponse) return auth;

        if (auth.role !== 'ADMIN') {
            return errorResponse('Only admin can delete players', 403);
        }

        const { id } = await params;
        const playerId = parseInt(id);

        // Verify player exists
        const player = await prisma.player.findUnique({
            where: { player_id: playerId },
        });

        if (!player) {
            return errorResponse('Player not found', 404);
        }

        // Delete player and cascade to related records
        await prisma.player.delete({
            where: { player_id: playerId },
        });

        return successResponse({ message: 'Player deleted successfully' });
    } catch (error) {
        return handleRouteError(error);
    }
}
