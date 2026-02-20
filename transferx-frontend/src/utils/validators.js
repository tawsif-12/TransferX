export const validateEmail = (v) =>
  !v ? 'Email is required' : !/\S+@\S+\.\S+/.test(v) ? 'Enter a valid email' : null;

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
  const nameErr = validateRequired(fullName, 'Full name') || validateMinLength(fullName?.trim(), 2, 'Full name');
  if (nameErr) e.fullName = nameErr;
  const emailErr = validateEmail(email);
  if (emailErr) e.email = emailErr;
  const pwErr = validateRequired(password, 'Password') || validateMinLength(password, 6, 'Password');
  if (pwErr) e.password = pwErr;
  const matchErr = validatePasswordMatch(password, confirm);
  if (matchErr || !confirm) e.confirm = matchErr || 'Please confirm your password';
  return e;
};
