import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '../utils/formatters';
import './ClubCard.css';

export default function ClubCard({ club }) {
  const navigate = useNavigate();

  return (
    <div 
      className="club-card" 
      onClick={() => navigate(`/clubs/${club.club_id}`)}
    >
      <div className="club-card__icon">🛡</div>
      <h3 className="club-card__name">{club.name}</h3>
      <p className="club-card__league">{club.league_name}</p>
      <p className="club-card__country">{club.country}</p>
      <p className="club-card__founded">Est. {club.founded_year}</p>
      <div className="club-card__budget">
        Budget: {formatCurrency(club.budget)}
      </div>
    </div>
  );
}
