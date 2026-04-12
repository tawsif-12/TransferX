import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function OPTIONS() {
  return new NextResponse(null, { status: 200 });
}

export async function POST(request, { params }) {
  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    const { playerId } = params;
    const body = await request.json();
    const { rating, review } = body;

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1-5' }, { status: 400 });
    }

    const userId = decoded.userId || decoded.id;
    if (!userId) {
      return NextResponse.json({ error: 'User ID not found in token' }, { status: 401 });
    }

    // Check if rating exists using findFirst instead of findUnique
    const existingRating = await prisma.playerRating.findFirst({
      where: {
        AND: [
          { user_id: userId },
          { player_id: parseInt(playerId) }
        ]
      }
    });

    let result;
    try {
      if (existingRating) {
        result = await prisma.playerRating.update({
          where: { id: existingRating.id },
          data: { rating, review }
        });
      } else {
        result = await prisma.playerRating.create({
          data: {
            user_id: userId,
            player_id: parseInt(playerId),
            rating,
            review
          }
        });
      }
    } catch (dbError) {
      console.error('Database error:', dbError);
      console.error('DB Error Code:', dbError.code);
      console.error('DB Error Meta:', dbError.meta);
      throw dbError;
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Rating error:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    return NextResponse.json(
      { error: 'Failed to save rating', details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request, { params }) {
  try {
    const { playerId } = params;

    const ratings = await prisma.playerRating.findMany({
      where: { player_id: parseInt(playerId) }
    });

    const avgRating = ratings.length > 0
      ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(2)
      : 0;

    return NextResponse.json({
      averageRating: parseFloat(avgRating),
      totalRatings: ratings.length,
      ratings
    });
  } catch (error) {
    console.error('Get ratings error:', error);
    return NextResponse.json({ error: 'Failed to fetch ratings' }, { status: 500 });
  }
}
