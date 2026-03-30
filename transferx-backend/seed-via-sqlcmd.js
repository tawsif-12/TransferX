const { execSync } = require('child_process');
const bcrypt = require('bcryptjs');

async function runSql(query) {
    try {
        const result = execSync(
            `sqlcmd -S localhost\\SQLEXPRESS -E -C -d transferx -Q "${query.replace(/"/g, '\\"')}"`,
            { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }
        );
        return result;
    } catch (err) {
        console.error('SQL Error:', err.message);
        throw err;
    }
}

async function seed() {
    try {
        console.log('🌱 Seeding database with sqlcmd...\n');

        // Create admin user
        const adminPassword = await bcrypt.hash('admin123', 10);
        const adminPasswordEscaped = adminPassword.replace(/'/g, "''");

        const insertAdminSql = `
      IF NOT EXISTS (SELECT 1 FROM [User] WHERE email = 'admin@transferx.com')
      INSERT INTO [User] (email, password, fullName, role, updated_at)
      VALUES ('admin@transferx.com', '${adminPasswordEscaped}', 'Admin User', 'ADMIN', GETDATE());
    `;

        runSql(insertAdminSql);
        console.log('✅ Admin user created/verified');

        // Create regular user
        const userPassword = await bcrypt.hash('user123', 10);
        const userPasswordEscaped = userPassword.replace(/'/g, "''");

        const insertUserSql = `
      IF NOT EXISTS (SELECT 1 FROM [User] WHERE email = 'user@transferx.com')
      INSERT INTO [User] (email, password, fullName, role, updated_at)
      VALUES ('user@transferx.com', '${userPasswordEscaped}', 'John Doe', 'PLAYER', GETDATE());
    `;

        runSql(insertUserSql);
        console.log('✅ Regular user created/verified');

        // Verify
        const verifySql = 'SELECT email, role FROM [User] ORDER BY id;';
        const result = runSql(verifySql);
        console.log('\n📊 Current Users:');
        console.log(result);

        console.log('\n✅ Seeding complete!');

    } catch (err) {
        console.error('❌ Seed error:', err.message);
        process.exit(1);
    }
}

seed();
