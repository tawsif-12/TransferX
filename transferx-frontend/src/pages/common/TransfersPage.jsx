import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorBanner from '../../components/ErrorBanner';
import axiosClient from '../../api/axiosClient';
import './TransfersPage.css';

export default function TransfersPage() {
    const [transfers, setTransfers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadTransfers();
    }, []);

    const loadTransfers = async () => {
        try {
            setLoading(true);
            const response = await axiosClient.get('/transfers');
            setTransfers(response.data.data || []);
        } catch (err) {
            console.error('Transfers error:', err);
            setError(err.response?.data?.error || 'Failed to load transfers.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <LoadingSpinner fullPage />;

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    return (
        <div>
            <Navbar />
            <div className="transfers-page">
                <div className="page-header">
                    <h1 className="page-title">Transfers</h1>
                    <p className="page-subtitle">Latest player transfers in Bangladesh football</p>
                </div>

                {error ? (
                    <div style={{ padding: '40px' }}>
                        <ErrorBanner message={error} onDismiss={() => setError('')} autoDismiss={true} dismissTimeout={5000} />
                    </div>
                ) : (
                    <div className="page-content">
                        <div className="transfers-list">
                            {transfers.map((transfer) => {
                                const playerName = transfer.player_name || 
                                    (transfer.player ? `${transfer.player.first_name} ${transfer.player.last_name}` : 'Unknown');
                                const fromClubName = transfer.from_club?.name || transfer.from_club || 'Unknown';
                                const toClubName = transfer.to_club?.name || transfer.to_club || 'Unknown';
                                const fee = transfer.fee !== undefined ? transfer.fee : transfer.transfer_fee;

                                return (
                                    <div key={transfer.transfer_id} className="transfer-card">
                                        <div className="transfer-player">
                                            <div className="player-avatar">⚽</div>
                                            <div className="player-info">
                                                <h3 className="player-name">{playerName}</h3>
                                                <span className="transfer-type">{transfer.transfer_type}</span>
                                            </div>
                                        </div>

                                        <div className="transfer-flow">
                                            <div className="transfer-club from">
                                                <div className="club-badge">🛡️</div>
                                                <div>
                                                    <div className="label">From</div>
                                                    <div className="club-name">{fromClubName}</div>
                                                </div>
                                            </div>
                                            <div className="transfer-arrow">→</div>
                                            <div className="transfer-club to">
                                                <div className="club-badge">🛡️</div>
                                                <div>
                                                    <div className="label">To</div>
                                                    <div className="club-name">{toClubName}</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="transfer-details">
                                            <div className="detail">
                                                <span className="label">Transfer Fee</span>
                                                <span className="value">
                                                    {fee > 0 ? `€${fee.toLocaleString()}` : 'Free Transfer'}
                                                </span>
                                            </div>
                                            <div className="detail">
                                                <span className="label">Date</span>
                                                <span className="value">{formatDate(transfer.transfer_date)}</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
