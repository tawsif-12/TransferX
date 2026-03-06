import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, handleRouteError } from '@/lib/response';

/**
 * GET /api/stats
 * Get public dashboard statistics (no authentication required)
 */
export async function GET(request) {
  try {
    const now = new Date();
    const currentYear = now.getFullYear();
    const startOfYear = new Date(currentYear, 0, 1);
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Parallel queries for better performance
    const [
      totalPlayers,
      totalClubs,
      totalLeagues,
      transfersThisSeason,
      transfersThisMonth,
      totalTransferValue,
      totalPlayerMarketValue,
      recentTransfers,
      mostExpensiveTransfers,
      topClubs,
      transfersByType,
    ] = await Promise.all([
      // Total counts
      prisma.player.count(),
      prisma.club.count(),
      prisma.league.count(),

      // Transfers this season
      prisma.transfer.count({
        where: {
          transfer_date: { gte: startOfYear },
        },
      }),

      // Transfers this month
      prisma.transfer.count({
        where: {
          transfer_date: { gte: thirtyDaysAgo },
        },
      }),

      // Total transfer value this season
      prisma.transfer.aggregate({
        where: {
          transfer_date: { gte: startOfYear },
        },
        _sum: {
          transfer_fee: true,
        },
      }),

      // Total market value of all players
      prisma.player.aggregate({
        _sum: {
          fee: true,
        },
      }),

      // Recent transfers (last 5)
      prisma.transfer.findMany({
        take: 5,
        orderBy: {
          transfer_date: 'desc',
        },
        include: {
          player: {
            select: {
              player_id: true,
              first_name: true,
              last_name: true,
              position: true,
              nationality: true,
            },
          },
          from_club: {
            select: {
              club_id: true,
              name: true,
              country: true,
            },
          },
          to_club: {
            select: {
              club_id: true,
              name: true,
              country: true,
            },
          },
        },
      }),

      // Most expensive transfers this season (top 10)
      prisma.transfer.findMany({
        where: {
          transfer_date: { gte: startOfYear },
        },
        take: 10,
        orderBy: {
          transfer_fee: 'desc',
        },
        include: {
          player: {
            select: {
              player_id: true,
              first_name: true,
              last_name: true,
              position: true,
              nationality: true,
            },
          },
          from_club: {
            select: {
              club_id: true,
              name: true,
              country: true,
            },
          },
          to_club: {
            select: {
              club_id: true,
              name: true,
              country: true,
            },
          },
        },
      }),

      // Top clubs by transfer activity
      prisma.$queryRaw`
        SELECT TOP 5
          c.club_id,
          c.name,
          c.country,
          COUNT(DISTINCT t1.transfer_id) as transfers_in,
          COUNT(DISTINCT t2.transfer_id) as transfers_out,
          COUNT(DISTINCT t1.transfer_id) + COUNT(DISTINCT t2.transfer_id) as total_transfers
        FROM Club c
        LEFT JOIN Transfer t1 ON c.club_id = t1.to_club_id AND t1.transfer_date >= ${startOfYear}
        LEFT JOIN Transfer t2 ON c.club_id = t2.from_club_id AND t2.transfer_date >= ${startOfYear}
        GROUP BY c.club_id, c.name, c.country
        HAVING COUNT(DISTINCT t1.transfer_id) + COUNT(DISTINCT t2.transfer_id) > 0
        ORDER BY total_transfers DESC
      `,

      // Transfers by type
      prisma.transfer.groupBy({
        where: {
          transfer_date: { gte: startOfYear },
        },
        by: ['transfer_type'],
        _count: {
          transfer_id: true,
        },
        _sum: {
          transfer_fee: true,
        },
      }),
    ]);

    const stats = {
      overview: {
        totalPlayers,
        totalClubs,
        totalLeagues,
        transfersThisSeason,
        transfersThisMonth,
        totalTransferValue: totalTransferValue._sum.transfer_fee || 0,
        totalPlayerMarketValue: totalPlayerMarketValue._sum.fee || 0,
      },
      recentTransfers,
      mostExpensiveTransfers,
      topClubs,
      transfersByType,
    };

    return successResponse(stats);
  } catch (error) {
    console.error('Stats error:', error);
    return handleRouteError(error);
  }
}
