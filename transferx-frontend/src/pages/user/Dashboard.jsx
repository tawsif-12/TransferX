import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import StatCard from '../../components/StatCard';
import TransferCard from '../../components/TransferCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useToast } from '../../context/ToastContext';
import axiosClient from '../../api/axiosClient';
import './Dashboard.css';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentTransfers, setRecentTransfers] = useState([]);
  const [topPlayers, setTopPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [topPlayersError, setTopPlayersError] = useState('');
  const toast = useToast();

  useEffect(() => {
    loadDashboard();
    loadTopRatedPlayers();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get('/stats');
      const data = response.data?.data || response.data;
      
      if (!data || !data.overview) {
        console.error('Invalid stats response:', response.data);
        throw new Error('Invalid stats response structure');
      }
      
      setStats({
        totalPlayers: data.overview.totalPlayers || 0,
        totalClubs: data.overview.totalClubs || 0,
        totalLeagues: data.overview.totalLeagues || 0,
        transfersThisSeason: data.overview.transfersThisSeason || data.overview.totalTransfers || 0,
        transfersThisMonth: data.overview.transfersThisMonth || 0,
        totalTransferValue: data.overview.totalTransferValue || 0,
        totalPlayerMarketValue: data.overview.totalPlayerMarketValue || 0,
      });
      setRecentTransfers(data.recentTransfers || []);
    } catch (err) {
      console.error('Dashboard error:', err);
      const msg = err.response?.data?.error || err.message || 'Failed to load dashboard data.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const loadTopRatedPlayers = async () => {
    try {
      const response = await axiosClient.get('/players/top-rated');
      setTopPlayers(response.data || []);
      setTopPlayersError('');
    } catch (err) {
      console.error('Failed to fetch top rated players:', err);
      setTopPlayersError('Failed to load top rated players');
    }
  };

  if (loading) return <LoadingSpinner fullPage />;
  
  if (error) {
    return (
      <div>
        <Navbar />
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <p>{error}</p>
          <button onClick={loadDashboard} style={{ marginTop: '20px', padding: '10px 20px', cursor: 'pointer' }}>
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  if (!stats) {
    return (
      <div>
        <Navbar />
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <p>No dashboard data available</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="dashboard">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Dashboard</h1>
          <p className="dashboard-subtitle">Welcome back! Here's an overview of the transfer market.</p>
        </div>

        {stats && (
          <>
            <div className="dashboard-stats">
              <StatCard
                label="Total Players"
                value={stats.totalPlayers.toLocaleString()}
                icon="⚽"
              />
              <StatCard
                label="Total Clubs"
                value={stats.totalClubs.toLocaleString()}
                icon="🛡"
              />
              <StatCard
                label="Total Transfers"
                value={stats.transfersThisSeason.toLocaleString()}
                icon="↔"
                trend={`+${stats.transfersThisMonth} this month`}
              />
              <StatCard
                label="Total Value"
                value={`€${parseFloat(stats.totalPlayerMarketValue || 0).toFixed(1)}M`}
                icon="💰"
              />
            </div>

            <div className="dashboard-section">
              <h2 className="dashboard-section-title">Recent Transfers</h2>
              <div className="dashboard-transfers">
                {recentTransfers.map((transfer) => (
                  <TransferCard key={transfer.transfer_id} transfer={transfer} />
                ))}
              </div>
            </div>

            <div className="dashboard-section">
              <h2 className="dashboard-section-title">Top Rated Players</h2>
              {topPlayersError && (
                <div className="error-message">{topPlayersError}</div>
              )}
              {topPlayers.length > 0 ? (
                <div className="top-rated-grid">
                  {topPlayers.map((player, index) => (
                    <div key={player.player_id} className="player-card">
                      <div className="player-rank">#{index + 1}</div>
                      <div className="player-info">
                        <h3>{player.first_name} {player.last_name}</h3>
                        <p className="position">{player.position}</p>
                        <p className="nationality">{player.nationality}</p>
                      </div>
                      <div className="player-stats">
                        <div className="stat">
                          <div className="stat-label">Average Rating</div>
                          <div className="stat-value">⭐ {parseFloat(player.averageRating).toFixed(1)}</div>
                        </div>
                        <div className="stat">
                          <div className="stat-label">Total Ratings</div>
                          <div className="stat-value">{player.totalRatings}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-data">No rated players yet</div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
