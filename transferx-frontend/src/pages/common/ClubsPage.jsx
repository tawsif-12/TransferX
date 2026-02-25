import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorBanner from '../../components/ErrorBanner';
import { fakeFetch } from '../../utils/fakeFetch';
import { mockClubs } from '../../mock/clubs';
import './ClubsPage.css';

export default function ClubsPage() {
    const [clubs, setClubs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        (async () => {
            try {
                const data = await fakeFetch(mockClubs);
                setClubs(data);
            } catch (err) {
                setError(err.message || 'Failed to load clubs.');
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    if (loading) return <LoadingSpinner fullPage />;

    return (
        <div>
            <Navbar />
            <div className="clubs-page">
                <div className="page-header">
                    <h1 className="page-title">Clubs</h1>
                    <p className="page-subtitle">Explore Bangladesh Premier League clubs</p>
                </div>

                {error ? (
                    <div style={{ padding: '40px' }}>
                        <ErrorBanner message={error} />
                    </div>
                ) : (
                    <div className="page-content">
                        <div className="clubs-grid">
                            {clubs.map((club) => (
                                <div key={club.club_id} className="club-card">
                                    <div className="club-card-header">
                                        <div className="club-logo">🛡️</div>
                                        <h3 className="club-name">{club.name}</h3>
                                    </div>
                                    <div className="club-details">
                                        <div className="detail-row">
                                            <span className="detail-label">League</span>
                                            <span className="detail-value">{club.league_name}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="detail-label">Founded</span>
                                            <span className="detail-value">{club.founded_year}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="detail-label">Country</span>
                                            <span className="detail-value">🇧🇩 {club.country}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="detail-label">Budget</span>
                                            <span className="detail-value highlight">€{(club.budget / 1000000).toFixed(1)}M</span>
                                        </div>
                                    </div>
                                    <button className="club-card-btn">View Details</button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
