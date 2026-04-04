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
        res.on('end', () => resolve({ status: res.statusCode, data: data, headers: res.headers }));
      });
      req.on('error', reject);
      req.write(loginData);
      req.end();
    });

    console.log(`Response status: ${loginRes.status}`);
    console.log(`Response headers:`, loginRes.headers);
    console.log(`Response body (first 500 chars):`);
    console.log(loginRes.data.substring(0, 500));
    console.log('');

    // Try to parse if valid JSON
    try {
      const parsed = JSON.parse(loginRes.data);
      console.log('✅ Valid JSON response');
      if (loginRes.status === 200) {
        console.log('✅ Login successful');
        const token = parsed.data.token;
        console.log('Token obtained:', token.substring(0, 20) + '...\n');
      } else {
        console.error('❌ Login failed with status', loginRes.status);
      }
    } catch (e) {
      console.error('❌ Response is not valid JSON');
      console.error('This indicates a server error');
    }

  } catch (error) {
    console.error('❌ Fatal error:', error.message);
    process.exit(1);
  }
}

testAdminEndpoints();
