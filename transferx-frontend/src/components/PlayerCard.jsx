import { useNavigate } from 'react-router-dom';
import StatusBadge from './StatusBadge';
import { formatCurrency, getInitials } from '../utils/formatters';
import './PlayerCard.css';

export default function PlayerCard({ player }) {
  const navigate = useNavigate();

  return (
    <div 
      className="player-card" 
      onClick={() => navigate(`/players/${player.player_id}`)}
    >
      <StatusBadge status={player.position} />
      <div className="player-card__avatar">
        {getInitials(player.first_name, player.last_name)}
      </div>
      <h3 className="player-card__name">
        {player.first_name} {player.last_name}
      </h3>
      <p className="player-card__nationality">
        🏴 {player.nationality}
      </p>
      <p className="player-card__club">{player.current_club_name}</p>
      <div className="player-card__value">
        {formatCurrency(player.market_value)}
      </div>
    </div>
  );
}
