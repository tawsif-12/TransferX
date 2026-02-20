import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorBanner from '../../components/ErrorBanner';
import { fakeFetch } from '../../utils/fakeFetch';
import { mockPlayers } from '../../mock/players';
import './PlayerProfile.css';

export default function PlayerProfile() {
    const { id } = useParams();
    const [player, setPlayer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        (async () => {
            try {
                // Mock data - get a player by ID
                const mockPlayer = mockPlayers[parseInt(id) % mockPlayers.length] || mockPlayers[0];
                const playerData = {
                    ...mockPlayer,
                    birthday: '1995-03-20',
                    birthplace: 'Manchester, England',
                    height: '1.85m',
                    weight: '78kg',
                    strongFoot: 'Left',
                    internationalCaps: 52,
                    internationalGoals: 18,
                    seasonStats: {
                        year: 2024,
                        appearances: 28,
                        goals: 12,
                        assists: 5,
                        yellowCards: 4,
                        redCards: 0,
                        minutes: 2340,
                    },
                    careerStats: {
                        appearances: 287,
                        goals: 98,
                        assists: 34,
                        yellowCards: 42,
                        redCards: 2,
                    },
                    recentTransfers: [
                        { from: 'Manchester United', to: 'Club', year: 2023, fee: '€85M' },
                        { from: 'Liverpool', to: 'Manchester United', year: 2020, fee: '€52M' },
                    ]
                };
                const data = await fakeFetch(playerData);
                setPlayer(data);
            } catch (err) {
                setError(err.message || 'Failed to load player profile.');
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);

    if (loading) return <LoadingSpinner fullPage />;

    return (
        <div>
            <Navbar />
            <div className="player-profile">
                {error ? (
                    <div style={{ padding: '40px' }}>
                        <ErrorBanner message={error} />
                    </div>
                ) : player ? (
                    <>
                        <div className="profile-header">
                            <div className="profile-cover" style={{ background: 'linear-gradient(135deg, var(--blue), var(--green-primary))' }}></div>
                            <div className="profile-top">
                                <div className="profile-avatar">
                                    <div className="avatar-large">⚽</div>
                                </div>
                                <div className="profile-info">
                                    <h1 className="profile-name">{player.name}</h1>
                                    <p className="profile-position">{player.position}</p>
                                    <p className="profile-club">
                                        {player.club && <>Playing for <strong>{player.club}</strong></>}
                                    </p>
                                </div>
                                <div className="profile-stats-quick">
                                    <div className="stat-item">
                                        <div className="stat-value">#{player.jersey}</div>
                                        <div className="stat-label">Jersey</div>
                                    </div>
                                    <div className="stat-item">
                                        <div className="stat-value">{player.age}</div>
                                        <div className="stat-label">Age</div>
                                    </div>
                                    <div className="stat-item">
                                        <div className="stat-value">{player.internationalCaps}</div>
                                        <div className="stat-label">Int'l Caps</div>
                                    </div>
                                    <div className="stat-item">
                                        <div className="stat-value">{player.market_value}</div>
                                        <div className="stat-label">Market Value</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="profile-content">
                            <div className="profile-grid">
                                <div className="profile-main">
                                    <div className="profile-section">
                                        <h2 className="section-title">Personal Information</h2>
                                        <div className="info-grid">
                                            <div className="info-item">
                                                <span className="info-label">Date of Birth</span>
                                                <span className="info-value">{player.birthday}</span>
                                            </div>
                                            <div className="info-item">
                                                <span className="info-label">Place of Birth</span>
                                                <span className="info-value">{player.birthplace}</span>
                                            </div>
                                            <div className="info-item">
                                                <span className="info-label">Nationality</span>
                                                <span className="info-value">{player.national_team}</span>
                                            </div>
                                            <div className="info-item">
                                                <span className="info-label">Height</span>
                                                <span className="info-value">{player.height}</span>
                                            </div>
                                            <div className="info-item">
                                                <span className="info-label">Weight</span>
                                                <span className="info-value">{player.weight}</span>
                                            </div>
                                            <div className="info-item">
                                                <span className="info-label">Preferred Foot</span>
                                                <span className="info-value">{player.strongFoot}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="profile-section">
                                        <h2 className="section-title">Season Statistics {player.seasonStats.year}</h2>
                                        <div className="stats-grid">
                                            <div className="stat-card">
                                                <div className="stat-icon">🎮</div>
                                                <div className="stat-number">{player.seasonStats.appearances}</div>
                                                <div className="stat-name">Appearances</div>
                                            </div>
                                            <div className="stat-card">
                                                <div className="stat-icon">⚽</div>
                                                <div className="stat-number">{player.seasonStats.goals}</div>
                                                <div className="stat-name">Goals</div>
                                            </div>
                                            <div className="stat-card">
                                                <div className="stat-icon">🎯</div>
                                                <div className="stat-number">{player.seasonStats.assists}</div>
                                                <div className="stat-name">Assists</div>
                                            </div>
                                            <div className="stat-card">
                                                <div className="stat-icon">⏱️</div>
                                                <div className="stat-number">{player.seasonStats.minutes}</div>
                                                <div className="stat-name">Minutes</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="profile-section">
                                        <h2 className="section-title">Career Statistics</h2>
                                        <div className="stats-grid">
                                            <div className="stat-card">
                                                <div className="stat-icon">🎮</div>
                                                <div className="stat-number">{player.careerStats.appearances}</div>
                                                <div className="stat-name">Career Appearances</div>
                                            </div>
                                            <div className="stat-card">
                                                <div className="stat-icon">⚽</div>
                                                <div className="stat-number">{player.careerStats.goals}</div>
                                                <div className="stat-name">Career Goals</div>
                                            </div>
                                            <div className="stat-card">
                                                <div className="stat-icon">🎯</div>
                                                <div className="stat-number">{player.careerStats.assists}</div>
                                                <div className="stat-name">Career Assists</div>
                                            </div>
                                            <div className="stat-card">
                                                <div className="stat-icon">⚠️</div>
                                                <div className="stat-number">{player.careerStats.yellowCards}</div>
                                                <div className="stat-name">Yellow Cards</div>
                                            </div>
                                            <div className="stat-card">
                                                <div className="stat-icon">🔴</div>
                                                <div className="stat-number">{player.careerStats.redCards}</div>
                                                <div className="stat-name">Red Cards</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="profile-sidebar">
                                    <div className="profile-section">
                                        <h2 className="section-title">Transfer History</h2>
                                        <div className="transfer-list">
                                            {player.recentTransfers?.map((transfer, idx) => (
                                                <div key={idx} className="transfer-item">
                                                    <div className="transfer-from">
                                                        <div className="transfer-label">From</div>
                                                        <div className="transfer-value">{transfer.from}</div>
                                                    </div>
                                                    <div className="transfer-arrow">→</div>
                                                    <div className="transfer-to">
                                                        <div className="transfer-label">To</div>
                                                        <div className="transfer-value">{transfer.to}</div>
                                                    </div>
                                                    <div className="transfer-details">
                                                        <div className="transfer-year">{transfer.year}</div>
                                                        <div className="transfer-fee">{transfer.fee}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div style={{ padding: '60px 24px', textAlign: 'center' }}>
                        <h2>Player not found</h2>
                    </div>
                )}
            </div>
        </div>
    );
}
