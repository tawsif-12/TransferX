import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/middleware';
import { successResponse, errorResponse, handleRouteError } from '@/lib/response';

/**
 * Calculate match score between player and transfer opportunity
 */
function calculateMatchScore(playerProfile, opportunity) {
  let score = 0;
  
  // Position match
  if (playerProfile.position === opportunity.position) {
    score += 40;
  }
  
  // Rating match
  if (playerProfile.rating >= opportunity.minRating) {
    score += 30;
  }
  
  // Market value within budget
  if (playerProfile.marketValue <= opportunity.maxBudget) {
    score += 30;
  }
  
  return Math.min(score, 100);
}

/**
 * GET /api/recommendations/opportunities
 * Get recommended transfer opportunities based on player profile
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

    // Get all active transfer opportunities
    const opportunities = await prisma.transferOpportunity.findMany({
      where: {
        isActive: true,
        OR: [
          { endDate: null },
          { endDate: { gte: new Date() } },
        ],
      },
      include: {
        club: {
          include: {
            league: true,
          },
        },
      },
    });

    // Calculate match score for each opportunity
    const recommendedOpportunities = opportunities
      .map(opportunity => ({
        ...opportunity,
        matchScore: calculateMatchScore(user.playerProfile, opportunity),
      }))
      .filter(opp => opp.matchScore >= 30) // Only show if match score is at least 30%
      .sort((a, b) => b.matchScore - a.matchScore);

    return successResponse({
      playerProfile: {
        position: user.playerProfile.position,
        rating: user.playerProfile.rating,
        marketValue: user.playerProfile.marketValue,
      },
      opportunities: recommendedOpportunities,
    });
  } catch (error) {
    return handleRouteError(error);
  }
}
