import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function OPTIONS() {
  return new NextResponse(null, { status: 200 });
}

export async function GET() {
  try {
    // Try to get ratings, but if table doesn't exist, return empty
    let ratings = [];
    try {
      ratings = await prisma.playerRating.findMany({
        select: {
          player_id: true,
          rating: true,
          player: {
            select: {
              player_id: true,
              first_name: true,
              last_name: true,
              position: true,
              nationality: true,
              current_club_id: true
            }
          }
        }
      });
    } catch (dbError) {
      console.error('Database query error:', dbError);
      // If table doesn't exist or other DB error, return empty array
      return NextResponse.json([]);
    }

    if (!ratings || ratings.length === 0) {
      return NextResponse.json([]);
    }

    // Group by player_id and calculate averages
    const playerMap = new Map();
    ratings.forEach((rating) => {
      const key = rating.player_id;
      if (!playerMap.has(key)) {
        playerMap.set(key, {
          player: rating.player,
          ratings: []
        });
      }
      playerMap.get(key).ratings.push(rating.rating);
    });

    // Calculate averages and sort
    const topPlayers = Array.from(playerMap.values())
      .map(({ player, ratings }) => ({
        ...player,
        averageRating: parseFloat((ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(2)),
        totalRatings: ratings.length
      }))
      .sort((a, b) => {
        if (b.averageRating !== a.averageRating) {
          return b.averageRating - a.averageRating;
        }
        return b.totalRatings - a.totalRatings;
      })
      .slice(0, 10);

    return NextResponse.json(topPlayers);
  } catch (error) {
    console.error('Top rated players error:', error);
    // Return empty array instead of error for now
    return NextResponse.json([]);
  }
}
