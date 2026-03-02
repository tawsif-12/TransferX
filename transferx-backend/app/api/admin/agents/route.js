import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/middleware';
import { successResponse, errorResponse, handleRouteError } from '@/lib/response';

/**
 * GET /api/admin/agents
 * Get all agents with search
 */
export async function GET(request) {
  try {
    const authUser = await requireAuth(request, 'ADMIN');
    if (authUser instanceof NextResponse) return authUser;

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = (page - 1) * limit;

    // Build filter conditions
    const where = {};
    
    if (search) {
      where.agent_name = { contains: search };
    }

    const [agents, total] = await Promise.all([
      prisma.agent.findMany({
        where,
        include: {
          players: {
            include: {
              player: {
                include: {
                  current_club: true,
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
        orderBy: {
          agent_name: 'asc',
        },
        skip,
        take: limit,
      }),
      prisma.agent.count({ where }),
    ]);

    return successResponse({
      agents,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return handleRouteError(error);
  }
}

/**
 * POST /api/admin/agents
 * Create a new agent
 */
export async function POST(request) {
  try {
    const authUser = await requireAuth(request, 'ADMIN');
    if (authUser instanceof NextResponse) return authUser;

    const body = await request.json();
    const { agent_name } = body;

    // Validation
    if (!agent_name || agent_name.trim() === '') {
      return errorResponse('Agent name is required', 400);
    }

    // Check for duplicate agent name
    const existingAgent = await prisma.agent.findFirst({
      where: {
        agent_name: agent_name.trim(),
      },
    });

    if (existingAgent) {
      return errorResponse('An agent with this name already exists', 400);
    }

    const agent = await prisma.agent.create({
      data: {
        agent_name: agent_name.trim(),
      },
    });

    return successResponse(agent, 201);
  } catch (error) {
    return handleRouteError(error);
  }
}
