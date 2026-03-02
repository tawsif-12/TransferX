import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/middleware';
import { successResponse, errorResponse, handleRouteError } from '@/lib/response';

/**
 * GET /api/admin/players
 * Get all players with filters and search
 */
export async function GET(request) {
  try {
    const authUser = await requireAuth(request, 'ADMIN');
    if (authUser instanceof NextResponse) return authUser;

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const position = searchParams.get('position');
    const nationality = searchParams.get('nationality');
    const clubId = searchParams.get('clubId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = (page - 1) * limit;

    // Build filter conditions
    const where = {};
    
    if (search) {
      where.OR = [
        { first_name: { contains: search } },
        { last_name: { contains: search } },
      ];
    }
    
    if (position) {
      where.position = position;
    }
    
    if (nationality) {
      where.nationality = { contains: nationality };
    }
    
    if (clubId) {
      where.current_club_id = parseInt(clubId);
    }

    const [players, total] = await Promise.all([
      prisma.player.findMany({
        where,
        include: {
          current_club: {
            include: {
              league: true,
            },
          },
          agents: {
            include: {
              agent: true,
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
          _count: {
            select: {
              transfers_from: true,
              contracts: true,
            },
          },
        },
        orderBy: [
          { last_name: 'asc' },
          { first_name: 'asc' },
        ],
        skip,
        take: limit,
      }),
      prisma.player.count({ where }),
    ]);

    return successResponse({
      players,
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
 * POST /api/admin/players
 * Create a new player
 */
export async function POST(request) {
  try {
    const authUser = await requireAuth(request, 'ADMIN');
    if (authUser instanceof NextResponse) return authUser;

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

    // Validation
    if (!first_name || !last_name) {
      return errorResponse('First name and last name are required', 400);
    }

    if (!date_of_birth) {
      return errorResponse('Date of birth is required', 400);
    }

    // Check for duplicate player (same name and DOB)
    const existingPlayer = await prisma.player.findFirst({
      where: {
        first_name,
        last_name,
        date_of_birth: new Date(date_of_birth),
      },
    });

    if (existingPlayer) {
      return errorResponse('A player with the same name and date of birth already exists', 400);
    }

    const player = await prisma.player.create({
      data: {
        first_name,
        last_name,
        date_of_birth: new Date(date_of_birth),
        position,
        nationality,
        current_club_id: current_club_id ? parseInt(current_club_id) : null,
        fee: fee ? parseFloat(fee) : null,
      },
      include: {
        current_club: true,
      },
    });

    return successResponse(player, 201);
  } catch (error) {
    return handleRouteError(error);
  }
}
