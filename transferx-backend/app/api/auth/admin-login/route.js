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
  console.log('🔐 Admin login route called');
  try {
    console.log('📩 Parsing request body...');
    const body = await request.json();
    console.log('📩 Request body parsed:', { email: body.email, passwordLength: body.password?.length });
    
    // Validate input
    console.log('✔️ Validating input against loginSchema...');
    const validation = validateData(loginSchema, body);
    console.log('✔️ Validation result:', validation.success);
    if (!validation.success) {
      console.error('❌ Validation failed:', validation.errors);
      return errorResponse(validation.errors, 400);
    }

    let { email, password } = validation.data;
    email = stripTags(email).toLowerCase();
    console.log('📧 Looking up user:', email);

    // Find user by email
    const findResult = await findUserByEmail(email);
    console.log('📧 findUserByEmail result:', { success: findResult.success, userFound: !!findResult.user });
    if (!findResult.success || !findResult.user) {
      console.warn('⚠️ User not found or lookup failed');
      return errorResponse('Invalid email or password', 401);
    }

    const userBasic = findResult.user;
    console.log('✓ User found, checking role:', userBasic.role);

    // Check if user is admin
    if (userBasic.role !== 'ADMIN') {
      console.warn('⚠️ User is not admin:', userBasic.role);
      return errorResponse('Access denied. Admin privileges required.', 401);
    }

    // Verify password
    console.log('🔑 Verifying password...');
    const isValidPassword = await bcrypt.compare(password, userBasic.password);
    console.log('🔑 Password valid:', isValidPassword);
    if (!isValidPassword) {
      console.warn('⚠️ Invalid password');
      return errorResponse('Invalid email or password', 401);
    }

    // Get full user profile
    console.log('👤 Fetching full user profile...');
    const userResult = await getUserWithProfile(userBasic.id);
    console.log('👤 getUserWithProfile result:', { success: userResult.success, userFound: !!userResult.user });
    if (!userResult.success || !userResult.user) {
      console.error('❌ User profile not found');
      return errorResponse('User not found', 401);
    }

    const user = userResult.user;
    console.log('🎫 Generating JWT token...');

    // Generate JWT token with 8-hour expiry for admin
    const token = generateToken(user.id, user.role, user.email, '8h');
    console.log('✅ Token generated successfully');

    console.log('✅ Login successful, returning response');
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
    console.error('❌ Admin login error:', error.message);
    console.error('Stack:', error.stack);
    return handleRouteError(error);
  }
}
