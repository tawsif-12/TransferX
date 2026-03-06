import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma';

export async function GET() {
  // verify database connection
  let dbStatus = 'unavailable';
  try {
    // simple raw query to ensure Prisma can reach the database
    await prisma.$queryRaw`SELECT 1`;
    dbStatus = 'connected';
  } catch (err) {
    console.error('Database connectivity check failed:', err);
  }

  return NextResponse.json({
    message: 'TransferX API Server',
    version: '1.0.0',
    status: 'running',
    db: dbStatus,
    endpoints: {
      auth: {
        signup: 'POST /api/auth/signup',
        login: 'POST /api/auth/login',
      },
      user: {
        profile: 'GET /api/user/me',
        updateProfile: 'PUT /api/user/me',
      },
      recommendations: {
        leagues: 'GET /api/recommendations/leagues',
        opportunities: 'GET /api/recommendations/opportunities',
      },
      leagues: {
        list: 'GET /api/leagues',
        details: 'GET /api/leagues/[id]',
        clubs: 'GET /api/leagues/[id]/clubs',
      },
      clubs: {
        list: 'GET /api/clubs',
        details: 'GET /api/clubs/[id]',
        players: 'GET /api/clubs/[id]/players',
        ratings: 'GET /api/clubs/[id]/ratings',
      },
      players: {
        list: 'GET /api/players',
      },
      opportunities: {
        list: 'GET /api/opportunities',
        byClub: 'GET /api/opportunities/club/[id]',
      },
      documents: {
        list: 'GET /api/documents/list',
        upload: 'POST /api/documents/upload',
      },
      applications: {
        list: 'GET /api/applications',
        create: 'POST /api/applications',
        details: 'GET /api/applications/[id]',
        outcome: 'GET /api/applications/[id]/outcome',
      },
      ratings: {
        createClubRating: 'POST /api/ratings/club/[id]',
      },
      admin: {
        leagues: 'CRUD /api/admin/leagues',
        clubs: 'CRUD /api/admin/clubs',
        opportunities: 'CRUD /api/admin/opportunities',
        documents: 'GET /api/admin/documents',
        verifyDocument: 'PUT /api/admin/documents/[id]/verify',
        applications: 'GET /api/admin/applications',
        updateApplicationStatus: 'PUT /api/admin/applications/[id]/status',
        createOutcome: 'POST /api/admin/applications/[id]/outcome',
        ratings: 'GET /api/admin/ratings',
        moderateRating: 'PUT /api/admin/ratings/[id]',
      },
    },
  });
}
