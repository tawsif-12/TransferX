import { containsHtml } from './sanitize';

export const validateEmail = (v) => {
  if (!v) return 'Email is required';
  if (containsHtml(v)) return 'Email cannot contain HTML or script tags';
  if (!/\S+@\S+\.\S+/.test(v)) return 'Enter a valid email';
  return null;
};

export const validateRequired = (v, label) =>
  !v?.toString().trim() ? `${label} is required` : null;

export const validateMinLength = (v, min, label) =>
  v?.length < min ? `${label} must be at least ${min} characters` : null;

export const validatePasswordMatch = (pw, confirm) =>
  pw !== confirm ? 'Passwords do not match' : null;

export const validateLoginForm = ({ email, password }) => {
  const e = {};
  const emailErr = validateEmail(email);
  if (emailErr) e.email = emailErr;
  const pwErr = validateRequired(password, 'Password');
  if (pwErr) e.password = pwErr;
  return e;
};

export const validateSignupForm = ({ fullName, email, password, confirm }) => {
  const e = {};
  const nameErr =
    validateRequired(fullName, 'Full name') ||
    validateMinLength(fullName?.trim(), 2, 'Full name');
  if (nameErr) e.fullName = nameErr;

  // reject HTML/script tags in the name
  if (!e.fullName && containsHtml(fullName)) {
    e.fullName = 'Full name cannot contain HTML or script tags';
  }

  const emailErr = validateEmail(email);
  if (emailErr) e.email = emailErr;
  const pwErr = validateRequired(password, 'Password') || validateMinLength(password, 6, 'Password');
  if (pwErr) e.password = pwErr;
  const matchErr = validatePasswordMatch(password, confirm);
  if (matchErr || !confirm) e.confirm = matchErr || 'Please confirm your password';
  return e;
};
