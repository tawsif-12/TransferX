import DOMPurify from 'dompurify';

/**
 * XSS Protection & Input Sanitization Utilities
 * Removes potentially dangerous HTML and scripts from user input
 */

/**
 * Determine whether a string contains HTML tags or encoded entities
 * useful for validation checks (not just sanitization)
 */
export function containsHtml(value) {
    if (!value || typeof value !== 'string') return false;
    // look for angle brackets or encoded entities that could indicate tags
    return /<[^>]*>|&lt;|&gt;/.test(value);
}

/**
 * Escape special HTML characters
 * Prevents XSS attacks by converting dangerous characters to entities
 */
export function escapeHtml(text) {
    if (!text || typeof text !== 'string') {
        return '';
    }

    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;',
    };

    return text.replace(/[&<>"']/g, (char) => map[char]);
}

/**
 * Sanitize user input by removing dangerous characters
 * Allows basic alphanumeric, spaces, and safe punctuation
 */
export function sanitizeInput(input) {
    if (!input || typeof input !== 'string') {
        return '';
    }

    // Use DOMPurify for heavy-duty sanitization when running in browser
    try {
        // Allow no tags/attributes - just strip everything dangerous
        const purified = DOMPurify.sanitize(input, {
            ALLOWED_TAGS: [],
            ALLOWED_ATTR: []
        });
        // fallback to trimming and additional cleanup
        return purified.trim().replace(/[\x00-\x1F\x7F]/g, '');
    } catch (e) {
        // if DOMPurify isn't available (e.g. during SSR), fall back to manual regex
        let sanitized = input.trim();
        sanitized = sanitized.replace(/[\x00-\x1F\x7F]/g, '');
        sanitized = sanitized.replace(/<script[^>]*>.*?<\/script>/gi, '');
        sanitized = sanitized.replace(/on\w+\s*=/gi, '');
        sanitized = sanitized.replace(/<iframe[^>]*>.*?<\/iframe>/gi, '');
        return sanitized;
    }
}

/**
 * Sanitize email input
 * Basic email validation and sanitization
 */
export function sanitizeEmail(email) {
    if (!email || typeof email !== 'string') {
        return '';
    }

    const sanitized = sanitizeInput(email).toLowerCase();

    // Basic email regex - allows alphanumeric, dots, hyphens, underscores
    const emailRegex = /^[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,}$/;

    return emailRegex.test(sanitized) ? sanitized : '';
}

/**
 * Sanitize name input
 * Allows letters, spaces, hyphens, and apostrophes
 */
export function sanitizeName(name) {
    if (!name || typeof name !== 'string') {
        return '';
    }

    let sanitized = sanitizeInput(name);

    // Allow letters, spaces, hyphens, apostrophes, and accented characters
    sanitized = sanitized.replace(/[^a-zA-Z\s\-'àáâäãåèéêëìíîïòóôöõùúûüñçÀÁÂÄÃÅÈÉÊËÌÍÎÏÒÓÔÖÕÙÚÛÜÑÇ]/g, '');

    return sanitized.trim();
}

/**
 * Sanitize password input
 * Only removes null bytes and control characters
 */
export function sanitizePassword(password) {
    if (!password || typeof password !== 'string') {
        return '';
    }

    // Only remove dangerous control characters, keep everything else for password flexibility
    return password.replace(/[\x00-\x1F\x7F]/g, '');
}

/**
 * Sanitize URL
 * Basic URL sanitization to prevent javascript: and data: URLs
 */
export function sanitizeUrl(url) {
    if (!url || typeof url !== 'string') {
        return '';
    }

    // Remove javascript:, data:, and vbscript: URLs
    if (/^(javascript:|data:|vbscript:)/i.test(url)) {
        return '';
    }

    return url.trim();
}

/**
 * Sanitize HTML content for display
 * Completely removes HTML tags
 */
export function sanitizeHtml(html) {
    if (!html || typeof html !== 'string') {
        return '';
    }

    // Use DOMPurify to strip any tags, then unescape entities
    const clean = DOMPurify.sanitize(html, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
    return clean
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'")
        .replace(/&amp;/g, '&');
}

/**
 * Sanitize object values (for form submissions)
 * Applies appropriate sanitization based on field type
 */
export function sanitizeFormData(data, schema = {}) {
    const sanitized = {};

    for (const [key, value] of Object.entries(data)) {
        const fieldType = schema[key] || 'text';

        switch (fieldType) {
            case 'email':
                sanitized[key] = sanitizeEmail(value);
                break;
            case 'name':
            case 'fullName':
                sanitized[key] = sanitizeName(value);
                break;
            case 'password':
                sanitized[key] = sanitizePassword(value);
                break;
            case 'url':
                sanitized[key] = sanitizeUrl(value);
                break;
            case 'html':
                sanitized[key] = sanitizeHtml(value);
                break;
            default:
                sanitized[key] = sanitizeInput(value);
        }
    }

    return sanitized;
}

/**
 * Content Security Policy helper
 * Returns headers for CSP (to be used in backend)
 */
export function getCSPHeaders() {
    return {
        'Content-Security-Policy':
            "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:",
    };
}

export default {
    escapeHtml,
    sanitizeInput,
    sanitizeEmail,
    sanitizeName,
    sanitizePassword,
    sanitizeUrl,
    sanitizeHtml,
    sanitizeFormData,
    getCSPHeaders,
};
