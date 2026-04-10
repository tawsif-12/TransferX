const bcrypt = require('bcryptjs');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Use sync version with callback
bcrypt.hash('12121212', 10, (err, hashedPassword) => {
  if (err) {
    console.error('❌ Error hashing password:', err.message);
    process.exit(1);
  }
  
  try {
    console.log('✅ New password hashed');
    
    // Update the database
    const query = `UPDATE [User] SET password = '${hashedPassword}', updated_at = GETUTCDATE() WHERE email = 'tawsifmannan1212@gmail.com';`;
    
    const tempFile = path.join(os.tmpdir(), `reset_${Date.now()}.sql`);
    fs.writeFileSync(tempFile, query, 'utf-8');
    
    const cmd = `sqlcmd -S "DESKTOP-3HO2U54\\SQLEXPRESS" -E -C -d "transferx" -i "${tempFile}" -s "," -W`;
    console.log('🔄 Executing SQL...');
    const result = execSync(cmd, { encoding: 'utf-8' });
    
    fs.unlinkSync(tempFile);
    console.log('✅ Password reset successfully!');
    console.log('🎉 You can now login with:');
    console.log('   Email: tawsifmannan1212@gmail.com');
    console.log('   Password: 12121212');
    console.log('\nGo to http://localhost:3000/login and try again!');
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
});
