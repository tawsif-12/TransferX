import { NextResponse } from 'next/server';
import { generateToken } from '@/lib/auth';
import { successResponse, errorResponse } from '@/lib/response';

/**
 * POST /api/auth/admin-login
 * Simple admin login for testing (no password verification needed)
 * Used to get JWT token for admin routes
 */
export async function POST(request) {
    try {
        const body = await request.json();
        const { email } = body;

        if (!email) {
            return errorResponse('Email is required', 400);
        }

        // For testing purposes, generate a token with ADMIN role
        // In production, you would verify credentials against a database
        const token = generateToken(Math.random(), 'ADMIN', email);

        return successResponse({
            token,
            role: 'ADMIN',
            email,
            message: 'Admin token generated successfully. Use this token in Authorization header as: Bearer <token>',
        });
    } catch (error) {
        console.error('Admin login error:', error);
        return errorResponse('Internal server error', 500);
    }
}
