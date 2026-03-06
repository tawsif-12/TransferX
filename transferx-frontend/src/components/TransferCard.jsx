import { useNavigate } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import { formatCurrency, formatDate } from '../utils/formatters';
import './TransferCard.css';

export default function TransferCard({ transfer }) {
  const navigate = useNavigate();

  // Handle different API response formats
  const playerName = transfer.player_name || 
    (transfer.player ? `${transfer.player.first_name} ${transfer.player.last_name}` : 'Unknown');
  const fromClub = transfer.from_club?.name || transfer.from_club || 'Unknown';
  const toClub = transfer.to_club?.name || transfer.to_club || 'Unknown';
  const fee = transfer.fee !== undefined ? transfer.fee : transfer.transfer_fee;

  return (
    <div 
      className="transfer-card" 
      onClick={() => navigate(`/transfers/${transfer.transfer_id}`)}
    >
      <div className="transfer-card__player">{playerName}</div>
      <div className="transfer-card__route">
        <span className="transfer-card__club">{fromClub}</span>
        <span className="transfer-card__arrow">→</span>
        <span className="transfer-card__club">{toClub}</span>
      </div>
      <div className="transfer-card__fee">
        {fee === 0 || fee === null ? 'Free' : formatCurrency(fee)}
      </div>
      <div className="transfer-card__date">{formatDate(transfer.transfer_date)}</div>
      <StatusBadge status={transfer.transfer_type} />
    </div>
  );
}
