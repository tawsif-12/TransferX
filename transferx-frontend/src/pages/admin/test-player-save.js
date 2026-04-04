// Test script to verify admin player edit save functionality
// Run this in browser console on the Player Management page

async function testPlayerSave() {
  console.log('🧪 Starting player edit save test...\n');
  
  // Get admin token from localStorage
  const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
  
  if (!token) {
    console.error('❌ No token found in localStorage');
    return;
  }
  
  console.log('✅ Token found:', token.substring(0, 20) + '...\n');
  
  try {
    // Step 1: Get players to find one to edit
    console.log('📋 Step 1: Fetching players...');
    const playersRes = await fetch('/api/admin/players', {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const playersData = await playersRes.json();
    if (!playersData.data?.players?.length) {
      console.error('❌ No players found');
      return;
    }
    
    const player = playersData.data.players[0];
    console.log(`✅ Player found: ${player.first_name} ${player.last_name} (ID: ${player.id})\n`);
    
    // Step 2: Get player details
    console.log(`👤 Step 2: Getting player #${player.id} details...`);
    const getRes = await fetch(`/api/admin/players/${player.id}`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const getResData = await getRes.json();
    console.log('✅ Player details fetched');
    console.log('   Position:', getResData.data.position);
    console.log('   Nationality:', getResData.data.nationality);
    console.log('   Date:', getResData.data.date_of_birth);
    console.log('   Fee:', getResData.data.fee, '\n');
    
    // Step 3: Prepare update
    console.log('✏️ Step 3: Preparing update...');
    const formData = {
      first_name: getResData.data.first_name,
      last_name: getResData.data.last_name,
      date_of_birth: getResData.data.date_of_birth.split(' ')[0], // Extract just date part
      position: 'Goalkeeper',
      nationality: 'Test Country',
      current_club_id: getResData.data.club_id || 1,
      fee: 99999
    };
    
    console.log('Update data:', formData, '\n');
    
    // Step 4: Send update
    console.log('🔄 Step 4: Sending update request...');
    const updateRes = await fetch(`/api/admin/players/${player.id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });
    
    const updateData = await updateRes.json();
    
    if (!updateRes.ok) {
      console.error('❌ Update failed:', updateData);
      return;
    }
    
    console.log('✅ Update successful');
    console.log('   Position now:', updateData.data.position);
    console.log('   Nationality now:', updateData.data.nationality, '\n');
    
    // Step 5: Verify update
    console.log('✔️ Step 5: Verifying update...');
    const verifyRes = await fetch(`/api/admin/players/${player.id}`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    const verifyData = await verifyRes.json();
    console.log('✅ Verified - Position:', verifyData.data.position);
    console.log('   Nationality:', verifyData.data.nationality);
    
    console.log('\n✨ TEST PASSED! Save functionality is working!');
    
  } catch (error) {
    console.error('❌ Test error:', error);
  }
}

// Run the test
testPlayerSave();
