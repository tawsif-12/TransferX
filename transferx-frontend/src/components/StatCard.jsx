import './StatCard.css';

export default function StatCard({ label, value, icon, trend }) {
  return (
    <div className="stat-card">
      <div className="stat-card__header">
        <span className="stat-card__label">{label}</span>
        {icon && <div className="stat-card__icon">{icon}</div>}
      </div>
      <div className="stat-card__value">{value}</div>
      {trend && <div className="stat-card__trend">{trend}</div>}
    </div>
  );
}
