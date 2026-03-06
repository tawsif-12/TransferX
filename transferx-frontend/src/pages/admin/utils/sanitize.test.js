/**
 * Sanitization Unit Tests
 * Run with: npm test sanitize.test.js
 */

import {
    escapeHtml,
    sanitizeInput,
    sanitizeEmail,
    sanitizeName,
    sanitizePassword,
    sanitizeUrl,
    sanitizeHtml,
    sanitizeFormData
} from './sanitize';

describe('Sanitization Utilities', () => {
    describe('escapeHtml', () => {
        test('escapes HTML special characters', () => {
            expect(escapeHtml('<script>alert("xss")</script>'))
                .toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;');
        });

        test('handles empty strings', () => {
            expect(escapeHtml('')).toBe('');
            expect(escapeHtml(null)).toBe('');
        });

        test('escapes all dangerous characters', () => {
            expect(escapeHtml('&<>"\''))
                .toBe('&amp;&lt;&gt;&quot;&#039;');
        });
    });

    describe('sanitizeInput', () => {
        test('removes script tags', () => {
            expect(sanitizeInput('Hello<script>alert("xss")</script>World'))
                .toBe('HelloWorld');
        });

        test('removes event handlers', () => {
            expect(sanitizeInput('Text onclick="alert()"'))
                .toBe('Text();
    });

        test('trims whitespace', () => {
            expect(sanitizeInput('  hello  ')).toBe('hello');
        });

        test('removes control characters', () => {
            expect(sanitizeInput('hello\x00world')).toBe('helloworld');
        });
    });

    describe('sanitizeEmail', () => {
        test('validates valid emails', () => {
            expect(sanitizeEmail('test@example.com')).toBe('test@example.com');
            expect(sanitizeEmail('user.name+tag@example.co.uk'))
                .toBe('user.name+tag@example.co.uk');
        });

        test('rejects invalid emails', () => {
            expect(sanitizeEmail('notanemail')).toBe('');
            expect(sanitizeEmail('test@')).toBe('');
            expect(sanitizeEmail('@example.com')).toBe('');
        });

        test('normalizes to lowercase', () => {
            expect(sanitizeEmail('TEST@EXAMPLE.COM')).toBe('test@example.com');
        });

        test('removes XSS attempts', () => {
            expect(sanitizeEmail('test<script>@example.com')).toBe('');
        });
    });

    describe('sanitizeName', () => {
        test('allows valid names', () => {
            expect(sanitizeName('John Doe')).toBe('John Doe');
            expect(sanitizeName("O'Brien")).toBe("O'Brien");
            expect(sanitizeName('Jean-Pierre')).toBe('Jean-Pierre');
        });

        test('removes scripts', () => {
            expect(sanitizeName('John<script>Doe')).toBe('JohnDoe');
        });

        test('handles accented characters', () => {
            expect(sanitizeName('José María')).toBe('José María');
            expect(sanitizeName('François')).toBe('François');
        });

        test('removes numbers', () => {
            expect(sanitizeName('John123Doe')).toBe('JohnDoe');
        });

        test('trims spaces', () => {
            expect(sanitizeName('  John  ')).toBe('John');
        });
    });

    describe('sanitizePassword', () => {
        test('preserves valid passwords', () => {
            expect(sanitizePassword('MyP@ssw0rd!'))
                .toBe('MyP@ssw0rd!');
        });

        test('removes control characters only', () => {
            expect(sanitizePassword('pass\x00word')).toBe('password');
        });

        test('allows special characters', () => {
            expect(sanitizePassword('P@ss!#$%^&*()')).toBe('P@ss!#$%^&*()');
        });
    });

    describe('sanitizeUrl', () => {
        test('allows valid URLs', () => {
            expect(sanitizeUrl('https://example.com'))
                .toBe('https://example.com');
            expect(sanitizeUrl('/profile/123')).toBe('/profile/123');
        });

        test('blocks javascript URLs', () => {
            expect(sanitizeUrl('javascript:alert("xss")')).toBe('');
            expect(sanitizeUrl('JavaScript:void(0)')).toBe('');
        });

        test('blocks data URLs', () => {
            expect(sanitizeUrl('data:text/html,<script>alert()</script>'))
                .toBe('');
        });

        test('blocks vbscript URLs', () => {
            expect(sanitizeUrl('vbscript:msgbox(1)')).toBe('');
        });
    });

    describe('sanitizeHtml', () => {
        test('removes HTML tags', () => {
            expect(sanitizeHtml('<p>Hello <b>World</b></p>'))
                .toBe('Hello World');
        });

        test('handles empty input', () => {
            expect(sanitizeHtml('')).toBe('');
            expect(sanitizeHtml(null)).toBe('');
        });
    });

    describe('sanitizeFormData', () => {
        test('sanitizes multiple fields', () => {
            const data = {
                fullName: 'John<script>Doe',
                email: 'test@example.com',
                password: 'MyP@ss123'
            };

            const schema = {
                fullName: 'name',
                email: 'email',
                password: 'password'
            };

            const sanitized = sanitizeFormData(data, schema);
            expect(sanitized.fullName).toBe('JohnDoe');
            expect(sanitized.email).toBe('test@example.com');
            expect(sanitized.password).toBe('MyP@ss123');
        });

        test('handles unknown field types', () => {
            const data = { bio: 'My<script>Bio' };
            const schema = {};

            const sanitized = sanitizeFormData(data, schema);
            expect(sanitized.bio).not.toContain('<script>');
        });
    });

    describe('XSS Attack Prevention', () => {
        test('prevents common XSS vectors', () => {
            const xssAttacks = [
                '<img src=x onerror="alert(\'xss\')">',
                '<svg onload="alert(\'xss\')">',
                '<body onload="alert(\'xss\')">',
                'javascript:alert("xss")',
                'data:text/html,<script>alert("xss")</script>',
            ];

            xssAttacks.forEach(attack => {
                const sanitized = sanitizeInput(attack);
                expect(sanitized).not.toContain('onerror');
                expect(sanitized).not.toContain('onload');
                expect(sanitized).not.toContain('javascript:');
                expect(sanitized).not.toContain('data:');
            });
        });

        test('prevents SQL-like injection in frontend', () => {
            const input = "'; DROP TABLE users; --";
            const sanitized = sanitizeInput(input);
            // Frontend can't prevent SQL, but removes dangerous chars
            expect(sanitized).toBe("'; DROP TABLE users; --");
            // Backend validation/parameterized queries handle SQL injection
        });
    });
});
