import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse, handleRouteError } from '@/lib/response';
import { requireAuth } from '@/lib/middleware';

/**
 * GET /api/agents
 * List all agents with their players
 */
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const name = searchParams.get('name');

        const where = {};

        if (name) {
            where.agent_name = { contains: name, mode: 'insensitive' };
        }

        const agents = await prisma.agent.findMany({
            where,
            include: {
                players: {
                    include: {
                        player: true,
                    },
                },
            },
            orderBy: { agent_id: 'asc' },
        });

        return successResponse(agents);
    } catch (error) {
        return handleRouteError(error);
    }
}

/**
 * POST /api/agents
 * Create a new agent (admin only)
 */
export async function POST(request) {
    try {
        const auth = await requireAuth(request);
        if (auth instanceof NextResponse) return auth;

        if (auth.role !== 'ADMIN') {
            return errorResponse('Only admin can create agents', 403);
        }

        const body = await request.json();
        const { agent_name } = body;

        // Validate required fields
        if (!agent_name) {
            return errorResponse('Missing required field: agent_name', 400);
        }

        const agent = await prisma.agent.create({
            data: {
                agent_name,
            },
            include: {
                players: {
                    include: {
                        player: true,
                    },
                },
            },
        });

        return successResponse(agent, 201);
    } catch (error) {
        return handleRouteError(error);
    }
}
