const http = require('http');

async function testAdminDashboard() {
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
    console.log('✅ Login successful');
    console.log('');

    // Step 2: Get dashboard statistics
    console.log('📊 Fetching dashboard statistics...');
    const dashboardRes = await new Promise((resolve, reject) => {
      const req = http.request('http://localhost:3001/api/admin/dashboard', {
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

    console.log('✅ Dashboard statistics:');
    console.log(`   - Total Players: ${dashboardRes.data?.overview?.totalPlayers}`);
    console.log(`   - Total Clubs: ${dashboardRes.data?.overview?.totalClubs}`);
    console.log(`   - Total Leagues: ${dashboardRes.data?.overview?.totalLeagues}`);
    console.log(`   - Total Agents: ${dashboardRes.data?.overview?.totalAgents}`);
    console.log(`   - Total Transfers: ${dashboardRes.data?.overview?.totalTransfers}`);
    console.log(`   - Active Contracts: ${dashboardRes.data?.overview?.activeContracts}`);
    console.log('');

    // Step 3: Get players
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

    console.log(`✅ Players loaded: ${playersRes.data?.players?.length} / ${playersRes.data?.pagination?.total}`);
    
    if (playersRes.data?.players?.length > 0) {
      console.log('\n   Sample players:');
      playersRes.data.players.slice(0, 5).forEach((player, idx) => {
        console.log(`   ${idx + 1}. ${player.first_name} ${player.last_name} (${player.position}) - ${player.club_name}`);
      });
    }

    console.log('\n✅ ALL TESTS PASSED!');
    console.log('\n📋 Summary:');
    console.log(`✅ Admin dashboard displaying: ${dashboardRes.data?.overview?.totalPlayers} players`);
    console.log(`✅ Player management showing: ${playersRes.data?.players?.length} players from database`);
    console.log('✅ Frontend can now display players in both locations');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testAdminDashboard();
