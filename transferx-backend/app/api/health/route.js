import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    // Test database connection using sqlcmd
    const { execSync } = await import('child_process');
    
    const result = execSync(
      'sqlcmd -S localhost\\SQLEXPRESS -E -C -d transferx -Q "SELECT COUNT(*) as UserCount FROM [User]"',
      { encoding: 'utf-8', timeout: 5000 }
    );

    return NextResponse.json({
      status: 'ok',
      message: 'Database connection successful',
      database: 'transferx',
      server: 'localhost\\SQLEXPRESS',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: 'Database connection failed',
        error: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}
