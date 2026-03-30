import { execSync } from 'child_process';

/**
 * Health check using direct sqlcmd instead of Prisma
 * This avoids Prisma/tedious driver issues with named instances
 */
export async function checkDatabaseHealth() {
    try {
        const result = execSync(
            'sqlcmd -S localhost\\SQLEXPRESS -E -C -d transferx -Q "SELECT 1"',
            { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }
        );

        // If sqlcmd succeeds, database is reachable
        if (result.includes('1')) {
            return { connected: true, status: 'connected' };
        }
    } catch (err) {
        // sqlcmd failed, database not reachable
    }

    return { connected: false, status: 'unavailable' };
}

export default checkDatabaseHealth;
