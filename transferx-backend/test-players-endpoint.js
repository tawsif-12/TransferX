const http = require('http');

async function testPlayersAPI() {
  try {
    // Step 1: Login
    console.log('🔐 Logging in admin...');
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
        res.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(new Error(`Invalid JSON: ${data}`));
          }
        });
      });
      req.on('error', reject);
      req.write(loginData);
      req.end();
    });

    if (!loginRes.data?.token) {
      throw new Error('No token in login response: ' + JSON.stringify(loginRes));
    }

    const token = loginRes.data.token;
    console.log('✅ Login successful, token:', token.substring(0, 20) + '...');
    console.log('');

    // Step 2: Get players
    console.log('👥 Fetching players...');
    const playersRes = await new Promise((resolve, reject) => {
      const req = http.request('http://localhost:3001/api/admin/players', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(new Error(`Invalid JSON: ${data}`));
          }
        });
      });
      req.on('error', reject);
      req.end();
    });

    console.log('✅ Players response:', JSON.stringify(playersRes, null, 2));

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testPlayersAPI();
