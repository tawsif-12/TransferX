import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse, handleRouteError } from '@/lib/response';
import { requireAuth } from '@/lib/middleware';

/**
 * DELETE /api/players/:id/agents/:agentId
 * Remove agent from player (admin only)
 */
export async function DELETE(request, { params }) {
    try {
        const auth = await requireAuth(request);
        if (auth instanceof NextResponse) return auth;

        if (auth.role !== 'ADMIN') {
            return errorResponse('Only admin can remove agents from players', 403);
        }

        const { id, agentId } = await params;
        const playerId = parseInt(id);
        const agentIdNum = parseInt(agentId);

        // Verify relationship exists
        const playerAgent = await prisma.playerAgent.findUnique({
            where: {
                player_id_agent_id: {
                    player_id: playerId,
                    agent_id: agentIdNum,
                },
            },
        });

        if (!playerAgent) {
            return errorResponse('Player-Agent relationship not found', 404);
        }

        await prisma.playerAgent.delete({
            where: {
                player_id_agent_id: {
                    player_id: playerId,
                    agent_id: agentIdNum,
                },
            },
        });

        return successResponse({ message: 'Agent removed from player successfully' });
    } catch (error) {
        return handleRouteError(error);
    }
}
