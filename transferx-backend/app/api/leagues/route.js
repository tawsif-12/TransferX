import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { successResponse, handleRouteError } from '@/lib/response';

/**
 * GET /api/leagues
 * Get all leagues
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const country = searchParams.get('country');
    const tier = searchParams.get('tier');
    const isActive = searchParams.get('isActive');

    const where = {};
    
    if (country) where.country = country;
    if (tier) where.tier = parseInt(tier);
    if (isActive !== null) where.isActive = isActive !== 'false';

    const leagues = await prisma.league.findMany({
      where,
      include: {
        _count: {
          select: { clubs: true },
        },
      },
      orderBy: [
        { tier: 'asc' },
        { name: 'asc' },
      ],
    });

    return successResponse(leagues);
  } catch (error) {
    return handleRouteError(error);
  }
}
