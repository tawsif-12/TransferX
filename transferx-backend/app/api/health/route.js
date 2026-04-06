import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    // Test database connection using sqlcmd with local server
    const { execSync } = await import('child_process');
    
    console.log('Starting health check...');
    const result = execSync(
      'sqlcmd -S .\\SQLEXPRESS -E -C -d transferx -Q "SELECT COUNT(*) as UserCount FROM [User]"',
      { encoding: 'utf-8', timeout: 15000 }
    );

    console.log('Database connection successful:', result);
    return NextResponse.json({
      status: 'ok',
      message: 'Database connection successful',
      database: 'transferx',
      server: '.\\SQLEXPRESS',
      timestamp: new Date().toISOString(),
      result: result
    });
  } catch (error) {
    console.error('Health check error:', error.message);
    console.error('Error details:', error);
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
