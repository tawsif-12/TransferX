import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorBanner from '../../components/ErrorBanner';
import { fakeFetch } from '../../utils/fakeFetch';
import { mockPlayers } from '../../mock/players';
import './UserProfile.css';

export default function UserProfile() {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        (async () => {
            try {
                // Mock data - get a player to display as user profile
                const mockUser = mockPlayers[parseInt(userId) % mockPlayers.length] || mockPlayers[0];
                const userData = {
                    id: userId,
                    name: mockUser.name,
                    position: mockUser.position,
                    age: mockUser.age,
                    nationalTeam: mockUser.national_team,
                    currentClub: mockUser.club,
                    marketValue: mockUser.market_value,
                    jersey: mockUser.jersey,
                    birthday: '1998-06-15',
                    birthplace: 'São Paulo, Brazil',
                    height: '1.88m',
                    weight: '82kg',
                    strongFoot: 'Right',
                    internationalCaps: 45,
                    internationalGoals: 12,
                    stats: {
                        appearances: 234,
                        goals: 67,
                        assists: 23,
                        yellowCards: 18,
                        redCards: 2,
                    }
                };
                const data = await fakeFetch(userData);
                setUser(data);
            } catch (err) {
                setError(err.message || 'Failed to load user profile.');
            } finally {
                setLoading(false);
            }
        })();
    }, [userId]);

    if (loading) return <LoadingSpinner fullPage />;

    return (
        <div>
            <Navbar />
            <div className="user-profile">
                {error ? (
                    <div style={{ padding: '40px' }}>
                        <ErrorBanner message={error} onDismiss={() => setError('')} autoDismiss={true} dismissTimeout={5000} />
                    </div>
                ) : user ? (
                    <>
                        <div className="profile-header">
                            <div className="profile-cover" style={{ background: 'linear-gradient(135deg, var(--green-primary), var(--green-dark))' }}></div>
                            <div className="profile-top">
                                <div className="profile-avatar">
                                    <div className="avatar-large">👤</div>
                                </div>
                                <div className="profile-info">
                                    <h1 className="profile-name">{user.name}</h1>
                                    <p className="profile-position">{user.position}</p>
                                    <p className="profile-club">Currently at <strong>{user.currentClub}</strong></p>
                                </div>
                                <div className="profile-stats-quick">
                                    <div className="stat-item">
                                        <div className="stat-value">{user.age}</div>
                                        <div className="stat-label">Age</div>
                                    </div>
                                    <div className="stat-item">
                                        <div className="stat-value">{user.internationalCaps}</div>
                                        <div className="stat-label">Caps</div>
                                    </div>
                                    <div className="stat-item">
                                        <div className="stat-value">{user.internationalGoals}</div>
                                        <div className="stat-label">Goals</div>
                                    </div>
                                    <div className="stat-item">
                                        <div className="stat-value">{user.marketValue}</div>
                                        <div className="stat-label">Market Value</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="profile-content">
                            <div className="profile-section">
                                <h2 className="section-title">Personal Information</h2>
                                <div className="info-grid">
                                    <div className="info-item">
                                        <span className="info-label">Date of Birth</span>
                                        <span className="info-value">{user.birthday}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Place of Birth</span>
                                        <span className="info-value">{user.birthplace}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Nationality</span>
                                        <span className="info-value">{user.nationalTeam}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Height</span>
                                        <span className="info-value">{user.height}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Weight</span>
                                        <span className="info-value">{user.weight}</span>
                                    </div>
                                    <div className="info-item">
                                        <span className="info-label">Strong Foot</span>
                                        <span className="info-value">{user.strongFoot}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="profile-section">
                                <h2 className="section-title">Career Statistics</h2>
                                <div className="stats-grid">
                                    <div className="stat-card">
                                        <div className="stat-icon">🎮</div>
                                        <div className="stat-number">{user.stats.appearances}</div>
                                        <div className="stat-name">Appearances</div>
                                    </div>
                                    <div className="stat-card">
                                        <div className="stat-icon">⚽</div>
                                        <div className="stat-number">{user.stats.goals}</div>
                                        <div className="stat-name">Goals</div>
                                    </div>
                                    <div className="stat-card">
                                        <div className="stat-icon">🎯</div>
                                        <div className="stat-number">{user.stats.assists}</div>
                                        <div className="stat-name">Assists</div>
                                    </div>
                                    <div className="stat-card">
                                        <div className="stat-icon">⚠️</div>
                                        <div className="stat-number">{user.stats.yellowCards}</div>
                                        <div className="stat-name">Yellow Cards</div>
                                    </div>
                                    <div className="stat-card">
                                        <div className="stat-icon">🔴</div>
                                        <div className="stat-number">{user.stats.redCards}</div>
                                        <div className="stat-name">Red Cards</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div style={{ padding: '60px 24px', textAlign: 'center' }}>
                        <h2>User not found</h2>
                    </div>
                )}
            </div>
        </div>
    );
}
