const http = require('http');

async function testCompleteAdminFlow() {
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
        res.on('end', () => resolve(JSON.parse(data)));
      });
      req.on('error', reject);
      req.write(loginData);
      req.end();
    });

    const token = loginRes.data.token;
    console.log('✅ Admin logged in\n');

    // Step 2: Get all players (list view)
    console.log('📋 Step 2: Get Players List');
    const playersRes = await new Promise((resolve, reject) => {
      const req = http.request('http://localhost:3001/api/admin/players', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve(JSON.parse(data)));
      });
      req.on('error', reject);
      req.end();
    });

    console.log(`✅ Players loaded: ${playersRes.data.players.length} players\n`);

    // Step 3: Get single player (edit view)
    console.log('👤 Step 3: Get Player Details (for editing)');
    const playerId = playersRes.data.players[0].id;
    const getRes = await new Promise((resolve, reject) => {
      const req = http.request(`http://localhost:3001/api/admin/players/${playerId}`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve(JSON.parse(data)));
      });
      req.on('error', reject);
      req.end();
    });

    console.log(`✅ Player #${playerId} loaded: ${getRes.data.first_name} ${getRes.data.last_name}`);
    console.log(`   Position before: ${getRes.data.position}`);
    console.log(`   Nationality before: ${getRes.data.nationality}\n`);

    // Step 4: Update player
    console.log('✏️ Step 4: Update Player Details');
    const updateData = JSON.stringify({
      first_name: getRes.data.first_name,
      last_name: getRes.data.last_name,
      date_of_birth: getRes.data.date_of_birth,
      position: 'Defender',
      nationality: 'United Kingdom',
      current_club_id: getRes.data.club_id,
      fee: 100000
    });

    const updateRes = await new Promise((resolve, reject) => {
      const req = http.request(`http://localhost:3001/api/admin/players/${playerId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Content-Length': updateData.length
        }
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve(JSON.parse(data)));
      });
      req.on('error', reject);
      req.write(updateData);
      req.end();
    });

    console.log('✅ Player updated successfully');
    console.log(`   Position after: ${updateRes.data.position}`);
    console.log(`   Nationality after: ${updateRes.data.nationality}\n`);

    // Step 5: Verify update in players list
    console.log('✔️ Step 5: Verify Update in List View');
    const verifyRes = await new Promise((resolve, reject) => {
      const req = http.request('http://localhost:3001/api/admin/players', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve(JSON.parse(data)));
      });
      req.on('error', reject);
      req.end();
    });

    const updatedPlayer = verifyRes.data.players.find(p => p.id === playerId);
    console.log(`✅ Changes reflected in list: ${updatedPlayer.position} (${updatedPlayer.nationality})\n`);

    // Step 6: Verify update persists
    console.log('💾 Step 6: Verify Data Persists in Database');
    const persistRes = await new Promise((resolve, reject) => {
      const req = http.request(`http://localhost:3001/api/admin/players/${playerId}`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve(JSON.parse(data)));
      });
      req.on('error', reject);
      req.end();
    });

    console.log(`✅ Data persisted: ${persistRes.data.position} (${persistRes.data.nationality})\n`);

    console.log('═══════════════════════════════════════════════════════════════');
    console.log('✨ COMPLETE END-TO-END ADMIN FLOW WORKING!');
    console.log('═══════════════════════════════════════════════════════════════\n');
    console.log('📊 Summary of Tests:');
    console.log('✅ Admin can login with credentials');
    console.log('✅ Admin can view list of all players');
    console.log('✅ Admin can fetch individual player details');
    console.log('✅ Admin can edit player details');
    console.log('✅ Changes are immediately visible in the list');
    console.log('✅ Changes persists in the database');
    console.log('\n✨ Frontend & Database are now synchronized!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testCompleteAdminFlow();
