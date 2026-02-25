import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, errorResponse, handleRouteError } from '@/lib/response';
import { requireAuth } from '@/lib/middleware';

/**
 * GET /api/players
 * List all players with optional filtering by name, position, nationality, clubId
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name');
    const position = searchParams.get('position');
    const nationality = searchParams.get('nationality');
    const clubId = searchParams.get('clubId');

    const where = {};

    if (name) {
      where.OR = [
        { first_name: { contains: name, mode: 'insensitive' } },
        { last_name: { contains: name, mode: 'insensitive' } },
      ];
    }

    if (position) where.position = { contains: position, mode: 'insensitive' };
    if (nationality) where.nationality = { contains: nationality, mode: 'insensitive' };
    if (clubId) where.current_club_id = parseInt(clubId);

    const players = await prisma.player.findMany({
      where,
      include: {
        current_club: {
          include: {
            league: true,
          },
        },
      },
      orderBy: { player_id: 'desc' },
    });

    return successResponse(players);
  } catch (error) {
    return handleRouteError(error);
  }
}

/**
 * POST /api/players
 * Create a new player (admin only)
 */
export async function POST(request) {
  try {
    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) return auth;

    // Check admin role
    if (auth.role !== 'ADMIN') {
      return errorResponse('Only admin can create players', 403);
    }

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

    // Validate required fields
    if (!first_name || !last_name || !date_of_birth) {
      return errorResponse('Missing required fields: first_name, last_name, date_of_birth', 400);
    }

    const player = await prisma.player.create({
      data: {
        first_name,
        last_name,
        date_of_birth: new Date(date_of_birth),
        position: position || null,
        nationality: nationality || null,
        current_club_id: current_club_id ? parseInt(current_club_id) : null,
        fee: fee ? parseFloat(fee) : null,
      },
      include: {
        current_club: {
          include: {
            league: true,
          },
        },
      },
    });

    return successResponse(player, 201);
  } catch (error) {
    return handleRouteError(error);
  }
}
