import { useState, useEffect, useMemo } from 'react';
import Navbar from '../../components/Navbar';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useToast } from '../../context/ToastContext';
import axiosClient from '../../api/axiosClient';
import './TransfersPage.css';

export default function TransfersPage() {
    const [transfers, setTransfers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [sortBy, setSortBy] = useState('date');
    const [sortOrder, setSortOrder] = useState('desc');
    const toast = useToast();

    useEffect(() => {
        loadTransfers();
    }, []);

    const loadTransfers = async () => {
        try {
            setLoading(true);
            setError('');
            console.log('Fetching transfers from /transfers');
            
            // Fetch transfers without pagination - API returns all transfers
            const response = await axiosClient.get('/transfers');
            
            console.log('Transfers response:', response.data);
            
            // Handle response structure: { data: { data: [...], pagination: {...} } }
            let transfersData = response.data?.data?.data || response.data?.data || [];
            
            if (!Array.isArray(transfersData)) {
                console.error('Invalid transfers data format:', transfersData);
                setTransfers([]);
                return;
            }
            
            console.log(`✓ Loaded ${transfersData.length} transfers`);
            setTransfers(transfersData);
        } catch (err) {
            console.error('Transfers error:', err);
            const msg = err.response?.data?.error || err.message || 'Failed to load transfers.';
            setError(msg);
            toast.error(msg);
            setTransfers([]);
        } finally {
            setLoading(false);
        }
    };

    // Filter and sort transfers
    const filteredTransfers = useMemo(() => {
        let result = [...transfers];

        // Apply search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(t => {
                const playerName = (t.player_name || '').toLowerCase();
                const fromClub = (t.from_club?.name || t.from_club || '').toLowerCase();
                const toClub = (t.to_club?.name || t.to_club || '').toLowerCase();
                return playerName.includes(query) || fromClub.includes(query) || toClub.includes(query);
            });
        }

        // Apply type filter
        if (filterType !== 'all') {
            result = result.filter(t => (t.transfer_type || '').toLowerCase() === filterType);
        }

        // Apply sorting
        result.sort((a, b) => {
            let aVal, bVal;
            const fee_a = a.fee !== undefined ? a.fee : a.transfer_fee || 0;
            const fee_b = b.fee !== undefined ? b.fee : b.transfer_fee || 0;

            switch (sortBy) {
                case 'fee':
                    aVal = fee_a;
                    bVal = fee_b;
                    break;
                case 'player':
                    aVal = (a.player_name || '').toLowerCase();
                    bVal = (b.player_name || '').toLowerCase();
                    break;
                case 'date':
                default:
                    aVal = new Date(a.transfer_date).getTime();
                    bVal = new Date(b.transfer_date).getTime();
                    break;
            }

            if (sortOrder === 'asc') {
                return aVal > bVal ? 1 : -1;
            } else {
                return aVal < bVal ? 1 : -1;
            }
        });

        return result;
    }, [transfers, searchQuery, filterType, sortBy, sortOrder]);

    // Calculate statistics
    const stats = useMemo(() => {
        if (transfers.length === 0) return { total: 0, spent: 0, topTransfer: null, activeClubs: 0 };

        const totalSpent = transfers.reduce((sum, t) => sum + (t.fee !== undefined ? t.fee : t.transfer_fee || 0), 0);
        const topTransfer = transfers.reduce((max, t) => {
            const fee = t.fee !== undefined ? t.fee : t.transfer_fee || 0;
            const maxFee = max.fee !== undefined ? max.fee : max.transfer_fee || 0;
            return fee > maxFee ? t : max;
        });

        const uniqueClubs = new Set();
        transfers.forEach(t => {
            if (t.from_club?.name || t.from_club) uniqueClubs.add(t.from_club?.name || t.from_club);
            if (t.to_club?.name || t.to_club) uniqueClubs.add(t.to_club?.name || t.to_club);
        });

        return {
            total: transfers.length,
            spent: totalSpent,
            topTransfer,
            activeClubs: uniqueClubs.size
        };
    }, [transfers]);

    if (loading && transfers.length === 0) return <LoadingSpinner fullPage />;
    
    if (error) {
        return (
            <div>
                <Navbar />
                <div style={{ padding: '40px', textAlign: 'center' }}>
                    <h2>Error Loading Transfers</h2>
                    <p>{error}</p>
                    <button 
                        onClick={loadTransfers} 
                        style={{ marginTop: '20px', padding: '10px 20px', cursor: 'pointer', fontSize: '16px' }}
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (transfers.length === 0 && !loading) {
        return (
            <div>
                <Navbar />
                <div style={{ padding: '40px', textAlign: 'center' }}>
                    <h2>No Transfers Found</h2>
                    <p>There are currently no transfer records in the database.</p>
                </div>
            </div>
        );
    }

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    const formatCurrency = (amount) => {
        if (amount === 0) return 'Free';
        if (amount >= 1000000) return `€${(amount / 1000000).toFixed(1)}M`;
        if (amount >= 1000) return `€${(amount / 1000).toFixed(0)}K`;
        return `€${amount}`;
    };

    const getTransferTypeColor = (type) => {
        const t = (type || '').toLowerCase();
        if (t.includes('permanent')) return 'type-permanent';
        if (t.includes('loan')) return 'type-loan';
        if (t.includes('free')) return 'type-free';
        return 'type-default';
    };

    return (
        <div>
            <Navbar />
            <div className="transfers-page">
                {/* Header */}
                <div className="page-header">
                    <h1 className="page-title">⚽ Transfers</h1>
                    <p className="page-subtitle">Bangladesh Football Transfer Analytics</p>
                </div>

                <div className="page-content">
                    {/* Statistics Cards */}
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-icon">📊</div>
                            <div className="stat-content">
                                <div className="stat-label">Total Transfers</div>
                                <div className="stat-value">{stats.total}</div>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">💰</div>
                            <div className="stat-content">
                                <div className="stat-label">Total Spent</div>
                                <div className="stat-value">{formatCurrency(stats.spent)}</div>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">🏆</div>
                            <div className="stat-content">
                                <div className="stat-label">Biggest Transfer</div>
                                <div className="stat-value">
                                    {stats.topTransfer ? formatCurrency(stats.topTransfer.fee !== undefined ? stats.topTransfer.fee : stats.topTransfer.transfer_fee || 0) : '—'}
                                </div>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-icon">🏢</div>
                            <div className="stat-content">
                                <div className="stat-label">Active Clubs</div>
                                <div className="stat-value">{stats.activeClubs}</div>
                            </div>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="controls-section">
                        <div className="search-box">
                            <span className="search-icon">🔍</span>
                            <input
                                type="text"
                                placeholder="Search by player or club..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="search-input"
                            />
                        </div>

                        <div className="filter-controls">
                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                className="filter-select"
                            >
                                <option value="all">All Types</option>
                                <option value="permanent">Permanent</option>
                                <option value="loan">Loan</option>
                                <option value="free">Free</option>
                            </select>

                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="filter-select"
                            >
                                <option value="date">Sort by Date</option>
                                <option value="fee">Sort by Fee</option>
                                <option value="player">Sort by Player</option>
                            </select>

                            <button
                                onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                                className="sort-btn"
                                title={`Sort ${sortOrder === 'desc' ? 'ascending' : 'descending'}`}
                            >
                                {sortOrder === 'desc' ? '↓' : '↑'}
                            </button>
                        </div>
                    </div>

                    {/* Results */}
                    {error ? (
                        <div className="error-message">
                            <span>⚠️</span> {error}
                        </div>
                    ) : filteredTransfers.length === 0 ? (
                        <div className="no-results">
                            <span className="no-results-icon">🔍</span>
                            <p>No transfers found matching your criteria</p>
                        </div>
                    ) : (
                        <div className="transfers-table-container">
                            <table className="transfers-table">
                                <thead>
                                    <tr>
                                        <th>Player</th>
                                        <th>From</th>
                                        <th>To</th>
                                        <th>Fee</th>
                                        <th>Type</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredTransfers.map((transfer, idx) => {
                                        const playerName = transfer.player_name ||
                                            (transfer.player ? `${transfer.player.first_name} ${transfer.player.last_name}` : 'Unknown');
                                        const fromClubName = transfer.from_club?.name || transfer.from_club || 'Unknown';
                                        const toClubName = transfer.to_club?.name || transfer.to_club || 'Unknown';
                                        const fee = transfer.fee !== undefined ? transfer.fee : transfer.transfer_fee;

                                        return (
                                            <tr key={transfer.transfer_id} className="transfer-row" style={{ animationDelay: `${idx * 50}ms` }}>
                                                <td className="cell-player">
                                                    <div className="player-cell">
                                                        <span className="player-avatar">⚽</span>
                                                        <span className="player-name">{playerName}</span>
                                                    </div>
                                                </td>
                                                <td className="cell-club">
                                                    <div className="club-cell">
                                                        <span className="club-badge">🛡️</span>
                                                        <span>{fromClubName}</span>
                                                    </div>
                                                </td>
                                                <td className="cell-club">
                                                    <div className="club-cell">
                                                        <span className="club-badge">🛡️</span>
                                                        <span>{toClubName}</span>
                                                    </div>
                                                </td>
                                                <td className="cell-fee">
                                                    <span className="fee-badge">
                                                        {fee > 0 ? formatCurrency(fee) : 'Free'}
                                                    </span>
                                                </td>
                                                <td className="cell-type">
                                                    <span className={`type-badge ${getTransferTypeColor(transfer.transfer_type)}`}>
                                                        {transfer.transfer_type || 'Unknown'}
                                                    </span>
                                                </td>
                                                <td className="cell-date">
                                                    <span className="date-text">{formatDate(transfer.transfer_date)}</span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Results info */}
                    {filteredTransfers.length > 0 && (
                        <div className="results-info">
                            Showing {filteredTransfers.length} of {transfers.length} transfers
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
