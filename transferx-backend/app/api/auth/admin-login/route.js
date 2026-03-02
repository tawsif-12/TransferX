import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { generateToken } from '@/lib/auth';
import { successResponse, errorResponse, handleRouteError } from '@/lib/response';
import { validateData, loginSchema } from '@/lib/validation';

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

    const { email, password } = validation.data;

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return errorResponse('Invalid email or password', 401);
    }

    // Check if user is admin
    if (user.role !== 'ADMIN') {
      return errorResponse('Access denied. Admin privileges required.', 401);
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return errorResponse('Invalid email or password', 401);
    }

    // Generate JWT token with shorter expiry for admin (8 hours)
    const token = generateToken(user.id, user.role, user.email, '8h');

    return successResponse({
      token,
      role: user.role,
      user: {
        name: user.fullName || user.email,
        email: user.email,
      },
    });
  } catch (error) {
    return handleRouteError(error);
  }
}
