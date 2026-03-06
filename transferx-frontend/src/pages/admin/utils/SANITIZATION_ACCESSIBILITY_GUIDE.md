# Form Security & Accessibility Implementation Guide

## Overview
This document outlines the security and accessibility improvements implemented in the TransferX frontend forms.

---

## 1. Input Sanitization & XSS Protection

### Location
`src/utils/sanitize.js` - Comprehensive sanitization utilities module

### Features Implemented

#### a) **HTML Escaping**
```javascript
escapeHtml(text) // Converts <, >, &, ", ' to HTML entities
```
- Prevents HTML injection attacks
- Usage: Display user data as plain text

#### b) **DOMPurify Integration**
We added [DOMPurify](https://github.com/cure53/DOMPurify) as a dependency and use it inside
`sanitize.js` for robust, battle‑tested sanitization.  This was particularly useful for
stripping out entire tags (`<script>`, `<iframe>`, etc.) and encoded entities before they ever
reach the backend.

Example:
```js
// strip everything except plain text
DOMPurify.sanitize(input, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
```

The helper `containsHtml()` was added to aid validation logic by detecting any remaining
angle brackets or common entity sequences.  Front‑end validators now reject names/emails
containing HTML or script tags, showing a validation error immediately.

#### b) **General Input Sanitization**
```javascript
sanitizeInput(input) // Removes dangerous characters and scripts
```
- Removes null bytes and control characters
- Strips `<script>` tags and event handlers
- Removes `<iframe>` tags
- Safe for regular text inputs

#### c) **Email Sanitization**
```javascript
sanitizeEmail(email) // Email validation + sanitization
```
- Validates against email regex
- Prevents injection attacks
- Returns empty string if invalid
- Usage: email, admin email login fields

#### d) **Name Sanitization**
```javascript
sanitizeName(name) // Allows names with accents, hyphens, apostrophes
```
- Allows: Letters, spaces, hyphens, apostrophes
- Supports international characters (accents)
- Usage: Full name, username fields

#### e) **Password Sanitization**
```javascript
sanitizePassword(password) // Only removes control characters
```
- Doesn't modify password
- Only removes dangerous control characters
- Preserves special chars for security complexity

#### f) **URL Sanitization**
```javascript
sanitizeUrl(url) // Prevents javascript: and data: URLs
```
- Blocks javascript:, data:, vbscript: URLs
- Usage: Profile links, redirect URLs

#### g) **Form Data Batch Sanitization**
```javascript
sanitizeFormData(data, schema) // Smart sanitization by field type
```
- Usage: Entire form submission
- Example:
```javascript
const sanitized = sanitizeFormData({
  fullName: 'John<script>alert("xss")</script>',
  email: 'test@example.com'
}, {
  fullName: 'name',
  email: 'email'
});
// Returns: { fullName: 'Johnalert("xss")', email: 'test@example.com' }
```

### Implementation in Forms

#### **AuthPage.jsx** (Login & Signup)
```javascript
// Login
const sanitizedEmail = sanitizeEmail(loginEmail);
const res = await axiosClient.post('/auth/login', {
  email: sanitizedEmail,
  password: loginPassword // Keep original password
});

// Signup
const sanitizedName = sanitizeName(signupName);
const sanitizedEmail = sanitizeEmail(signupEmail);
const res = await axiosClient.post('/auth/signup', {
  fullName: sanitizedName,
  email: sanitizedEmail,
  password: signupPassword
});
```

#### **AdminLogin.jsx**
```javascript
const sanitizedEmail = sanitizeEmail(email);
const res = await axiosClient.post('/auth/admin-login', { 
  email: sanitizedEmail, 
  password 
});
```

---

## 1.5 Table Enhancements

### Pagination Support
The reusable `DataTable` component now includes built–in pagination controls as well as
`pageSize`, `initialPage` and `onPageChange` props.  Search results are paginated, and the
component resets to the first page whenever the data or filter changes.  Basic styling
was added in `DataTable.css` to match the design system.

## 2. ARIA Attributes & Accessibility

### Comprehensive ARIA Implementation

#### **FormInput Component**
Props added:
- `ariaLabel` - Explicit label for inputs (alt to `label`)
- `helpText` - Additional field guidance
- More detailed aria attributes

Attributes:
- `aria-label` - Describes input purpose to screen readers
- `aria-invalid="true|false"` - Indicates validation state
- `aria-required="true|false"` - Marks required fields
- `aria-describedby` - Links errors + help text to input

Example:
```jsx
<FormInput
  name="email"
  label="Email"
  required
  error={errors.email}
  helpText="We'll never share your email"
  ariaLabel="Email address for account login"
/>
```

#### **PasswordInput Component**
- `aria-label` on toggle button: "Show/Hide password"
- `aria-pressed={showPassword}` - Button state indicator
- `aria-controls={name}` - Links toggle to password field
- `aria-describedby` - Links errors to input

#### **ErrorBanner Component**
- `role="alert"` - Announces errors immediately
- `aria-live="assertive"` - Marks as urgent
- `aria-atomic="true"` - Announces full message
- Escape key dismissal support

### ID Linking Structure
Every form field has linked error messages:
```
<input id="email" aria-describedby="email-error email-description" />
<p id="email-error" role="alert">Invalid email format</p>
<p id="email-description" class="form-description">Your work email</p>
```

---

## 3. Visual Focus Indicators

### Form Input Focus Styles
```css
.form-input:focus {
  outline: 2px solid var(--green-primary);
  outline-offset: 2px;
  border-color: var(--green-primary);
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
}

/*For error states*/
.form-input[aria-invalid="true"]:focus {
  outline: 2px solid var(--red);
  outline-offset: 2px;
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
}
```

### Password Toggle Button Focus
```css
.password-toggle:focus {
  outline: 2px solid var(--green-primary);
  outline-offset: 2px;
  color: var(--green-primary);
}
```

### Error Banner Dismiss Button
```css
.error-banner__dismiss:focus {
  outline: 2px solid #dc2626;
  outline-offset: 2px;
}
```

### Disabled Input Styling
```css
.form-input:disabled {
  background-color: #f0f0f0;
  cursor: not-allowed;
  opacity: 0.6;
}
```

---

## 4. Best Practices Implemented

### ✅ Security Best Practices
1. **Input Validation** - Frontend validation before API calls
2. **Input Sanitization** - Remove dangerous characters
3. **Type-specific Sanitization** - Different rules for emails vs names
4. **XSS Prevention** - HTML escaping and tag removal
5. **URL Validation** - Prevent javascript: attacks
6. **Password Safety** - Not modified by sanitizers

### ✅ Accessibility Best Practices
1. **Proper Labeling** - Every input has id + label
2. **Error Association** - Errors linked via aria-describedby
3. **Keyboard Navigation** - All buttons focusable with outline
4. **Screen Reader Support** - Proper roles and live regions
5. **Visual Clarity** - 2px outline on focus with offset
6. **Help Text** - Guidance visible to all users
7. **Required Indicators** - Visual * and aria-required

### ✅ UX Best Practices
1. **Clear Focus Indicators** - Users know what's focused
2. **Error Messages** - Inline and announced to screen readers
3. **Help Text** - Green italic text for suggestions
4. **Disabled State** - Obvious visual feedback
5. **Password Visibility** - Toggle button for ease of use

---

## 5. Testing Checklist

### Manual Testing
- [ ] Tab through form - outline visible on all inputs
- [ ] Type invalid data - error appears
- [ ] Press Escape in error - banner dismisses
- [ ] Read form with screen reader - all labels announced
- [ ] Toggle password visibility - works smoothly
- [ ] Try XSS payloads - sanitized before sending

### Automated Testing Example
```javascript
// Test sanitization
import { sanitizeEmail, sanitizeName } from '@/utils/sanitize';

test('sanitizes email', () => {
  expect(sanitizeEmail('test@example.com')).toBe('test@example.com');
  expect(sanitizeEmail('invalid')).toBe('');
});

test('sanitizes names', () => {
  expect(sanitizeName('John<script>alert</script>Doe')).toBe('JohnDoe');
});
```

---

## 6. Keyboard Navigation Map

| Key | Action |
|-----|--------|
| Tab | Move focus to next input |
| Shift+Tab | Move focus to previous input |
| Escape | Dismiss error banner |
| Space/Enter | Toggle password visibility |
| Enter | Submit form |

---

## 7. Browser Support

All features work in:
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

---

## 8. Future Enhancements

- [ ] Rate limiting on form submission
- [ ] CSRF token support
- [ ] Progressive validation (real-time)
- [ ] Multi-language sanitization
- [ ] Recaptcha integration
- [ ] Form submission analytics

---

## Resources

- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [OWASP XSS Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
- [MDN Web Docs - ARIA](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA)
