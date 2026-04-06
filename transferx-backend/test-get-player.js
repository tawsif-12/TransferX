const http = require('http');

async function testGetPlayer() {
  try {
    // Step 1: Login
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
        res.on('end', () => resolve(JSON.parse(data)));
      });
      req.on('error', reject);
      req.write(loginData);
      req.end();
    });

    const token = loginRes.data.token;
    console.log('Token obtained');

    // Get player
    const getRes = await new Promise((resolve, reject) => {
      const req = http.request('http://localhost:3001/api/admin/players/1', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve(JSON.parse(data)));
      });
      req.on('error', reject);
      req.end();
    });

    console.log('Response:', JSON.stringify(getRes, null, 2));

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

testGetPlayer();
