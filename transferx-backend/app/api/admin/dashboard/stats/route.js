import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/middleware';
import { successResponse, handleRouteError } from '@/lib/response';

/**
 * GET /api/admin/dashboard/stats
 * Get detailed statistics for admin reports
 */
export async function GET(request) {
  try {
    const authUser = await requireAuth(request, 'ADMIN');
    if (authUser instanceof NextResponse) return authUser;

    // Get club net spend report
    const clubNetSpendReport = await prisma.$queryRaw`
      SELECT 
        c.club_id,
        c.name as club_name,
        l.name as league_name,
        ISNULL(SUM(CASE WHEN t.to_club_id = c.club_id THEN CAST(t.transfer_fee AS float) ELSE 0 END), 0) as total_spent,
        ISNULL(SUM(CASE WHEN t.from_club_id = c.club_id THEN CAST(t.transfer_fee AS float) ELSE 0 END), 0) as total_received,
        ISNULL(SUM(CASE WHEN t.to_club_id = c.club_id THEN CAST(t.transfer_fee AS float) ELSE 0 END), 0) - 
        ISNULL(SUM(CASE WHEN t.from_club_id = c.club_id THEN CAST(t.transfer_fee AS float) ELSE 0 END), 0) as net_spend,
        COUNT(CASE WHEN t.to_club_id = c.club_id THEN 1 END) as players_bought,
        COUNT(CASE WHEN t.from_club_id = c.club_id THEN 1 END) as players_sold
      FROM Club c
      LEFT JOIN League l ON c.league_id = l.league_id
      LEFT JOIN Transfer t ON (c.club_id = t.to_club_id OR c.club_id = t.from_club_id)
      GROUP BY c.club_id, c.name, l.name
      ORDER BY net_spend DESC
    `;

    // Get player market value trends
    const marketValueTrends = await prisma.$queryRaw`
      SELECT 
        p.player_id,
        p.first_name + ' ' + p.last_name as player_name,
        p.position,
        COUNT(t.transfer_id) as transfer_count,
        MIN(CAST(t.transfer_fee AS float)) as min_value,
        MAX(CAST(t.transfer_fee AS float)) as max_value,
        AVG(CAST(t.transfer_fee AS float)) as avg_value
      FROM Player p
      INNER JOIN Transfer t ON p.player_id = t.player_id
      WHERE t.transfer_fee IS NOT NULL
      GROUP BY p.player_id, p.first_name, p.last_name, p.position
      HAVING COUNT(t.transfer_id) > 1
      ORDER BY max_value DESC
    `;

    // Get transfer statistics by position
    const transfersByPosition = await prisma.$queryRaw`
      SELECT 
        p.position,
        COUNT(t.transfer_id) as transfer_count,
        AVG(CAST(t.transfer_fee AS float)) as avg_fee,
        MIN(CAST(t.transfer_fee AS float)) as min_fee,
        MAX(CAST(t.transfer_fee AS float)) as max_fee,
        SUM(CAST(t.transfer_fee AS float)) as total_value
      FROM Transfer t
      INNER JOIN Player p ON t.player_id = p.player_id
      WHERE t.transfer_fee IS NOT NULL AND p.position IS NOT NULL
      GROUP BY p.position
      ORDER BY total_value DESC
    `;

    // Get transfer statistics by season
    const transfersBySeason = await prisma.$queryRaw`
      SELECT 
        YEAR(transfer_date) as season,
        COUNT(*) as transfer_count,
        COUNT(CASE WHEN transfer_type = 'PERMANENT' THEN 1 END) as permanent_count,
        COUNT(CASE WHEN transfer_type = 'LOAN' THEN 1 END) as loan_count,
        COUNT(CASE WHEN transfer_type = 'FREE' THEN 1 END) as free_count,
        AVG(CAST(transfer_fee AS float)) as avg_fee,
        SUM(CAST(transfer_fee AS float)) as total_value
      FROM Transfer
      GROUP BY YEAR(transfer_date)
      ORDER BY season DESC
    `;

    // Get most active agents
    const agentStats = await prisma.$queryRaw`
      SELECT 
        a.agent_id,
        a.agent_name,
        COUNT(DISTINCT pa.player_id) as player_count,
        COUNT(DISTINCT t.transfer_id) as transfer_count,
        SUM(CAST(t.transfer_fee AS float)) as total_transfer_value
      FROM Agent a
      LEFT JOIN PlayerAgent pa ON a.agent_id = pa.agent_id
      LEFT JOIN Transfer t ON pa.player_id = t.player_id
      GROUP BY a.agent_id, a.agent_name
      ORDER BY player_count DESC
    `;

    // Get league statistics
    const leagueStats = await prisma.$queryRaw`
      SELECT 
        l.league_id,
        l.name as league_name,
        l.country,
        COUNT(DISTINCT c.club_id) as club_count,
        COUNT(DISTINCT p.player_id) as player_count,
        COUNT(DISTINCT t.transfer_id) as transfer_count,
        SUM(CAST(t.transfer_fee AS float)) as total_transfer_value
      FROM League l
      LEFT JOIN Club c ON l.league_id = c.league_id
      LEFT JOIN Player p ON c.club_id = p.current_club_id
      LEFT JOIN Transfer t ON (c.club_id = t.from_club_id OR c.club_id = t.to_club_id)
      GROUP BY l.league_id, l.name, l.country
      ORDER BY total_transfer_value DESC
    `;

    // Get contract expiration timeline
    const contractTimeline = await prisma.$queryRaw`
      SELECT 
        YEAR(end_date) as year,
        MONTH(end_date) as month,
        COUNT(*) as expiring_contracts
      FROM Contract
      WHERE end_date >= GETDATE()
      GROUP BY YEAR(end_date), MONTH(end_date)
      ORDER BY year, month
    `;

    return successResponse({
      clubNetSpend: clubNetSpendReport,
      marketValueTrends: marketValueTrends.slice(0, 20), // Top 20
      transfersByPosition,
      transfersBySeason,
      agentStats,
      leagueStats,
      contractTimeline,
    });
  } catch (error) {
    console.error('Stats error:', error);
    return handleRouteError(error);
  }
}
