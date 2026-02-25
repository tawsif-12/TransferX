import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse, handleRouteError } from '@/lib/response';
import { requireAuth } from '@/lib/middleware';

/**
 * GET /api/agents/:id
 * Get agent detail with full player list
 */
export async function GET(request, { params }) {
    try {
        const { id } = await params;
        const agentId = parseInt(id);

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
                            },
                        },
                    },
                },
            },
        });

        if (!agent) {
            return errorResponse('Agent not found', 404);
        }

        return successResponse(agent);
    } catch (error) {
        return handleRouteError(error);
    }
}

/**
 * PUT /api/agents/:id
 * Update agent (admin only)
 */
export async function PUT(request, { params }) {
    try {
        const auth = await requireAuth(request);
        if (auth instanceof NextResponse) return auth;

        if (auth.role !== 'ADMIN') {
            return errorResponse('Only admin can update agents', 403);
        }

        const { id } = await params;
        const agentId = parseInt(id);
        const body = await request.json();
        const { agent_name } = body;

        // Verify agent exists
        const existingAgent = await prisma.agent.findUnique({
            where: { agent_id: agentId },
        });

        if (!existingAgent) {
            return errorResponse('Agent not found', 404);
        }

        const updateData = {};
        if (agent_name !== undefined) updateData.agent_name = agent_name;

        const agent = await prisma.agent.update({
            where: { agent_id: agentId },
            data: updateData,
            include: {
                players: {
                    include: {
                        player: true,
                    },
                },
            },
        });

        return successResponse(agent);
    } catch (error) {
        return handleRouteError(error);
    }
}

/**
 * DELETE /api/agents/:id
 * Delete agent (admin only)
 */
export async function DELETE(request, { params }) {
    try {
        const auth = await requireAuth(request);
        if (auth instanceof NextResponse) return auth;

        if (auth.role !== 'ADMIN') {
            return errorResponse('Only admin can delete agents', 403);
        }

        const { id } = await params;
        const agentId = parseInt(id);

        // Verify agent exists
        const agent = await prisma.agent.findUnique({
            where: { agent_id: agentId },
        });

        if (!agent) {
            return errorResponse('Agent not found', 404);
        }

        // Delete agent (cascades to PlayerAgent)
        await prisma.agent.delete({
            where: { agent_id: agentId },
        });

        return successResponse({ message: 'Agent deleted successfully' });
    } catch (error) {
        return handleRouteError(error);
    }
}
