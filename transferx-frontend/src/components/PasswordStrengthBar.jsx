import './PasswordStrengthBar.css';

export default function PasswordStrengthBar({ password }) {
  const calculateStrength = (pw) => {
    let score = 0;
    if (pw.length >= 6) score++;
    if (pw.length >= 10) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return Math.min(score, 4);
  };

  const strength = calculateStrength(password);

  const config = {
    0: { label: '', color: 'var(--green-muted)' },
    1: { label: 'Weak', color: 'var(--red)' },
    2: { label: 'Fair', color: 'var(--yellow)' },
    3: { label: 'Good', color: '#fb923c' },
    4: { label: 'Strong', color: 'var(--green-primary)' },
  };

  if (!password) return null;

  return (
    <div className="password-strength">
      <div className="password-strength__bars">
        {[1, 2, 3, 4].map((segment) => (
          <div
            key={segment}
            className="password-strength__bar"
            style={{
              background: segment <= strength ? config[strength].color : 'var(--green-muted)',
            }}
          />
        ))}
      </div>
      {strength > 0 && (
        <span className="password-strength__label" style={{ color: config[strength].color }}>
          {config[strength].label}
        </span>
      )}
    </div>
  );
}
