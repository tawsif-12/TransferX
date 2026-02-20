import './StatusBadge.css';

export default function StatusBadge({ status }) {
  const transferTypeColors = {
    'Permanent': 'var(--green-primary)',
    'Loan': 'var(--yellow)',
    'Free Transfer': 'var(--blue)',
    'Youth': 'var(--purple)',
  };

  const positionColors = {
    'Goalkeeper': '#f59e0b',
    'Defender': 'var(--blue)',
    'Midfielder': 'var(--purple)',
    'Forward': 'var(--red)',
  };

  const color = transferTypeColors[status] || positionColors[status] || 'var(--text-secondary)';

  return (
    <span 
      className="status-badge"
      style={{
        background: `${color}26`, // 15% opacity
        color: color,
      }}
    >
      {status}
    </span>
  );
}
