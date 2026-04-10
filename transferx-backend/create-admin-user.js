const bcrypt = require('bcryptjs');
const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

async function createAdmin() {
  try {
    // Hash password
    const password = 'admin123';
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a SQL file instead
    const sqlFile = path.join(__dirname, 'create-admin-temp.sql');
    const query = `INSERT INTO [User] (email, password, fullName, role, created_at, updated_at)
VALUES ('admin@transferx.com', '${hashedPassword}', 'Admin User', 'ADMIN', GETDATE(), GETDATE());
SELECT * FROM [User] WHERE email = 'admin@transferx.com';`;

    fs.writeFileSync(sqlFile, query, 'utf8');

    const result = execSync(`sqlcmd -S .\\SQLEXPRESS -d transferx -C -i "${sqlFile}"`, {
      encoding: 'utf8'
    });

    fs.unlinkSync(sqlFile);

    console.log('✅ Admin user created successfully!');
    console.log('Email: admin@transferx.com');
    console.log('Password: admin123');
    console.log('\nUser details:');
    console.log(result);
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
  }
}

createAdmin();
