import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import StatCard from '../../components/StatCard';
import TransferCard from '../../components/TransferCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorBanner from '../../components/ErrorBanner';
import { fakeFetch } from '../../utils/fakeFetch';
import { mockStats } from '../../mock/stats';
import { mockTransfers } from '../../mock/transfers';
import './Dashboard.css';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentTransfers, setRecentTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        // REAL API (uncomment when backend ready):
        // const statsRes = await axiosClient.get('/stats/summary');
        // const transfersRes = await axiosClient.get('/transfers/recent');
        // setStats(statsRes.data);
        // setRecentTransfers(transfersRes.data);

        // MOCK (active now):
        const statsData = await fakeFetch(mockStats);
        const transfersData = await fakeFetch(mockTransfers.slice(0, 5));
        setStats(statsData);
        setRecentTransfers(transfersData);
      } catch (err) {
        setError(err.message || 'Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <LoadingSpinner fullPage />;
  if (error) return (
    <div>
      <Navbar />
      <div style={{ padding: '40px' }}>
        <ErrorBanner message={error} onDismiss={() => setError('')} autoDismiss={true} dismissTimeout={5000} />
      </div>
    </div>
  );

  return (
    <div>
      <Navbar />
      <div className="dashboard">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Dashboard</h1>
          <p className="dashboard-subtitle">Welcome back! Here's an overview of the transfer market.</p>
        </div>

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
            trend="+156 this month"
          />
          <StatCard
            label="Total Value"
            value="€12.4B"
            icon="💰"
            trend="+8% YoY"
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
      </div>
    </div>
  );
}
