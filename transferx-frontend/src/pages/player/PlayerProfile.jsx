import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorBanner from '../../components/ErrorBanner';
import { fakeFetch } from '../../utils/fakeFetch';
import { mockPlayers } from '../../mock/players';
import './PlayerProfile.css';

const getRandomBangladeshiCity = () => {
    const cities = ['Dhaka', 'Chittagong', 'Sylhet', 'Khulna', 'Rajshahi', 'Barisal', 'Rangpur', 'Mymensingh'];
    return cities[Math.floor(Math.random() * cities.length)];
};

const getRandomBangladeshiClub = () => {
    const clubs = ['Bashundhara Kings', 'Dhaka Abahani', 'Mohammedan SC', 'Sheikh Russel KC', 'Chittagong Abahani', 'Sylhet FC', 'Khulna City FC'];
    return clubs[Math.floor(Math.random() * clubs.length)];
};

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
                    name: `${mockPlayer.first_name} ${mockPlayer.last_name}`,
                    club: mockPlayer.current_club_name,
                    age: new Date().getFullYear() - new Date(mockPlayer.date_of_birth).getFullYear(),
                    jersey: Math.floor(Math.random() * 99) + 1,
                    birthday: mockPlayer.date_of_birth,
                    birthplace: getRandomBangladeshiCity(),
                    height: `${(1.70 + Math.random() * 0.25).toFixed(2)}m`,
                    weight: `${(65 + Math.random() * 20).toFixed(0)}kg`,
                    strongFoot: ['Left', 'Right'][Math.floor(Math.random() * 2)],
                    internationalCaps: Math.floor(Math.random() * 60) + 5,
                    internationalGoals: mockPlayer.position === 'Forward' ? Math.floor(Math.random() * 35) + 2 : Math.floor(Math.random() * 12),
                    seasonStats: {
                        year: 2024,
                        appearances: Math.floor(Math.random() * 25) + 8,
                        goals: mockPlayer.position === 'Forward' ? Math.floor(Math.random() * 15) + 3 : Math.floor(Math.random() * 5),
                        assists: Math.floor(Math.random() * 10) + 1,
                        yellowCards: Math.floor(Math.random() * 8),
                        redCards: Math.floor(Math.random() * 2),
                        minutes: Math.floor(Math.random() * 1500) + 500,
                    },
                    careerStats: {
                        appearances: Math.floor(Math.random() * 200) + 50,
                        goals: mockPlayer.position === 'Forward' ? Math.floor(Math.random() * 100) + 15 : Math.floor(Math.random() * 30),
                        assists: Math.floor(Math.random() * 50) + 5,
                        yellowCards: Math.floor(Math.random() * 50) + 10,
                        redCards: Math.floor(Math.random() * 5),
                    },
                    recentTransfers: [
                        { from: mockPlayer.current_club_name, to: 'Current Club', year: 2024, fee: '€' + (Math.floor(Math.random() * 500) + 50) + 'K' },
                        { from: getRandomBangladeshiClub(), to: mockPlayer.current_club_name, year: 2023, fee: '€' + (Math.floor(Math.random() * 300) + 30) + 'K' },
                        { from: getRandomBangladeshiClub(), to: getRandomBangladeshiClub(), year: 2022, fee: '€' + (Math.floor(Math.random() * 200) + 20) + 'K' },
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
                        <ErrorBanner message={error} onDismiss={() => setError('')} autoDismiss={true} dismissTimeout={5000} />
                    </div>
                ) : player ? (
                    <>
                        <div className="profile-header">
                            <div className="profile-cover" style={{ background: 'linear-gradient(135deg, var(--green-primary), var(--green-dark))' }}></div>
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
                                    <p className="profile-national">
                                        <span className="flag">🇧🇩</span> Bangladesh National Team
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
                                        <div className="stat-value">€{(player.market_value / 1000).toFixed(0)}K</div>
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
                                                <span className="info-value">🇧🇩 Bangladesh</span>
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

                                    <div className="profile-section">
                                        <h2 className="section-title">Bangladesh Premier League</h2>
                                        <div className="bpl-info">
                                            <div className="bpl-card">
                                                <div className="bpl-icon">🏆</div>
                                                <div className="bpl-stat">
                                                    <div className="bpl-label">Current Club</div>
                                                    <div className="bpl-value">{player.club}</div>
                                                </div>
                                            </div>
                                            <div className="bpl-card">
                                                <div className="bpl-icon">🎯</div>
                                                <div className="bpl-stat">
                                                    <div className="bpl-label">BPL Goals</div>
                                                    <div className="bpl-value">{player.seasonStats.goals + Math.floor(Math.random() * 5)}</div>
                                                </div>
                                            </div>
                                            <div className="bpl-card">
                                                <div className="bpl-icon">🎮</div>
                                                <div className="bpl-stat">
                                                    <div className="bpl-label">BPL Matches</div>
                                                    <div className="bpl-value">{player.seasonStats.appearances + Math.floor(Math.random() * 8)}</div>
                                                </div>
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
