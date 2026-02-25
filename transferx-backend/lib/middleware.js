import { NextResponse } from 'next/server';
import { extractToken, verifyToken } from './auth';

/**
 * Auth middleware helper for API routes
 * Usage: const authUser = await requireAuth(request);
 */
export async function requireAuth(request, requiredRole = null) {
  const authHeader = request.headers.get('authorization');
  const token = extractToken(authHeader);

  if (!token) {
    return NextResponse.json(
      { success: false, error: 'No token provided' },
      { status: 401 }
    );
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return NextResponse.json(
      { success: false, error: 'Invalid or expired token' },
      { status: 401 }
    );
  }

  // Check role if required
  if (requiredRole && decoded.role !== requiredRole) {
    return NextResponse.json(
      { success: false, error: 'Insufficient permissions' },
      { status: 403 }
    );
  }

  return decoded;
}

/**
 * Check if user has any of the specified roles
 */
export async function requireAnyRole(request, allowedRoles = []) {
  const authHeader = request.headers.get('authorization');
  const token = extractToken(authHeader);

  if (!token) {
    return NextResponse.json(
      { success: false, error: 'No token provided' },
      { status: 401 }
    );
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return NextResponse.json(
      { success: false, error: 'Invalid or expired token' },
      { status: 401 }
    );
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(decoded.role)) {
    return NextResponse.json(
      { success: false, error: 'Insufficient permissions' },
      { status: 403 }
    );
  }

  return decoded;
}

/**
 * Get auth user from request (optional auth - returns null if not authenticated)
 */
export async function getAuthUser(request) {
  const authHeader = request.headers.get('authorization');
  const token = extractToken(authHeader);

  if (!token) {
    return null;
  }

  const decoded = verifyToken(token);
  return decoded || null;
}
