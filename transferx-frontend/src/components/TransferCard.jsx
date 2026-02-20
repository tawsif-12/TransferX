import { useNavigate } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import { formatCurrency, formatDate } from '../utils/formatters';
import './TransferCard.css';

export default function TransferCard({ transfer }) {
  const navigate = useNavigate();

  return (
    <div 
      className="transfer-card" 
      onClick={() => navigate(`/transfers/${transfer.transfer_id}`)}
    >
      <div className="transfer-card__player">{transfer.player_name}</div>
      <div className="transfer-card__route">
        <span className="transfer-card__club">{transfer.from_club}</span>
        <span className="transfer-card__arrow">→</span>
        <span className="transfer-card__club">{transfer.to_club}</span>
      </div>
      <div className="transfer-card__fee">
        {transfer.fee === 0 ? 'Free' : formatCurrency(transfer.fee)}
      </div>
      <div className="transfer-card__date">{formatDate(transfer.transfer_date)}</div>
      <StatusBadge status={transfer.transfer_type} />
    </div>
  );
}
