/**
 * Cache headers for API responses
 * Adds appropriate cache-control headers to reduce unnecessary requests
 */

export function withCacheHeaders(response, maxAge = 300) {
  response.headers.set('Cache-Control', `public, max-age=${maxAge}`);
  return response;
}

export function withNoCacheHeaders(response) {
  response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Expires', '0');
  return response;
}
