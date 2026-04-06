const sql = require('mssql');

const config = {
    server: 'DESKTOP-3HO2U54\\SQLEXPRESS',
    authentication: {
        type: 'default',
        options: {
            userName: undefined, // Windows Auth
            password: undefined
        }
    },
    options: {
        trustServerCertificate: true,
        encrypt: false,
        database: 'transferx'
    }
};

async function test() {
    const pool = new sql.ConnectionPool(config);

    try {
        await pool.connect();
        console.log('✅ Connected to SQL Server successfully!');

        const result = require('child_process').execSync('sqlcmd -S .\\SQLEXPRESS -E -C -Q "SELECT SYSDATETIME()"', { encoding: 'utf-8' });
        console.log('Current time:', result);

        await pool.close();
    } catch (err) {
        console.error('❌ Connection failed:', err.message);
    }
}

test();
