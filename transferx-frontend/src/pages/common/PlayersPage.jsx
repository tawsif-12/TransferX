import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import DataTable from '../../components/DataTable';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorBanner from '../../components/ErrorBanner';
import { fakeFetch } from '../../utils/fakeFetch';
import { mockPlayers } from '../../mock/players';
import './PlayersPage.css';

export default function PlayersPage() {
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        (async () => {
            try {
                const playersData = mockPlayers.map(p => ({
                    ...p,
                    name: `${p.first_name} ${p.last_name}`,
                    age: new Date().getFullYear() - new Date(p.date_of_birth).getFullYear(),
                    club: p.current_club_name,
                }));
                const data = await fakeFetch(playersData);
                setPlayers(data);
            } catch (err) {
                setError(err.message || 'Failed to load players.');
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    if (loading) return <LoadingSpinner fullPage />;

    return (
        <div>
            <Navbar />
            <div className="players-page">
                <div className="page-header">
                    <h1 className="page-title">Players</h1>
                    <p className="page-subtitle">Browse all players in Bangladesh football</p>
                </div>

                {error ? (
                    <div style={{ padding: '40px' }}>
                        <ErrorBanner message={error} onDismiss={() => setError('')} autoDismiss={true} dismissTimeout={5000} />
                    </div>
                ) : (
                    <div className="page-content">
                        <div className="players-grid">
                            {players.map((player) => (
                                <div key={player.player_id} className="player-card">
                                    <div className="player-card-header">
                                        <div className="player-avatar">⚽</div>
                                        <div className="player-info">
                                            <h3 className="player-name">{player.name}</h3>
                                            <p className="player-position">{player.position}</p>
                                        </div>
                                    </div>
                                    <div className="player-details">
                                        <div className="detail-row">
                                            <span className="detail-label">Age</span>
                                            <span className="detail-value">{player.age}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="detail-label">Club</span>
                                            <span className="detail-value">{player.club}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="detail-label">Nationality</span>
                                            <span className="detail-value">🇧🇩 Bangladesh</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="detail-label">Market Value</span>
                                            <span className="detail-value highlight">€{(player.market_value / 1000).toFixed(0)}K</span>
                                        </div>
                                    </div>
                                    <a href={`/players/${player.player_id}`} className="player-card-link">View Profile</a>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
