import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/middleware';
import { successResponse, errorResponse, handleRouteError } from '@/lib/response';
import { validateData, userUpdateSchema } from '@/lib/validation';

/**
 * GET /api/user/me
 * Get current user profile
 */
export async function GET(request) {
  try {
    const authUser = await requireAuth(request);
    if (authUser instanceof NextResponse) return authUser;

    const user = await prisma.user.findUnique({
      where: { id: authUser.userId },
      include: {
        playerProfile: {
          include: {
            currentClub: {
              include: {
                league: true,
              },
            },
          },
        },
        agentProfile: true,
        managedClub: {
          include: {
            league: true,
          },
        },
      },
      omit: {
        password: true,
      },
    });

    if (!user) {
      return errorResponse('User not found', 404);
    }

    return successResponse(user);
  } catch (error) {
    return handleRouteError(error);
  }
}

/**
 * PUT /api/user/me
 * Update current user profile
 */
export async function PUT(request) {
  try {
    const authUser = await requireAuth(request);
    if (authUser instanceof NextResponse) return authUser;

    const body = await request.json();
    
    // Validate input
    const validation = validateData(userUpdateSchema, body);
    if (!validation.success) {
      return errorResponse(validation.errors, 400);
    }

    const { fullName, playerProfile } = validation.data;

    // Update user
    const updateData = {};
    if (fullName) updateData.fullName = fullName;

    const user = await prisma.user.update({
      where: { id: authUser.userId },
      data: updateData,
      omit: {
        password: true,
      },
    });

    // Update player profile if provided and user is a player
    if (playerProfile && authUser.role === 'PLAYER') {
      // Convert dateOfBirth string to Date if provided
      if (playerProfile.dateOfBirth) {
        playerProfile.dateOfBirth = new Date(playerProfile.dateOfBirth);
      }

      await prisma.playerProfile.upsert({
        where: { userId: authUser.userId },
        update: playerProfile,
        create: {
          userId: authUser.userId,
          ...playerProfile,
          position: playerProfile.position || 'FORWARD',
          nationality: playerProfile.nationality || '',
        },
      });
    }

    // Fetch updated user with all relations
    const updatedUser = await prisma.user.findUnique({
      where: { id: authUser.userId },
      include: {
        playerProfile: {
          include: {
            currentClub: {
              include: {
                league: true,
              },
            },
          },
        },
        agentProfile: true,
        managedClub: {
          include: {
            league: true,
          },
        },
      },
      omit: {
        password: true,
      },
    });

    return successResponse(updatedUser);
  } catch (error) {
    return handleRouteError(error);
  }
}
