import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/middleware';
import { successResponse, errorResponse, handleRouteError } from '@/lib/response';

/**
 * GET /api/admin/agents/[id]
 * Get agent details with all represented players
 */
export async function GET(request, { params }) {
  try {
    const authUser = await requireAuth(request, 'ADMIN');
    if (authUser instanceof NextResponse) return authUser;

    const agentId = parseInt(params.id);

    const agent = await prisma.agent.findUnique({
      where: { agent_id: agentId },
      include: {
        players: {
          include: {
            player: {
              include: {
                current_club: {
                  include: {
                    league: true,
                  },
                },
                contracts: {
                  where: {
                    AND: [
                      { start_date: { lte: new Date() } },
                      { end_date: { gte: new Date() } },
                    ],
                  },
                  include: {
                    club: true,
                  },
                },
                transfers_from: {
                  orderBy: {
                    transfer_date: 'desc',
                  },
                  take: 5,
                  include: {
                    from_club: true,
                    to_club: true,
                  },
                },
              },
            },
          },
        },
        _count: {
          select: {
            players: true,
          },
        },
      },
    });

    if (!agent) {
      return errorResponse('Agent not found', 404);
    }

    // Get total transfer value for players represented by this agent
    const transferStats = await prisma.$queryRaw`
      SELECT 
        COUNT(DISTINCT t.transfer_id) as total_transfers,
        SUM(CAST(t.transfer_fee AS float)) as total_transfer_value
      FROM PlayerAgent pa
      INNER JOIN Transfer t ON pa.player_id = t.player_id
      WHERE pa.agent_id = ${agentId}
    `;

    return successResponse({
      ...agent,
      transferStats: transferStats[0] || {
        total_transfers: 0,
        total_transfer_value: 0,
      },
    });
  } catch (error) {
    return handleRouteError(error);
  }
}

/**
 * PUT /api/admin/agents/[id]
 * Update an agent
 */
export async function PUT(request, { params }) {
  try {
    const authUser = await requireAuth(request, 'ADMIN');
    if (authUser instanceof NextResponse) return authUser;

    const agentId = parseInt(params.id);
    const body = await request.json();
    const { agent_name } = body;

    // Check if agent exists
    const existingAgent = await prisma.agent.findUnique({
      where: { agent_id: agentId },
    });

    if (!existingAgent) {
      return errorResponse('Agent not found', 404);
    }

    // Validation
    if (!agent_name || agent_name.trim() === '') {
      return errorResponse('Agent name is required', 400);
    }

    // Check for duplicate agent name (excluding current agent)
    const duplicate = await prisma.agent.findFirst({
      where: {
        AND: [
          { agent_id: { not: agentId } },
          { agent_name: agent_name.trim() },
        ],
      },
    });

    if (duplicate) {
      return errorResponse('Another agent with this name already exists', 400);
    }

    const agent = await prisma.agent.update({
      where: { agent_id: agentId },
      data: {
        agent_name: agent_name.trim(),
      },
    });

    return successResponse(agent);
  } catch (error) {
    return handleRouteError(error);
  }
}

/**
 * DELETE /api/admin/agents/[id]
 * Delete an agent
 */
export async function DELETE(request, { params }) {
  try {
    const authUser = await requireAuth(request, 'ADMIN');
    if (authUser instanceof NextResponse) return authUser;

    const agentId = parseInt(params.id);

    // Check if agent exists
    const agent = await prisma.agent.findUnique({
      where: { agent_id: agentId },
      include: {
        _count: {
          select: {
            players: true,
          },
        },
      },
    });

    if (!agent) {
      return errorResponse('Agent not found', 404);
    }

    // Check if agent has players
    if (agent._count.players > 0) {
      return errorResponse(
        'Cannot delete agent with assigned players. Please remove player assignments first.',
        400
      );
    }

    await prisma.agent.delete({
      where: { agent_id: agentId },
    });

    return successResponse({ message: 'Agent deleted successfully' });
  } catch (error) {
    return handleRouteError(error);
  }
}
