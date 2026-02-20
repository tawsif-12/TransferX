import { useNavigate } from 'react-router-dom';
import { getInitials } from '../utils/formatters';
import './AgentCard.css';

export default function AgentCard({ agent }) {
  const navigate = useNavigate();

  return (
    <div 
      className="agent-card" 
      onClick={() => navigate(`/agents/${agent.agent_id}`)}
    >
      <div className="agent-card__avatar">
        {getInitials(agent.first_name, agent.last_name)}
      </div>
      <h3 className="agent-card__name">
        {agent.first_name} {agent.last_name}
      </h3>
      <p className="agent-card__count">
        {agent.player_count} player{agent.player_count !== 1 ? 's' : ''} represented
      </p>
    </div>
  );
}
