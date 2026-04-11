import { NextResponse } from 'next/server';
import { getTransfers } from '@/lib/dataQueries';
import { successResponse, errorResponse, handleRouteError } from '@/lib/response';
import { requireAuth } from '@/lib/middleware';
import apiCache from '@/lib/apiCache';

/**
 * GET /api/transfers
 * List all transfers with optional filtering
 * Uses caching for performance optimization
 */
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const playerId = searchParams.get('playerId');
        const type = searchParams.get('type');
        const fromYear = searchParams.get('fromYear');
        const toYear = searchParams.get('toYear');

        // Create cache key based on query parameters
        const cacheKey = `transfers_${playerId || 'all'}_${type || 'all'}_${fromYear || 'all'}_${toYear || 'all'}`;
        
        // Check cache first (5-minute TTL for frequently accessed data)
        const cachedResult = apiCache.get(cacheKey);
        if (cachedResult) {
            console.log('✓ Returning cached transfers');
            return successResponse({
                data: cachedResult,
                pagination: {
                    total: cachedResult.length,
                    cached: true,
                },
            });
        }

        // Build filter object
        const filters = {};
        if (playerId) filters.playerId = playerId;
        if (type) filters.type = type;
        if (fromYear) filters.fromYear = fromYear;
        if (toYear) filters.toYear = toYear;

        // Fetch transfers using optimized SQL query
        const result = await getTransfers(filters);
        
        if (!result.success) {
            console.error('Error fetching transfers:', result.error);
            return successResponse({
                data: [],
                pagination: { total: 0 },
            });
        }

        // Format response data for frontend
        const formattedData = result.data.map(t => ({
            transfer_id: t.transfer_id,
            player_id: t.player_id,
            player_name: `${t.player?.first_name || ''} ${t.player?.last_name || ''}`.trim(),
            player_position: t.player?.position || 'Unknown',
            from_club_id: t.from_club_id,
            from_club: t.from_club?.name || 'Unknown',
            to_club_id: t.to_club_id,
            to_club: t.to_club?.name || 'Unknown',
            transfer_fee: t.transfer_fee || 0,
            transfer_date: t.transfer_date,
            transfer_type: t.transfer_type,
        }));

        // Cache the results for 5 minutes
        apiCache.set(cacheKey, formattedData, 300);

        return successResponse({
            data: formattedData,
            pagination: {
                total: formattedData.length,
            },
        });

    } catch (error) {
        console.error('Transfers error:', error);
        return successResponse({
            data: [],
            pagination: { total: 0 },
        });
    }
}

/**
 * POST /api/transfers
 * Create a new transfer (admin only)
 * Automatically creates TransferHistory and updates player's current_club_id
 */
export async function POST(request) {
    try {
        const auth = await requireAuth(request);
        if (auth instanceof NextResponse) return auth;

        if (auth.role !== 'ADMIN') {
            return errorResponse('Only admin can create transfers', 403);
        }

        const body = await request.json();
        const {
            player_id,
            from_club_id,
            to_club_id,
            transfer_fee,
            transfer_date,
            transfer_type,
        } = body;

        // Validate required fields
        if (!player_id || !from_club_id || !to_club_id || !transfer_date || !transfer_type) {
            return errorResponse(
                'Missing required fields: player_id, from_club_id, to_club_id, transfer_date, transfer_type',
                400
            );
        }

        const playerId = parseInt(player_id);
        const fromClubId = parseInt(from_club_id);
        const toClubId = parseInt(to_club_id);

        // Verify all entities exist
        const [player, fromClub, toClub] = await Promise.all([
            prisma.player.findUnique({ where: { player_id: playerId } }),
            prisma.club.findUnique({ where: { club_id: fromClubId } }),
            prisma.club.findUnique({ where: { club_id: toClubId } }),
        ]);

        if (!player) return errorResponse('Player not found', 404);
        if (!fromClub) return errorResponse('From club not found', 404);
        if (!toClub) return errorResponse('To club not found', 404);

        // Use transaction to ensure all operations succeed together
        const transfer = await prisma.$transaction(async (tx) => {
            // Create transfer
            const newTransfer = await tx.transfer.create({
                data: {
                    player_id: playerId,
                    from_club_id: fromClubId,
                    to_club_id: toClubId,
                    transfer_fee: transfer_fee ? parseFloat(transfer_fee) : null,
                    transfer_date: new Date(transfer_date),
                    transfer_type,
                },
                include: {
                    player: true,
                    from_club: true,
                    to_club: true,
                },
            });

            // Create transfer history entry
            await tx.transferHistory.create({
                data: {
                    transfer_id: newTransfer.transfer_id,
                    player_id: playerId,
                    fee: transfer_fee ? parseFloat(transfer_fee) : null,
                },
            });

            // Update player's current club
            await tx.player.update({
                where: { player_id: playerId },
                data: { current_club_id: toClubId },
            });

            return newTransfer;
        });

        return successResponse(transfer, 201);
    } catch (error) {
        return handleRouteError(error);
    }
}
