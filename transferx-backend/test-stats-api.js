// Test what the stats API returns
async function testStatsAPI() {
  try {
    const response = await fetch('http://localhost:3001/api/stats');
    const data = await response.json();
    
    console.log('Stats API Response:');
    console.log('==================');
    console.log('Full response:', JSON.stringify(data, null, 2));
    console.log('\n');
    console.log('totalPlayerMarketValue:', data.data.overview.totalPlayerMarketValue);
    console.log('Type:', typeof data.data.overview.totalPlayerMarketValue);
    console.log('Value / 1000000:', data.data.overview.totalPlayerMarketValue / 1000000);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testStatsAPI();
