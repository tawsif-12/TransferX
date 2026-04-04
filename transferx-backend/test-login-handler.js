// Test calling the login route handler directly
import { POST } from './app/api/auth/admin-login/route.js';

async function testLoginHandler() {
  console.log('Testing admin-login handler...\n');
  
  const mockRequest = {
    json: async () => ({
      email: 'admin@transferx.com',
      password: 'admin123'
    })
  };

  try {
    const response = await POST(mockRequest);
    console.log('Response status:', response.status);
    const body = await response.json();
    console.log('Response body:', JSON.stringify(body, null, 2));
  } catch (error) {
    console.error('❌ Error calling login handler:', error.message);
    console.error('Stack:', error.stack);
  }
}

testLoginHandler();
