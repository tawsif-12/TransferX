// Test all imports needed by admin-login route
async function testImports() {
  try {
    const { NextResponse } = await import('next/server');
    console.log('✅ NextResponse imported');
  } catch (error) {
    console.error('❌ Failed to import NextResponse:', error.message);
  }

  try {
    const bcrypt = await import('bcryptjs');
    console.log('✅ bcryptjs imported');
  } catch (error) {
    console.error('❌ Failed to import bcryptjs:', error.message);
  }

  try {
    const { generateToken } = await import('./lib/auth.js');
    console.log('✅ generateToken imported from @/lib/auth');
  } catch (error) {
    console.error('❌ Failed to import generateToken:', error.message);
  }

  try {
    const { successResponse, errorResponse, handleRouteError } = await import('./lib/response.js');
    console.log('✅ successResponse, errorResponse, handleRouteError imported from @/lib/response');
  } catch (error) {
    console.error('❌ Failed to import response helpers:', error.message);
  }

  try {
    const { validateData, loginSchema } = await import('./lib/validation.js');
    console.log('✅ validateData, loginSchema imported from @/lib/validation');
  } catch (error) {
    console.error('❌ Failed to import validation:', error.message);
  }

  try {
    const { findUserByEmail, getUserWithProfile } = await import('./lib/authDB.js');
    console.log('✅ findUserByEmail, getUserWithProfile imported from @/lib/authDB');
  } catch (error) {
    console.error('❌ Failed to import authDB functions:', error.message);
  }

  console.log('\nAll imports checked!');
}

testImports();
