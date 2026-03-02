import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/middleware';
import { successResponse, errorResponse, handleRouteError } from '@/lib/response';

/**
 * POST /api/admin/agents/[id]/players
 * Assign a player to an agent
 */
export async function POST(request, { params }) {
  try {
    const authUser = await requireAuth(request, 'ADMIN');
    if (authUser instanceof NextResponse) return authUser;

    const agentId = parseInt(params.id);
    const body = await request.json();
    const { player_id } = body;

    if (!player_id) {
      return errorResponse('Player ID is required', 400);
    }

    // Check if agent exists
    const agent = await prisma.agent.findUnique({
      where: { agent_id: agentId },
    });

    if (!agent) {
      return errorResponse('Agent not found', 404);
    }

    // Check if player exists
    const player = await prisma.player.findUnique({
      where: { player_id: parseInt(player_id) },
    });

    if (!player) {
      return errorResponse('Player not found', 404);
    }

    // Check if relationship already exists
    const existing = await prisma.playerAgent.findUnique({
      where: {
        player_id_agent_id: {
          player_id: parseInt(player_id),
          agent_id: agentId,
        },
      },
    });

    if (existing) {
      return errorResponse('This player is already assigned to this agent', 400);
    }

    // Create the relationship
    const playerAgent = await prisma.playerAgent.create({
      data: {
        player_id: parseInt(player_id),
        agent_id: agentId,
      },
      include: {
        player: true,
        agent: true,
      },
    });

    return successResponse(playerAgent, 201);
  } catch (error) {
    return handleRouteError(error);
  }
}

/**
 * DELETE /api/admin/agents/[id]/players/[playerId]
 * Remove a player from an agent
 */
export async function DELETE(request, { params }) {
  try {
    const authUser = await requireAuth(request, 'ADMIN');
    if (authUser instanceof NextResponse) return authUser;

    const agentId = parseInt(params.id);
    const playerId = parseInt(params.playerId);

    // Check if relationship exists
    const playerAgent = await prisma.playerAgent.findUnique({
      where: {
        player_id_agent_id: {
          player_id: playerId,
          agent_id: agentId,
        },
      },
    });

    if (!playerAgent) {
      return errorResponse('Player-Agent relationship not found', 404);
    }

    // Delete the relationship
    await prisma.playerAgent.delete({
      where: {
        player_id_agent_id: {
          player_id: playerId,
          agent_id: agentId,
        },
      },
    });

    return successResponse({ message: 'Player removed from agent successfully' });
  } catch (error) {
    return handleRouteError(error);
  }
}
