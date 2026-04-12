import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useToast } from '../../context/ToastContext';
import axiosClient from '../../api/axiosClient';
import './AdminDashboard.css';

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const toast = useToast();

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        try {
            setLoading(true);
            setError(''); // Clear previous errors
            console.log('📊 Loading dashboard...');
            const response = await axiosClient.get('/admin/dashboard');
            console.log('✅ Dashboard response:', response.data);

            if (response.data?.data) {
                setAnalytics(response.data.data);
                console.log('✅ Analytics set:', response.data.data);
            } else {
                console.error('❌ Invalid response format:', response.data);
                setError('Invalid response format from server');
            }
        } catch (err) {
            console.error('❌ Dashboard error:', err);
            const msg = err.response?.data?.error || err.message || 'Failed to load dashboard';
            console.error('❌ Error message:', msg);
            setError(msg);
            toast.error(msg);
            if (err.response?.status === 401 || err.response?.status === 403) {
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <LoadingSpinner fullPage />;

    return (
        <div>
            <Navbar />
            <div className="admin-dashboard">
                <div className="admin-header">
                    <h1 className="admin-title">Admin Dashboard</h1>
                    <p className="admin-subtitle">Comprehensive System Management & Analytics</p>
                </div>

                {error && (
                    <div className="admin-content" style={{ textAlign: 'center', padding: '20px' }}>
                        <p style={{ color: '#e74c3c', fontSize: '16px' }}>❌ {error}</p>
                        <button
                            onClick={loadDashboard}
                            style={{
                                marginTop: '10px',
                                padding: '8px 16px',
                                background: '#27ae60',
                                color: 'white',
                                border: 'none',
                                cursor: 'pointer',
                                borderRadius: '4px'
                            }}
                        >
                            Retry
                        </button>
                    </div>
                )}

                {!error && !analytics && (
                    <div className="admin-content" style={{ textAlign: 'center', padding: '40px' }}>
                        <p style={{ fontSize: '18px', color: '#7f8c8d' }}>⏳ Loading dashboard data...</p>
                    </div>
                )}

                {analytics && (
                    <div className="admin-content">
                        {/* Quick Stats */}
                        <div className="stats-section">
                            <h2 className="section-title">System Overview</h2>
                            <div className="stats-grid">
                                <div className="stat-card">
                                    <div className="stat-icon">⚽</div>
                                    <div className="stat-value">{analytics.overview.totalPlayers}</div>
                                    <div className="stat-label">Total Players</div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon">🏟️</div>
                                    <div className="stat-value">{analytics.overview.totalClubs}</div>
                                    <div className="stat-label">Total Clubs</div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon">🏆</div>
                                    <div className="stat-value">{analytics.overview.totalLeagues}</div>
                                    <div className="stat-label">Total Leagues</div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon">🤝</div>
                                    <div className="stat-value">{analytics.overview.totalAgents}</div>
                                    <div className="stat-label">Total Agents</div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon">🔄</div>
                                    <div className="stat-value">{analytics.overview.totalTransfers}</div>
                                    <div className="stat-label">Total Transfers</div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon">📋</div>
                                    <div className="stat-value">{analytics.overview.activeContracts}</div>
                                    <div className="stat-label">Active Contracts</div>
                                </div>
                                <div className="stat-card highlight">
                                    <div className="stat-icon">💰</div>
                                    <div className="stat-value">
                                        €{(analytics.overview.totalTransferValueThisSeason / 1000000).toFixed(2)}M
                                    </div>
                                    <div className="stat-label">Transfer Value (This Season)</div>
                                </div>
                                <div className="stat-card warning">
                                    <div className="stat-icon">⚠️</div>
                                    <div className="stat-value">{analytics.contracts.expiringCount}</div>
                                    <div className="stat-label">Contracts Expiring Soon</div>
                                </div>
                            </div>
                        </div>

                        {/* Management Sections */}
                        <div className="management-section">
                            <h2 className="section-title">Management Tools</h2>
                            <div className="management-grid">
                                <div className="management-card" onClick={() => navigate('/admin/players')}>
                                    <div className="management-icon">⚽</div>
                                    <h3 className="management-title">Player Management</h3>
                                    <p className="management-desc">Add, edit, delete players. View profiles & career history.</p>
                                    <button className="management-btn">Manage Players →</button>
                                </div>
                                <div className="management-card" onClick={() => navigate('/admin/transfers')}>
                                    <div className="management-icon">🔄</div>
                                    <h3 className="management-title">Transfer Management</h3>
                                    <p className="management-desc">Record transfers, view history & audit trail.</p>
                                    <button className="management-btn">Manage Transfers →</button>
                                </div>
                                <div className="management-card" onClick={() => navigate('/admin/contracts')}>
                                    <div className="management-icon">📋</div>
                                    <h3 className="management-title">Contract Management</h3>
                                    <p className="management-desc">View contracts, track expirations & renewals.</p>
                                    <button className="management-btn">Manage Contracts →</button>
                                </div>
                                <div className="management-card" onClick={() => navigate('/admin/clubs')}>
                                    <div className="management-icon">🏟️</div>
                                    <h3 className="management-title">Club Management</h3>
                                    <p className="management-desc">Manage clubs, squads & transfer budgets.</p>
                                    <button className="management-btn">Manage Clubs →</button>
                                </div>
                            </div>
                        </div>

                        {/* Recent Transfers */}
                        <div className="recent-section">
                            <h2 className="section-title">Recent Transfers</h2>
                            <div className="transfers-list">
                                {analytics.transfers.recent.slice(0, 5).map((transfer) => (
                                    <div key={transfer.transfer_id} className="transfer-item">
                                        <div className="transfer-player">
                                            <span className="player-icon">⚽</span>
                                            <div>
                                                <div className="player-name">
                                                    {transfer.player.first_name} {transfer.player.last_name}
                                                </div>
                                                <div className="player-position">{transfer.player.position}</div>
                                            </div>
                                        </div>
                                        <div className="transfer-details">
                                            <div className="transfer-route">
                                                <span className="club-name">{transfer.from_club.name}</span>
                                                <span className="arrow">→</span>
                                                <span className="club-name">{transfer.to_club.name}</span>
                                            </div>
                                            <div className="transfer-meta">
                                                <span className="transfer-type">{transfer.transfer_type}</span>
                                                <span className="transfer-fee">
                                                    €{transfer.transfer_fee ? (transfer.transfer_fee / 1000).toFixed(0) + 'K' : 'N/A'}
                                                </span>
                                                <span className="transfer-date">
                                                    {new Date(transfer.transfer_date).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Expiring Contracts */}
                        {analytics.contracts.expiring.length > 0 && (
                            <div className="expiring-section">
                                <h2 className="section-title">
                                    ⚠️ Contracts Expiring Soon (Within 3 Months)
                                </h2>
                                <div className="contracts-list">
                                    {analytics.contracts.expiring.slice(0, 5).map((contract) => (
                                        <div key={contract.contract_id} className="contract-item">
                                            <div className="contract-player">
                                                <span className="player-icon">⚽</span>
                                                <div>
                                                    <div className="player-name">
                                                        {contract.player.first_name} {contract.player.last_name}
                                                    </div>
                                                    <div className="club-name">{contract.club.name}</div>
                                                </div>
                                            </div>
                                            <div className="contract-end">
                                                <span className="end-label">Expires</span>
                                                <span className="end-date">
                                                    {new Date(contract.end_date).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Transfer Statistics */}
                        <div className="stats-section">
                            <h2 className="section-title">Transfer Statistics by Type</h2>
                            <div className="transfer-stats-grid">
                                {analytics.transfers.byType.map((stat) => (
                                    <div key={stat.transfer_type} className="transfer-stat-card">
                                        <div className="stat-type">{stat.transfer_type}</div>
                                        <div className="stat-count">{stat._count.transfer_id} transfers</div>
                                        <div className="stat-value">
                                            €{stat._sum.transfer_fee ? (stat._sum.transfer_fee / 1000000).toFixed(2) + 'M' : '0'}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Most Active Clubs */}
                        {analytics.clubs.mostActive.length > 0 && (
                            <div className="clubs-section">
                                <h2 className="section-title">Most Active Clubs (This Season)</h2>
                                <div className="clubs-table">
                                    {analytics.clubs.mostActive.slice(0, 5).map((club, index) => (
                                        <div key={club.club_id} className="club-row">
                                            <span className="club-rank">#{index + 1}</span>
                                            <span className="club-name">{club.name}</span>
                                            <span className="club-stat">
                                                <span className="stat-label">In:</span> {club.transfers_in}
                                            </span>
                                            <span className="club-stat">
                                                <span className="stat-label">Out:</span> {club.transfers_out}
                                            </span>
                                            <span className="club-total">
                                                Total: {club.total_transfers}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
