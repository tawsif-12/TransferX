// Test players endpoint
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
            body: JSON.parse(data)
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
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

async function testPlayers() {
  try {
    // First login to get token
    const loginRes = await makeRequest('POST', '/api/auth/admin-login', {
      email: 'admin@transferx.com',
      password: 'admin123'
    });
    const token = loginRes.body.data.token;

    // Get players
    const playersRes = await makeRequest('GET', '/api/admin/players?page=1&limit=10', null, {
      'Authorization': `Bearer ${token}`
    });
    
    console.log('Players endpoint response:');
    console.log(JSON.stringify(playersRes.body, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testPlayers();
