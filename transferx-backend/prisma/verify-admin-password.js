const bcrypt = require('bcryptjs');

async function verifyPassword() {
  try {
    // Hashed password from database
    const hashedPassword = '$2a$10$HaSKFp0RlCDYcL7JKK1/oOXT3n1N1Js4J9N2kRnbUM/ar3Txb1u3m';
    const plainPassword = 'admin123';
    
    // Verify password
    const isValid = await bcrypt.compare(plainPassword, hashedPassword);
    
    console.log('\n🔐 PASSWORD VERIFICATION\n');
    console.log('Plain Password:', plainPassword);
    console.log('Hashed Password:', hashedPassword);
    console.log('Password Valid:', isValid ? '✅ YES' : '❌ NO');
    
    if (isValid) {
      console.log('\n✅ Password matches! Login should work now.\n');
    } else {
      console.log('\n❌ Password does not match. There might be an issue.\n');
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

verifyPassword();
