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

    // Find user
    const findResult = await findUserByEmail(email);
    if (!findResult.success || !findResult.user) {
      return errorResponse('Invalid email or password', 401);
    }

    const userBasic = findResult.user;

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

    // Generate JWT token
    const token = generateToken(user.id, user.role, user.email);

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
    console.error('Login error:', error);
    return handleRouteError(error);
  }
}
