// Test if authDB can be imported
import * as authDB from './lib/authDB.js';
import * as dbConfig from './lib/dbConfig.js';

try {
  console.log('✅ authDB imported successfully');
  console.log('✅ Exported functions:', Object.keys(authDB));
} catch (error) {
  console.error('❌ Failed to import authDB:', error.message);
}

try {
  console.log('✅ dbConfig imported successfully');
  console.log('   SERVER:', dbConfig.SERVER);
  console.log('   DATABASE:', dbConfig.DATABASE);
} catch (error) {
  console.error('❌ Failed to import dbConfig:', error.message);
}

