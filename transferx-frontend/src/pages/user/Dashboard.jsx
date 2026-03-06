import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import StatCard from '../../components/StatCard';
import TransferCard from '../../components/TransferCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorBanner from '../../components/ErrorBanner';
import axiosClient from '../../api/axiosClient';
import './Dashboard.css';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentTransfers, setRecentTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get('/stats');
      const data = response.data.data;
      
      setStats({
        totalPlayers: data.overview.totalPlayers,
        totalClubs: data.overview.totalClubs,
        totalLeagues: data.overview.totalLeagues,
        transfersThisSeason: data.overview.transfersThisSeason,
        transfersThisMonth: data.overview.transfersThisMonth,
        totalTransferValue: data.overview.totalTransferValue,
        totalPlayerMarketValue: data.overview.totalPlayerMarketValue,
      });
      setRecentTransfers(data.recentTransfers);
    } catch (err) {
      console.error('Dashboard error:', err);
      setError(err.response?.data?.error || 'Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div>
      <Navbar />
      {error && (
        <div style={{ padding: '40px' }}>
          <ErrorBanner message={error} onDismiss={() => setError('')} autoDismiss={true} dismissTimeout={5000} />
        </div>
      )}
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
          </>
        )}
      </div>
    </div>
  );
}
