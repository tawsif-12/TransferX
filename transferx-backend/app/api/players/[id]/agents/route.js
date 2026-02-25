import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse, handleRouteError } from '@/lib/response';
import { requireAuth } from '@/lib/middleware';

/**
 * POST /api/players/:id/agents
 * Assign agent to player (admin only)
 */
export async function POST(request, { params }) {
    try {
        const auth = await requireAuth(request);
        if (auth instanceof NextResponse) return auth;

        if (auth.role !== 'ADMIN') {
            return errorResponse('Only admin can assign agents to players', 403);
        }

        const { id } = await params;
        const playerId = parseInt(id);
        const body = await request.json();
        const { agent_id } = body;

        if (!agent_id) {
            return errorResponse('Missing required field: agent_id', 400);
        }

        const agentId = parseInt(agent_id);

        // Verify player exists
        const player = await prisma.player.findUnique({
            where: { player_id: playerId },
        });
        if (!player) {
            return errorResponse('Player not found', 404);
        }

        // Verify agent exists
        const agent = await prisma.agent.findUnique({
            where: { agent_id: agentId },
        });
        if (!agent) {
            return errorResponse('Agent not found', 404);
        }

        // Create PlayerAgent relationship
        const playerAgent = await prisma.playerAgent.create({
            data: {
                player_id: playerId,
                agent_id: agentId,
            },
            include: {
                player: true,
                agent: true,
            },
        });

        return successResponse(playerAgent, 201);
    } catch (error) {
        if (error.code === 'P2002') {
            return errorResponse('Agent is already assigned to this player', 409);
        }
        return handleRouteError(error);
    }
}
