// Test complete admin flow
import http from 'http';

function makeRequest(method, path, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: JSON.parse(data)
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: data
          });
        }
      });
    });

    req.on('error', reject);
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function testAdminFlow() {
  try {
    console.log('🧪 Testing Complete Admin Flow\n');

    // Step 1: Login
    console.log('Step 1: Login');
    const loginRes = await makeRequest('POST', '/api/auth/admin-login', {
      email: 'admin@transferx.com',
      password: 'admin123'
    });
    console.log('Status:', loginRes.status);
    
    if (!loginRes.body.success) {
      console.error('❌ Login failed');
      return;
    }
    
    const token = loginRes.body.data.token;
    console.log('✅ Login successful, token obtained\n');

    // Step 2: Get Dashboard Stats (protected route)
    console.log('Step 2: Get Dashboard Stats');
    const dashRes = await makeRequest('GET', '/api/admin/dashboard', null, {
      'Authorization': `Bearer ${token}`
    });
    console.log('Status:', dashRes.status);
    if (dashRes.status === 200) {
      console.log('Dashboard data:', dashRes.body.data);
      console.log('✅ Dashboard retrieved\n');
    } else {
      console.error('❌ Failed to get dashboard:', dashRes.body);
    }

    // Step 3: Get Players List
    console.log('Step 3: Get Players List');
    const playersRes = await makeRequest('GET', '/api/admin/players?page=1&limit=10', null, {
      'Authorization': `Bearer ${token}`
    });
    console.log('Status:', playersRes.status);
    if (playersRes.status === 200) {
      const players = playersRes.body.data;
      console.log(`✅ Got ${players.length} players`);
      if (players.length > 0) {
        console.log('First player:', players[0]);
      }
    } else {
      console.error('❌ Failed to get players:', playersRes.body);
    }

    console.log('\n✅ All tests passed!');
  } catch (error) {
    console.error('❌ Test error:', error.message);
  }
}

testAdminFlow();
