import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse, handleRouteError } from '@/lib/response';
import { requireAuth } from '@/lib/middleware';
import { getAgents as getAgentsFromDB } from '@/lib/dataQueries';

/**
 * GET /api/agents
 * List all agents with their players
 */
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const name = searchParams.get('name');

        const filters = {
            ...(name && { name })
        };

        try {
            const result = await getAgentsFromDB(filters);
            if (result.success) {
                return successResponse(result.data);
            } else {
                console.error('Database query failed:', result.error);
                return successResponse([], 200);
            }
        } catch (err) {
            console.error('Query failed:', err.message);
            return successResponse([], 200);
        }
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
