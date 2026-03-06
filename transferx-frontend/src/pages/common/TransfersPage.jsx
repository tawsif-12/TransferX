import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useToast } from '../../context/ToastContext';
import { fakeFetch } from '../../utils/fakeFetch';
import { mockTransfers } from '../../mock/transfers';
import './TransfersPage.css';

export default function TransfersPage() {
    const [transfers, setTransfers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const toast = useToast();

    useEffect(() => {
        (async () => {
            try {
                const data = await fakeFetch(mockTransfers);
                setTransfers(data);
            } catch (err) {
                const msg = err.message || 'Failed to load transfers.';
                setError(msg);
                toast.error(msg);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

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
                    <div style={{ padding: '40px', textAlign: 'center' }}>
                        <p>{error}</p>
                    </div>
                ) : (
                    <div className="page-content">
                        <div className="transfers-list">
                            {transfers.map((transfer) => (
                                <div key={transfer.transfer_id} className="transfer-card">
                                    <div className="transfer-player">
                                        <div className="player-avatar">⚽</div>
                                        <div className="player-info">
                                            <h3 className="player-name">{transfer.player_name}</h3>
                                            <span className="transfer-type">{transfer.transfer_type}</span>
                                        </div>
                                    </div>

                                    <div className="transfer-flow">
                                        <div className="transfer-club from">
                                            <div className="club-badge">🛡️</div>
                                            <div>
                                                <div className="label">From</div>
                                                <div className="club-name">{transfer.from_club}</div>
                                            </div>
                                        </div>
                                        <div className="transfer-arrow">→</div>
                                        <div className="transfer-club to">
                                            <div className="club-badge">🛡️</div>
                                            <div>
                                                <div className="label">To</div>
                                                <div className="club-name">{transfer.to_club}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="transfer-details">
                                        <div className="detail">
                                            <span className="label">Transfer Fee</span>
                                            <span className="value">
                                                {transfer.fee > 0 ? `€${transfer.fee.toLocaleString()}` : 'Free Transfer'}
                                            </span>
                                        </div>
                                        <div className="detail">
                                            <span className="label">Date</span>
                                            <span className="value">{formatDate(transfer.transfer_date)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
