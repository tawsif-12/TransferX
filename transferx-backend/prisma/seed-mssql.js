const sql = require('mssql');
const bcrypt = require('bcryptjs');

const pool = new sql.ConnectionPool({
    server: 'localhost\\SQLEXPRESS',
    database: 'transferx',
    authentication: {
        type: 'default',
        options: {
            userName: undefined,
            password: undefined
        }
    },
    options: {
        trustServerCertificate: true,
        encrypt: false,
        enableKeepAlive: true
    }
});

const ps = new sql.PreparedStatement(pool);

async function seedData() {
    try {
        await pool.connect();
        console.log('✅ Connected to database');

        // Check if admin already exists
        const checkResult = await sql.query`SELECT COUNT(*) as cnt FROM [User] WHERE email='admin@transferx.com'`.catch(() => ({ recordset: [{ cnt: 0 }] }));

        if (checkResult.recordset && checkResult.recordset[0].cnt > 0) {
            console.log('⚠️ Admin user already exists, skipping insert');
        } else {
            const adminPassword = await bcrypt.hash('admin123', 10);

            await sql.query`
        INSERT INTO [User] (email, password, fullName, role, updated_at)
        VALUES ('admin@transferx.com', ${adminPassword}, 'Admin User', 'ADMIN', GETDATE())
      `;
            console.log('✅ Admin user created');
        }

        // Verify data
        const result = await sql.query`SELECT * FROM [User]`;
        console.log(`✅ Total users in database: ${result.recordset.length}`);

        result.recordset.forEach(user => {
            console.log(`   - ${user.email} (${user.role})`);
        });

    } catch (err) {
        console.error('❌ Error:', err.message);
    } finally {
        await pool.close();
    }
}

seedData();
