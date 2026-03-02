import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { generateToken } from '@/lib/auth';
import { successResponse, errorResponse, handleRouteError } from '@/lib/response';
import { validateData, signupSchema } from '@/lib/validation';

export async function OPTIONS(request) {
  return new NextResponse(null, { status: 200 });
}

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Validate input
    const validation = validateData(signupSchema, body);
    if (!validation.success) {
      return errorResponse(validation.errors, 400);
    }

    const { email, password, fullName, role = 'PLAYER' } = validation.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return errorResponse('Email already registered', 409);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with profile based on role
    const userData = {
      email: email.toLowerCase(),
      password: hashedPassword,
      fullName,
      role,
    };

    // Add empty profiles based on role
    if (role === 'PLAYER') {
      userData.playerProfile = {
        create: {
          position: 'FORWARD', // Default, can be updated later
          nationality: '',
          marketValue: 0,
          goalsScored: 0,
          assists: 0,
          appearances: 0,
          rating: 0,
        },
      };
    } else if (role === 'AGENT') {
      userData.agentProfile = {
        create: {
          agency: '',
          licenseNumber: `LIC-${Date.now()}`,
          yearsExperience: 0,
        },
      };
    }

    const user = await prisma.user.create({
      data: userData,
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        created_at: true,
      },
    });

    // Generate JWT token
    const token = generateToken(user.id, user.role, user.email);

    return successResponse(
      {
        token,
        role: user.role,
        user: {
          name: user.fullName,
          email: user.email,
          ...user
        },
      },
      201
    );
  } catch (error) {
    return handleRouteError(error);
  }
}
