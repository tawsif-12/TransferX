const axios = require('axios');

async function testLogin() {
  try {
    console.log('🧪 Testing Login...');
    
    const response = await axios.post('http://localhost:3001/api/auth/login', {
      email: 'admin@transferx.com',
      password: 'admin123'
    });

    console.log('✅ Login Successful!');
    console.log('Response:', response.data);
    
    const token = response.data.data.token;
    console.log('Token:', token);
    
    // Now try to get dashboard
    console.log('\n🧪 Testing Admin Dashboard...');
    
    const dashboardResponse = await axios.get('http://localhost:3001/api/admin/dashboard', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✅ Dashboard Loaded!');
    console.log('Dashboard Data:', dashboardResponse.data);
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testLogin();
