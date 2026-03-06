import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorBanner from '../../components/ErrorBanner';
import axiosClient from '../../api/axiosClient';
import './UserProfile.css';

export default function UserProfile() {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadUserProfile();
    }, [userId]);

    const loadUserProfile = async () => {
        try {
            setLoading(true);
            setError('');

            // Get current user profile
            const response = await axiosClient.get('/user/me');
            const apiUser = response.data.data || response.data;

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

            // Build user profile based on role
            let userData = {
                id: apiUser.id,
                name: apiUser.fullName || apiUser.email,
                email: apiUser.email,
                role: apiUser.role,
            };

            if (apiUser.role === 'PLAYER' && apiUser.playerProfile) {
                const profile = apiUser.playerProfile;
                userData = {
                    ...userData,
                    position: profile.position || 'N/A',
                    age: calculateAge(profile.dateOfBirth),
                    nationalTeam: profile.nationality || 'N/A',
                    currentClub: profile.currentClub?.name || 'Free Agent',
                    marketValue: profile.marketValue ? `€${profile.marketValue}M` : 'N/A',
                    jersey: 'N/A', // Not stored in database
                    birthday: profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A',
                    birthplace: 'N/A',
                    height: profile.height ? `${profile.height}m` : 'N/A',
                    weight: profile.weight ? `${profile.weight}kg` : 'N/A',
                    strongFoot: profile.preferredFoot || 'N/A',
                    internationalCaps: 0,
                    internationalGoals: 0,
                    stats: {
                        appearances: profile.appearances || 0,
                        goals: profile.goalsScored || 0,
                        assists: profile.assists || 0,
                        yellowCards: 0,
                        redCards: 0,
                    }
                };
            } else if (apiUser.role === 'AGENT' && apiUser.agentProfile) {
                const profile = apiUser.agentProfile;
                userData = {
                    ...userData,
                    position: 'Football Agent',
                    agency: profile.agency || 'Independent',
                    licenseNumber: profile.licenseNumber || 'N/A',
                    yearsExperience: profile.yearsExperience || 0,
                    stats: {
                        appearances: 0,
                        goals: 0,
                        assists: 0,
                        yellowCards: 0,
                        redCards: 0,
                    }
                };
            } else {
                // Default for ADMIN or CLUB_MANAGER
                userData = {
                    ...userData,
                    position: apiUser.role,
                    stats: {
                        appearances: 0,
                        goals: 0,
                        assists: 0,
                        yellowCards: 0,
                        redCards: 0,
                    }
                };
            }

            setUser(userData);
        } catch (err) {
            console.error('Load user profile error:', err);
            setError(err.response?.data?.error || err.message || 'Failed to load user profile.');
        } finally {
            setLoading(false);
        }
    };

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
