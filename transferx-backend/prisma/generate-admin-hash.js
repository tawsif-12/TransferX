const bcrypt = require('bcryptjs');

async function generateAdminSQL() {
  try {
    const plainPassword = 'admin123';
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    
    console.log('\n🔐 ADMIN USER SQL INSERT STATEMENT\n');
    console.log('Run this SQL command in your database:\n');
    
    const sqlInsert = `
-- Delete existing admin if exists
DELETE FROM [User] WHERE email = 'admin@transferx.com';

-- Insert new admin with hashed password
INSERT INTO [User] (email, password, fullName, role, created_at, updated_at)
VALUES (
  'admin@transferx.com',
  '${hashedPassword}',
  'Admin User',
  'ADMIN',
  GETDATE(),
  GETDATE()
);

-- Verify insert
SELECT id, email, fullName, role FROM [User] WHERE email = 'admin@transferx.com';
    `;
    
    console.log(sqlInsert);
    console.log('\nℹ️  Run this SQL in SQL Server Management Studio or sqlcmd\n');
    
    // Also output just the hash for reference
    console.log('Plain Password:', plainPassword);
    console.log('Hashed Password:', hashedPassword);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

generateAdminSQL();
