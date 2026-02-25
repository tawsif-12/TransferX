import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

/**
 * Generate JWT token for user
 */
export function generateToken(userId, role, email) {
  return jwt.sign(
    { userId, role, email },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

/**
 * Verify JWT token
 */
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

/**
 * Extract token from Authorization header
 */
export function extractToken(authHeader) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}
