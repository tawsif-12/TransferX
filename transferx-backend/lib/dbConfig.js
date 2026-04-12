/**
 * Database Server Configuration Helper
 * Dynamically resolves the MSSQL server name from DATABASE_URL environment variable
 */

export function getServerName() {
    const dbUrl = process.env.DATABASE_URL;

    if (!dbUrl) {
        // Default to local server
        console.warn('DATABASE_URL not set, using local server .\\SQLEXPRESS');
        return '.\\SQLEXPRESS';
    }

    // Parse sqlserver://SERVER\INSTANCE or sqlserver://SERVER:PORT
    try {
        const match = dbUrl.match(/sqlserver:\/\/([^;]+)/);
        if (match && match[1]) {
            // Convert colon to comma for sqlcmd (e.g., DESKTOP-3HO2U54:56737 -> DESKTOP-3HO2U54,56737)
            return match[1].replace(':', ',');
        }
    } catch (e) {
        console.warn('Failed to parse DATABASE_URL, using local server');
    }

    // Fallback to local server
    return '.\\SQLEXPRESS';
}

export const SERVER = getServerName();
export const DATABASE = 'transferx';

// Debug logging
if (typeof console !== 'undefined') {
    console.log('[dbConfig.js] DATABASE_URL:', process.env.DATABASE_URL);
    console.log('[dbConfig.js] Extracted SERVER:', SERVER);
}
