import DOMPurify from 'dompurify';

/**
 * Sanitize HTML to prevent XSS attacks
 */
export function sanitizeHTML(html) {
  if (!html) return '';
  return DOMPurify.sanitize(html);
}

/**
 * Sanitize general input
 */
export function sanitizeInput(input) {
  if (!input) return '';
  
  // Remove HTML tags
  const withoutTags = input.replace(/<[^>]*>/g, '');
  
  // Trim whitespace
  return withoutTags.trim();
}

/**
 * Sanitize email
 */
export function sanitizeEmail(email) {
  if (!email) return '';
  
  return email
    .toLowerCase()
    .trim()
    .replace(/[<>'"]/g, '');
}

/**
 * Sanitize name
 */
export function sanitizeName(name) {
  if (!name) return '';
  
  return name
    .trim()
    .replace(/[<>'"]/g, '')
    .replace(/\s+/g, ' ');
}

/**
 * Sanitize password (basic sanitization, no need to remove special chars)
 */
export function sanitizePassword(password) {
  if (!password) return '';
  
  // Just trim, passwords can have special characters
  return password.trim();
}

/**
 * Sanitize URL
 */
export function sanitizeURL(url) {
  if (!url) return '';
  
  try {
    const parsedURL = new URL(url);
    // Only allow http and https protocols
    if (parsedURL.protocol !== 'http:' && parsedURL.protocol !== 'https:') {
      return '';
    }
    return parsedURL.href;
  } catch {
    return '';
  }
}
