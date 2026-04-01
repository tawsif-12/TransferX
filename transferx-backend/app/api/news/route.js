import { NextResponse } from 'next/server';
import { successResponse, errorResponse, handleRouteError } from '@/lib/response';
import { getNews } from '@/lib/dataQueries';

/**
 * GET /api/news
 * Fetch news about Bangladesh players
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const playerId = searchParams.get('playerId');
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '10');

    const filter = {
      ...(playerId && { playerId: parseInt(playerId) }),
      ...(category && { category })
    };

    try {
      const result = await getNews(limit, filter);
      if (result.success) {
        return successResponse(result.data);
      } else {
        console.error('Database query failed:', result.error);
        return successResponse([], 200);
      }
    } catch (err) {
      console.error('Query failed:', err.message);
      return successResponse([], 200);
    }
  } catch (error) {
    return handleRouteError(error);
  }
}
