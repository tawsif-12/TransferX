import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { generateToken } from '@/lib/auth';
import { successResponse, errorResponse, handleRouteError } from '@/lib/response';
import { validateData, signupSchema } from '@/lib/validation';
import { createUser, emailExists, getUserWithProfile } from '@/lib/authDB';

export async function OPTIONS(request) {
  return new NextResponse(null, { status: 200 });
}

export async function POST(request) {
  try {
    const body = await request.json();
    console.log('Signup attempt:', { email: body.email, fullName: body.fullName, role: body.role });

    // Validate input
    const validation = validateData(signupSchema, body);
    if (!validation.success) {
      console.log('Validation failed:', validation.errors);
      return errorResponse(validation.errors, 400);
    }

    let { email, password, fullName, role } = validation.data;

    // Strip any leftover tags just in case (should be caught by schema)
    const stripTags = (s) => s.replace(/<[^>]*>/g, '').replace(/&lt;|&gt;/g, '');
    email = stripTags(email).toLowerCase();
    fullName = stripTags(fullName);

    // Validate and normalize role
    const validRoles = ['PLAYER', 'AGENT', 'CLUB_MANAGER'];
    if (!role || !validRoles.includes(role.toUpperCase())) {
      role = 'PLAYER';
    } else {
      role = role.toUpperCase();
    }

    console.log('Processed data:', { email, fullName, role });

    // Check if user already exists
    const exists = await emailExists(email);
    if (exists) {
      console.log('Email already exists:', email);
      return errorResponse('Email already registered', 409);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Password hashed');

    // Create user with profile based on role
    console.log('Creating user...');
    const createResult = await createUser(email, hashedPassword, fullName, role);
    console.log('Create result:', createResult);

    if (!createResult.success) {
      console.log('Failed to create user:', createResult.error);
      return errorResponse(createResult.error || 'Failed to create user', 500);
    }

    const userId = createResult.userId;
    console.log('User created with ID:', userId);

    // Get user with profile
    const userResult = await getUserWithProfile(userId);
    console.log('User profile result:', userResult);

    if (!userResult.success || !userResult.user) {
      console.log('Failed to retrieve user profile');
      return errorResponse('Failed to retrieve user', 500);
    }

    const user = userResult.user;

    // Generate JWT token
    const token = generateToken(user.id, user.role, user.email);

    console.log('Signup successful for:', email);
    return successResponse(
      {
        token,
        role: user.role,
        user: {
          name: user.fullName,
          email: user.email,
          id: user.id,
          role: user.role,
        },
      },
      201
    );
  } catch (error) {
    console.error('Signup error:', error);
    return handleRouteError(error);
  }
}
