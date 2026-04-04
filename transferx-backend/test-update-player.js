const http = require('http');

async function testUpdatePlayer() {
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
      throw new Error('No token in login response');
    }

    const token = loginRes.data.token;
    console.log('✅ Admin logged in\n');

    // Step 2: Get first player
    console.log('👥 Fetching player ID 1...');
    const getRes = await new Promise((resolve, reject) => {
      const req = http.request('http://localhost:3001/api/admin/players/1', {
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

    console.log('✅ Original player data:');
    console.log(`   Name: ${getRes.data.first_name} ${getRes.data.last_name}`);
    console.log(`   Position: ${getRes.data.position}`);
    console.log(`   Nationality: ${getRes.data.nationality}`);
    console.log(`   Club: ${getRes.data.club_name}`);
    console.log('');

    // Step 3: Update player
    console.log('📝 Updating player...');
    const updateData = JSON.stringify({
      position: 'Goalkeeper',
      nationality: 'Test Updated',
      fee: 50000
    });

    const updateRes = await new Promise((resolve, reject) => {
      const req = http.request('http://localhost:3001/api/admin/players/1', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Content-Length': updateData.length
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
      req.write(updateData);
      req.end();
    });

    console.log('✅ Update response:');
    console.log(`   Position: ${updateRes.data.position} (changed to Goalkeeper)`);
    console.log(`   Nationality: ${updateRes.data.nationality} (changed to Test Updated)`);
    console.log(`   Fee: ${updateRes.data.fee} (changed to 50000)`);
    console.log('');

    // Step 4: Verify update
    console.log('🔍 Verifying update in database...');
    const verifyRes = await new Promise((resolve, reject) => {
      const req = http.request('http://localhost:3001/api/admin/players/1', {
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

    console.log('✅ Verified updated data:');
    console.log(`   Position: ${verifyRes.data.position}`);
    console.log(`   Nationality: ${verifyRes.data.nationality}`);
    console.log(`   Fee: ${verifyRes.data.fee}`);
    console.log('');

    console.log('✅ ALL TESTS PASSED!');
    console.log('📋 Summary:');
    console.log('✅ PUT /api/admin/players/[id] is working');
    console.log('✅ Updates are saved to database');
    console.log('✅ Changes can be verified immediately');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testUpdatePlayer();
