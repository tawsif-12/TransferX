import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/middleware';
import { successResponse, errorResponse, handleRouteError } from '@/lib/response';

/**
 * Calculate player tier based on rating and market value
 * Tier 1: rating > 8.0 OR marketValue > 50M (Top tier leagues)
 * Tier 2: rating > 6.5 OR marketValue > 20M (Mid tier leagues)
 * Tier 3: Others (Lower tier leagues)
 */
function calculatePlayerTier(playerProfile) {
  if (!playerProfile) return 3;
  
  const { rating, marketValue } = playerProfile;
  
  if (rating > 8.0 || marketValue > 50) {
    return 1;
  } else if (rating > 6.5 || marketValue > 20) {
    return 2;
  }
  return 3;
}

/**
 * GET /api/recommendations/leagues
 * Get recommended leagues based on player profile and tier
 */
export async function GET(request) {
  try {
    const authUser = await requireAuth(request);
    if (authUser instanceof NextResponse) return authUser;

    // Only players can get recommendations
    if (authUser.role !== 'PLAYER') {
      return errorResponse('Only players can get recommendations', 403);
    }

    // Get player profile
    const user = await prisma.user.findUnique({
      where: { id: authUser.userId },
      include: {
        playerProfile: true,
      },
    });

    if (!user || !user.playerProfile) {
      return errorResponse('Player profile not found', 404);
    }

    // Calculate tier
    const tier = calculatePlayerTier(user.playerProfile);

    // Get leagues matching the tier
    const leagues = await prisma.league.findMany({
      where: {
        tier: {
          lte: tier, // Show leagues at their tier and below
        },
        isActive: true,
      },
      include: {
        clubs: {
          where: {
            isActive: true,
          },
          take: 5, // Include top 5 clubs per league
        },
      },
      orderBy: {
        tier: 'asc',
      },
    });

    return successResponse({
      playerTier: tier,
      tierDescription: tier === 1 
        ? 'Elite Player - Top European Leagues' 
        : tier === 2 
        ? 'Established Player - Major Leagues' 
        : 'Developing Player - Regional Leagues',
      playerStats: {
        rating: user.playerProfile.rating,
        marketValue: user.playerProfile.marketValue,
        goalsScored: user.playerProfile.goalsScored,
        assists: user.playerProfile.assists,
      },
      recommendedLeagues: leagues,
    });
  } catch (error) {
    return handleRouteError(error);
  }
}
