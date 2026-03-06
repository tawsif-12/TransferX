import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { generateToken } from '@/lib/auth';
import { successResponse, errorResponse, handleRouteError } from '@/lib/response';
import { validateData, loginSchema } from '@/lib/validation';

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
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        playerProfile: true,
        agentProfile: true,
      },
    });

    if (!user) {
      return errorResponse('Invalid email or password', 401);
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return errorResponse('Invalid email or password', 401);
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    // Generate JWT token
    const token = generateToken(user.id, user.role, user.email);

    return successResponse({
      token,
      role: user.role,
      user: {
        name: user.fullName || user.email,
        email: user.email,
        ...userWithoutPassword
      },
    });
  } catch (error) {
    return handleRouteError(error);
  }
}
