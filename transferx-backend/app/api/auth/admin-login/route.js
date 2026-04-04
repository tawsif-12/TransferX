import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { generateToken } from '@/lib/auth';
import { successResponse, errorResponse, handleRouteError } from '@/lib/response';
import { validateData, loginSchema } from '@/lib/validation';
import { findUserByEmail, getUserWithProfile } from '@/lib/authDB';

// simple server-side sanitization helper
const stripTags = (s = '') => s.replace(/<[^>]*>/g, '').replace(/&lt;|&gt;/g, '');

export async function OPTIONS(request) {
  return new NextResponse(null, { status: 200 });
}

/**
 * POST /api/auth/admin-login
 * Admin-only login endpoint with role verification
 */
export async function POST(request) {
  try {
    const body = await request.json();
    
    // Validate input
    const validation = validateData(loginSchema, body);
    if (!validation.success) {
      return errorResponse(validation.errors, 400);
    }

    let { email, password } = validation.data;
    email = stripTags(email).toLowerCase();

    // Find user by email
    const findResult = await findUserByEmail(email);
    if (!findResult.success || !findResult.user) {
      return errorResponse('Invalid email or password', 401);
    }

    const userBasic = findResult.user;

    // Check if user is admin
    if (userBasic.role !== 'ADMIN') {
      return errorResponse('Access denied. Admin privileges required.', 401);
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, userBasic.password);
    if (!isValidPassword) {
      return errorResponse('Invalid email or password', 401);
    }

    // Get full user profile
    const userResult = await getUserWithProfile(userBasic.id);
    if (!userResult.success || !userResult.user) {
      return errorResponse('User not found', 401);
    }

    const user = userResult.user;

    // Generate JWT token with 8-hour expiry for admin
    const token = generateToken(user.id, user.role, user.email, '8h');

    return successResponse({
      token,
      role: user.role,
      user: {
        name: user.fullName || user.email,
        email: user.email,
        id: user.id,
        role: user.role,
        playerProfile: user.playerProfile || null,
        agentProfile: user.agentProfile || null,
      },
    });
  } catch (error) {
    console.error('Admin login error:', error);
    return handleRouteError(error);
  }
}
