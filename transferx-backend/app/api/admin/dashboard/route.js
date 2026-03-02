import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/middleware';
import { successResponse, handleRouteError } from '@/lib/response';

/**
 * GET /api/admin/dashboard
 * Get comprehensive admin dashboard analytics
 */
export async function GET(request) {
  try {
    const authUser = await requireAuth(request, 'ADMIN');
    if (authUser instanceof NextResponse) return authUser;

    // Get current date for date-based calculations
    const now = new Date();
    const threeMonthsFromNow = new Date(now);
    threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);

    const currentYear = now.getFullYear();
    const startOfYear = new Date(currentYear, 0, 1);

    // Parallel queries for better performance
    const [
      // Total counts
      totalPlayers,
      totalClubs,
      totalLeagues,
      totalAgents,
      totalTransfers,
      totalContracts,

      // Transfer statistics  
      totalTransferValue,
      mostExpensiveTransfers,
      recentTransfers,
      transfersByType,
      
      // Contract statistics
      activeContracts,
      expiringContracts,
      
      // Club statistics
      mostActiveClubs,
      clubNetSpend,
      
      // Player statistics
      playersByPosition,
      playersByNationality,
      
      // Recent activity
      recentTransferHistory,
      
      // Agent statistics
      topAgents,
    ] = await Promise.all([
      // Total counts
      prisma.player.count(),
      prisma.club.count(),
      prisma.league.count(),
      prisma.agent.count(),
      prisma.transfer.count(),
      prisma.contract.count(),

      // Total transfer value this season
      prisma.transfer.aggregate({
        where: {
          transfer_date: { gte: startOfYear },
        },
        _sum: {
          transfer_fee: true,
        },
      }),

      // Most expensive transfers (top 10)
      prisma.transfer.findMany({
        take: 10,
        orderBy: {
          transfer_fee: 'desc',
        },
        include: {
          player: true,
          from_club: true,
          to_club: true,
        },
      }),

      // Recent transfers (last 10)
      prisma.transfer.findMany({
        take: 10,
        orderBy: {
          transfer_date: 'desc',
        },
        include: {
          player: true,
          from_club: true,
          to_club: true,
        },
      }),

      // Transfers by type
      prisma.transfer.groupBy({
        by: ['transfer_type'],
        _count: {
          transfer_id: true,
        },
        _sum: {
          transfer_fee: true,
        },
      }),

      // Active contracts
      prisma.contract.count({
        where: {
          AND: [
            { start_date: { lte: now } },
            { end_date: { gte: now } },
          ],
        },
      }),

      // Expiring contracts (within 3 months)
      prisma.contract.findMany({
        where: {
          AND: [
            { end_date: { gte: now } },
            { end_date: { lte: threeMonthsFromNow } },
          ],
        },
        include: {
          player: true,
          club: true,
        },
        orderBy: {
          end_date: 'asc',
        },
      }),

      // Most active clubs in transfer window
      prisma.$queryRaw`
        SELECT 
          c.club_id,
          c.name,
          COUNT(DISTINCT t1.transfer_id) as transfers_in,
          COUNT(DISTINCT t2.transfer_id) as transfers_out,
          COUNT(DISTINCT t1.transfer_id) + COUNT(DISTINCT t2.transfer_id) as total_transfers
        FROM Club c
        LEFT JOIN Transfer t1 ON c.club_id = t1.to_club_id AND t1.transfer_date >= ${startOfYear}
        LEFT JOIN Transfer t2 ON c.club_id = t2.from_club_id AND t2.transfer_date >= ${startOfYear}
        GROUP BY c.club_id, c.name
        HAVING COUNT(DISTINCT t1.transfer_id) + COUNT(DISTINCT t2.transfer_id) > 0
        ORDER BY total_transfers DESC
      `,

      // Club net spend (money spent - money received)
      prisma.$queryRaw`
        SELECT 
          c.club_id,
          c.name,
          ISNULL(SUM(CASE WHEN t.to_club_id = c.club_id THEN CAST(t.transfer_fee AS float) ELSE 0 END), 0) as total_spent,
          ISNULL(SUM(CASE WHEN t.from_club_id = c.club_id THEN CAST(t.transfer_fee AS float) ELSE 0 END), 0) as total_received,
          ISNULL(SUM(CASE WHEN t.to_club_id = c.club_id THEN CAST(t.transfer_fee AS float) ELSE 0 END), 0) - 
          ISNULL(SUM(CASE WHEN t.from_club_id = c.club_id THEN CAST(t.transfer_fee AS float) ELSE 0 END), 0) as net_spend
        FROM Club c
        LEFT JOIN Transfer t ON (c.club_id = t.to_club_id OR c.club_id = t.from_club_id)
        GROUP BY c.club_id, c.name
        ORDER BY net_spend DESC
      `,

      // Players by position
      prisma.player.groupBy({
        by: ['position'],
        _count: {
          player_id: true,
        },
      }),

      // Players by nationality (top 10)
      prisma.player.groupBy({
        by: ['nationality'],
        _count: {
          player_id: true,
        },
        orderBy: {
          _count: {
            player_id: 'desc',
          },
        },
        take: 10,
      }),

      // Recent transfer history (last 10 events)
      prisma.transferHistory.findMany({
        take: 10,
        orderBy: {
          transfer_id: 'desc',
        },
        include: {
          transfer: {
            include: {
              player: true,
              from_club: true,
              to_club: true,
            },
          },
          player: true,
        },
      }),

      // Top agents by player count
      prisma.agent.findMany({
        include: {
          _count: {
            select: { players: true },
          },
        },
        orderBy: {
          players: {
            _count: 'desc',
          },
        },
        take: 10,
      }),
    ]);

    // Calculate average transfer fee by position
    const avgFeeByPosition = await prisma.$queryRaw`
      SELECT 
        p.position,
        COUNT(t.transfer_id) as transfer_count,
        AVG(CAST(t.transfer_fee AS float)) as avg_fee,
        SUM(CAST(t.transfer_fee AS float)) as total_fee
      FROM Transfer t
      INNER JOIN Player p ON t.player_id = p.player_id
      WHERE t.transfer_fee IS NOT NULL AND p.position IS NOT NULL
      GROUP BY p.position
      ORDER BY avg_fee DESC
    `;

    // Transfers per season
    const transfersBySeason = await prisma.$queryRaw`
      SELECT 
        YEAR(transfer_date) as season,
        COUNT(*) as transfer_count,
        SUM(CAST(transfer_fee AS float)) as total_value
      FROM Transfer
      GROUP BY YEAR(transfer_date)
      ORDER BY season DESC
    `;

    const analytics = {
      overview: {
        totalPlayers,
        totalClubs,
        totalLeagues,
        totalAgents,
        totalTransfers,
        totalContracts,
        activeContracts,
        totalTransferValueThisSeason: totalTransferValue._sum.transfer_fee || 0,
      },
      transfers: {
        recent: recentTransfers,
        mostExpensive: mostExpensiveTransfers,
        byType: transfersByType,
        bySeason: transfersBySeason,
        avgFeeByPosition,
      },
      contracts: {
        active: activeContracts,
        expiring: expiringContracts,
        expiringCount: expiringContracts.length,
      },
      clubs: {
        mostActive: mostActiveClubs,
        netSpend: clubNetSpend,
      },
      players: {
        byPosition: playersByPosition,
        byNationality: playersByNationality,
      },
      agents: {
        top: topAgents,
      },
      activity: {
        recentTransferHistory,
      },
    };

    return successResponse(analytics);
  } catch (error) {
    console.error('Dashboard analytics error:', error);
    return handleRouteError(error);
  }
}
