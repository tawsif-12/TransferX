import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, handleRouteError } from '@/lib/response';
import { getDashboardStats, getTransfers } from '@/lib/dataQueries';
import apiCache from '@/lib/apiCache';

const STATS_CACHE_KEY = 'dashboard_stats';
const CACHE_TTL = 300; // 5 minutes

/**
 * GET /api/stats
 * Get public dashboard statistics (no authentication required)
 * Cached for 5 minutes to reduce database queries
 */
export async function GET(request) {
  try {
    // Check cache first
    const cachedStats = apiCache.get(STATS_CACHE_KEY);
    if (cachedStats) {
      console.log('Returning cached stats');
      return successResponse(cachedStats);
    }

    try {
      const statsResult = await getDashboardStats();
      const transfersResult = await getTransfers({ limit: 5 });

      const stats = statsResult.success ? statsResult.data : {
        total_players: 0,
        total_clubs: 0,
        total_leagues: 0,
        total_agents: 0,
        total_transfers: 0,
        total_transfer_value: 0,
      };

      const recentTransfers = transfersResult.success ? transfersResult.data.slice(0, 5) : [];

      const response = {
        overview: {
          totalPlayers: stats.total_players,
          totalClubs: stats.total_clubs,
          totalLeagues: stats.total_leagues,
          totalAgents: stats.total_agents,
          totalTransfers: stats.total_transfers,
          totalTransferValue: stats.total_transfer_value,
          transfersThisSeason: stats.total_transfers,
          transfersThisMonth: 0,
          totalPlayerMarketValue: 0,
        },
        recentTransfers: recentTransfers.map(t => ({
          transfer_id: t.transfer_id,
          player: t.player,
          from_club: t.from_club,
          to_club: t.to_club,
          transfer_date: t.transfer_date,
          transfer_fee: t.transfer_fee,
        })),
        mostExpensiveTransfers: recentTransfers
          .sort((a, b) => (b.transfer_fee || 0) - (a.transfer_fee || 0))
          .slice(0, 5)
          .map(t => ({
            transfer_id: t.transfer_id,
            player: t.player,
            transfer_fee: t.transfer_fee,
          })),
      };

      // Cache the response
      apiCache.set(STATS_CACHE_KEY, response, CACHE_TTL);

      return successResponse(response);
    } catch (err) {
      console.error('Stats query failed:', err.message);
      const fallbackResponse = {
        overview: {
          totalPlayers: 0,
          totalClubs: 0,
          totalLeagues: 0,
          totalAgents: 0,
          totalTransfers: 0,
          totalTransferValue: 0,
          transfersThisSeason: 0,
          transfersThisMonth: 0,
          totalPlayerMarketValue: 0,
        },
        recentTransfers: [],
        mostExpensiveTransfers: [],
      };
      
      // Cache even fallback response to prevent repeated queries
      apiCache.set(STATS_CACHE_KEY, fallbackResponse, 60);
      return successResponse(fallbackResponse);
    }
  } catch (error) {
    console.error('Stats error:', error);
    return handleRouteError(error);
  }
}
