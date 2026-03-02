import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/middleware';
import { successResponse, errorResponse, handleRouteError } from '@/lib/response';

/**
 * GET /api/admin/contracts
 * Get all contracts with filters
 */
export async function GET(request) {
  try {
    const authUser = await requireAuth(request, 'ADMIN');
    if (authUser instanceof NextResponse) return authUser;

    const { searchParams } = new URL(request.url);
    const playerId = searchParams.get('playerId');
    const clubId = searchParams.get('clubId');
    const status = searchParams.get('status'); // active, expired, expiring
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = (page - 1) * limit;

    const now = new Date();
    const threeMonthsFromNow = new Date(now);
    threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);

    // Build filter conditions
    const where = {};
    
    if (playerId) {
      where.player_id = parseInt(playerId);
    }
    
    if (clubId) {
      where.club_id = parseInt(clubId);
    }
    
    if (status === 'active') {
      where.AND = [
        { start_date: { lte: now } },
        { end_date: { gte: now } },
      ];
    } else if (status === 'expired') {
      where.end_date = { lt: now };
    } else if (status === 'expiring') {
      where.AND = [
        { end_date: { gte: now } },
        { end_date: { lte: threeMonthsFromNow } },
      ];
    }

    const [contracts, total] = await Promise.all([
      prisma.contract.findMany({
        where,
        include: {
          player: true,
          club: {
            include: {
              league: true,
            },
          },
        },
        orderBy: {
          end_date: 'asc',
        },
        skip,
        take: limit,
      }),
      prisma.contract.count({ where }),
    ]);

    // Add status to each contract
    const contractsWithStatus = contracts.map(contract => {
      let contractStatus = 'active';
      if (contract.end_date < now) {
        contractStatus = 'expired';
      } else if (contract.end_date <= threeMonthsFromNow) {
        contractStatus = 'expiring';
      }
      return {
        ...contract,
        status: contractStatus,
      };
    });

    return successResponse({
      contracts: contractsWithStatus,
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
 * POST /api/admin/contracts
 * Create a new contract
 */
export async function POST(request) {
  try {
    const authUser = await requireAuth(request, 'ADMIN');
    if (authUser instanceof NextResponse) return authUser;

    const body = await request.json();
    const {
      player_id,
      club_id,
      start_date,
      end_date,
      salary,
    } = body;

    // Validation
    if (!player_id || !club_id || !start_date || !end_date) {
      return errorResponse('Player, club, start date, and end date are required', 400);
    }

    const startDate = new Date(start_date);
    const endDate = new Date(end_date);

    if (endDate <= startDate) {
      return errorResponse('End date must be after start date', 400);
    }

    // Check if player exists
    const player = await prisma.player.findUnique({
      where: { player_id: parseInt(player_id) },
    });

    if (!player) {
      return errorResponse('Player not found', 404);
    }

    // Check if club exists
    const club = await prisma.club.findUnique({
      where: { club_id: parseInt(club_id) },
    });

    if (!club) {
      return errorResponse('Club not found', 404);
    }

    // Check for overlapping active contracts for the same player
    const overlappingContract = await prisma.contract.findFirst({
      where: {
        player_id: parseInt(player_id),
        OR: [
          {
            AND: [
              { start_date: { lte: startDate } },
              { end_date: { gte: startDate } },
            ],
          },
          {
            AND: [
              { start_date: { lte: endDate } },
              { end_date: { gte: endDate } },
            ],
          },
          {
            AND: [
              { start_date: { gte: startDate } },
              { end_date: { lte: endDate } },
            ],
          },
        ],
      },
    });

    if (overlappingContract) {
      return errorResponse('Player already has a contract during this period', 400);
    }

    const contract = await prisma.contract.create({
      data: {
        player_id: parseInt(player_id),
        club_id: parseInt(club_id),
        start_date: startDate,
        end_date: endDate,
        salary: salary ? parseFloat(salary) : null,
      },
      include: {
        player: true,
        club: true,
      },
    });

    return successResponse(contract, 201);
  } catch (error) {
    return handleRouteError(error);
  }
}
