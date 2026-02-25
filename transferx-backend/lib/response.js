import { NextResponse } from 'next/server';

/**
 * Standard success response
 */
export function successResponse(data, status = 200) {
  return NextResponse.json(
    { success: true, data },
    { status }
  );
}

/**
 * Standard error response
 */
export function errorResponse(error, status = 400) {
  return NextResponse.json(
    { success: false, error },
    { status }
  );
}

/**
 * Handle async route errors
 */
export function handleRouteError(error) {
  console.error('Route error:', error);
  
  if (error.code === 'P2002') {
    return errorResponse('A record with that value already exists', 409);
  }
  
  if (error.code === 'P2025') {
    return errorResponse('Record not found', 404);
  }
  
  return errorResponse(
    error.message || 'Internal server error',
    500
  );
}
