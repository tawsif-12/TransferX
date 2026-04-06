const bcrypt = require('bcryptjs');
const { execSync } = require('child_process');
const password = 'admin123';
const hash = bcrypt.hashSync(password, 10);

// Replace single quotes with double single quotes for SQL
const escapedHash = hash.replace(/'/g, "''");

console.log('Original hash:', hash);
console.log('Escaped hash:', escapedHash);

const sqlCommand = `sqlcmd -S ".\\SQLEXPRESS" -E -C -d "transferx" -Q "INSERT INTO [User] (email, password, fullName, role, created_at, updated_at) VALUES ('admin@transferx.com', '${escapedHash}', 'Admin User', 'ADMIN', GETDATE(), GETDATE()); SELECT 'Admin user created' AS Message;"`;

console.log('Executing SQL...');
try {
    const result = execSync(sqlCommand, { encoding: 'utf-8' });
    console.log('Result:', result);
} catch (error) {
    console.error('Error:', error.message);
}
