import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useToast } from '../../context/ToastContext';
import axiosClient from '../../api/axiosClient';
import './PlayerProfile.css';

export default function PlayerProfile() {
    const { id } = useParams();
    const [player, setPlayer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const toast = useToast();

    useEffect(() => {
        loadPlayer();
    }, [id]);

    const loadPlayer = async () => {
        try {
            setLoading(true);
            setError('');

            const response = await axiosClient.get(`/players/${id}`);
            const apiPlayer = response.data.data || response.data;
            
            // Calculate age from date of birth
            const calculateAge = (dob) => {
                if (!dob) return 'N/A';
                const birthDate = new Date(dob);
                const today = new Date();
                let age = today.getFullYear() - birthDate.getFullYear();
                const monthDiff = today.getMonth() - birthDate.getMonth();
                if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                    age--;
                }
                return age;
            };

            // Format market value
            const formatMarketValue = (fee) => {
                if (!fee) return '€0';
                const value = fee * 1000000;
                if (value >= 1000000) {
                    return `€${(value / 1000000).toFixed(2)}M`;
                }
                return `€${(value / 1000).toFixed(0)}K`;
            };

            // Transform API data to component format
            const playerData = {
                player_id: apiPlayer.player_id,
                name: `${apiPlayer.first_name} ${apiPlayer.last_name}`,
                first_name: apiPlayer.first_name,
                last_name: apiPlayer.last_name,
                position: apiPlayer.position,
                club: apiPlayer.current_club?.name || 'Free Agent',
                league: apiPlayer.current_club?.league?.name || '',
                age: calculateAge(apiPlayer.date_of_birth),
                jersey: Math.floor(Math.random() * 99) + 1, // Random jersey for now
                birthday: apiPlayer.date_of_birth ? new Date(apiPlayer.date_of_birth).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A',
                birthplace: 'Bangladesh',
                height: 'N/A', // Not available in Player table
                weight: 'N/A', // Not available in Player table
                strongFoot: 'Right', // Default
                nationality: apiPlayer.nationality || 'Bangladesh',
                internationalCaps: 0, // Not available in Player table
                internationalGoals: 0, // Not available in Player table
                market_value: apiPlayer.fee ? apiPlayer.fee * 1000000 : 0,
                market_value_formatted: formatMarketValue(apiPlayer.fee),
                rating: 0,
                bio: `${apiPlayer.first_name} ${apiPlayer.last_name} is a professional footballer playing as ${apiPlayer.position} for ${apiPlayer.current_club?.name || 'their club'}.`,
                seasonStats: {
                    year: 2026,
                    appearances: 0,
                    goals: 0,
                    assists: 0,
                    yellowCards: 0,
                    redCards: 0,
                    minutes: 0,
                },
                careerStats: {
                    appearances: 0,
                    goals: 0,
                    assists: 0,
                    yellowCards: 0,
                    redCards: 0,
                },
                recentTransfers: (apiPlayer.transfer_history || []).slice(0, 5).map(th => ({
                    from: th.transfer?.from_club?.name || 'Unknown',
                    to: th.transfer?.to_club?.name || 'Unknown',
                    year: th.transfer?.transfer_date ? new Date(th.transfer.transfer_date).getFullYear() : 'N/A',
                    fee: th.transfer?.transfer_fee ? `€${th.transfer.transfer_fee}M` : 'Free',
                })),
                contracts: apiPlayer.contracts || [],
            };

            setPlayer(playerData);
        } catch (err) {
            console.error('Load player error:', err);
            const msg = err.response?.data?.error || err.message || 'Failed to load player profile.';
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <LoadingSpinner fullPage />;

    return (
        <div>
            <Navbar />
            <div className="player-profile">
                {error ? (
                    <div style={{ padding: '40px', textAlign: 'center' }}>
                        <p>{error}</p>
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
                                        <span className="flag">🇧🇩</span> {player.nationality} National Team
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
                                        <div className="stat-value">{player.market_value_formatted}</div>
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
                                                <span className="info-value">🇧🇩 {player.nationality}</span>
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
                                            {player.recentTransfers && player.recentTransfers.length > 0 ? (
                                                player.recentTransfers.map((transfer, idx) => (
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
                                                ))
                                            ) : (
                                                <p className="no-data">No transfer history available</p>
                                            )}
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
