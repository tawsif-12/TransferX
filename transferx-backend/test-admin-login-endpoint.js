const axios = require('axios');

async function testAdminLogin() {
  try {
    console.log('🧪 Testing Admin Login Endpoint...');
    
    const response = await axios.post('http://localhost:3001/api/auth/admin-login', {
      email: 'admin@transferx.com',
      password: 'admin123'
    });

    console.log('✅ Admin Login Successful!');
    console.log('Response:', JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testAdminLogin();
