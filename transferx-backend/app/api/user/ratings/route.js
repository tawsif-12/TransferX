import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function OPTIONS() {
  return new NextResponse(null, { status: 200 });
}

export async function GET(request) {
  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    const userId = decoded.userId || decoded.id;
    if (!userId) {
      return NextResponse.json({ error: 'User ID not found in token' }, { status: 401 });
    }

    const ratings = await prisma.playerRating.findMany({
      where: { user_id: userId },
      include: {
        player: {
          select: {
            player_id: true,
            first_name: true,
            last_name: true,
            position: true,
            nationality: true
          }
        }
      }
    });

    return NextResponse.json(ratings);
  } catch (error) {
    console.error('Get user ratings error:', error);
    return NextResponse.json({ error: 'Failed to fetch ratings' }, { status: 500 });
  }
}
