const http = require('http');

async function testAdminEndpoints() {
  try {
    // Step 1: Login
    console.log('🔐 Step 1: Admin Login');
    const loginData = JSON.stringify({
      email: 'admin@transferx.com',
      password: 'admin123'
    });

    const loginRes = await new Promise((resolve, reject) => {
      const req = http.request('http://localhost:3001/api/auth/admin-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': loginData.length
        }
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve({ status: res.statusCode, data: JSON.parse(data), headers: res.headers }));
      });
      req.on('error', reject);
      req.write(loginData);
      req.end();
    });

    if (loginRes.status !== 200) {
      console.error(`❌ Login failed with status ${loginRes.status}:`, loginRes.data);
      return;
    }

    const token = loginRes.data.data.token;
    console.log('✅ Admin logged in\n');

    // Test multiple endpoints
    const endpoints = [
      { method: 'GET', path: '/admin/dashboard', name: 'Dashboard' },
      { method: 'GET', path: '/admin/players', name: 'Players List' },
      { method: 'GET', path: '/clubs', name: 'Clubs List' },
    ];

    for (const endpoint of endpoints) {
      console.log(`🔗 Testing: ${endpoint.name} (${endpoint.method} ${endpoint.path})`);
      
      try {
        const res = await new Promise((resolve, reject) => {
          const req = http.request(`http://localhost:3001/api${endpoint.path}`, {
            method: endpoint.method,
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve({ status: res.statusCode, data: JSON.parse(data) }));
          });
          req.on('error', reject);
          req.end();
        });

        if (res.status === 200) {
          console.log(`✅ Success (${res.status})`);
        } else {
          console.log(`⚠️ Status ${res.status}: ${res.data.error || 'Unknown error'}`);
        }
      } catch (err) {
        console.error(`❌ Network error: ${err.message}`);
      }
      console.log('');
    }

  } catch (error) {
    console.error('❌ Fatal error:', error.message);
    process.exit(1);
  }
}

testAdminEndpoints();
