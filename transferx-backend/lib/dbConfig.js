/**
 * Database Server Configuration Helper
 * Dynamically resolves the MSSQL server name from DATABASE_URL environment variable
 */

export function getServerName() {
    const dbUrl = process.env.DATABASE_URL;

    if (!dbUrl) {
        // Default to local server
        console.warn('DATABASE_URL not set, using local server DESKTOP-TDMF88Q\\SQLEXPRESS');
        return 'DESKTOP-TDMF88Q\\SQLEXPRESS';
    }

    // Parse sqlserver://SERVER\INSTANCE or sqlserver://SERVER:PORT
    try {
        const match = dbUrl.match(/sqlserver:\/\/([^;]+)/);
        if (match && match[1]) {
            return match[1];
        }
    } catch (e) {
        console.warn('Failed to parse DATABASE_URL, using local server');
    }

    // Fallback to local server
    return 'DESKTOP-TDMF88Q\\SQLEXPRESS';
}

export const SERVER = getServerName();
export const DATABASE = 'transferx';
