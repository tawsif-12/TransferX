import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useToast } from '../../context/ToastContext';
import axiosClient from '../../api/axiosClient';

export default function ClubDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [club, setClub] = useState(null);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const toast = useToast();

  useEffect(() => {
    loadClubData();
  }, [id]);

  const loadClubData = async () => {
    try {
      setLoading(true);
      
      // Fetch club data
      const clubResponse = await axiosClient.get(`/clubs/${id}`);
      setClub(clubResponse.data.data || clubResponse.data);

      // Fetch club players
      try {
        const playersResponse = await axiosClient.get(`/clubs/${id}/players`);
        setPlayers(playersResponse.data.data || []);
      } catch (err) {
        // If endpoint doesn't exist, try fetching all players and filter
        const allPlayersResponse = await axiosClient.get('/players');
        const clubPlayers = allPlayersResponse.data.data.filter(p => p.current_club_id === parseInt(id));
        setPlayers(clubPlayers);
      }
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to load club details.';
      console.error('Club detail error:', err);
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner fullPage />;

  if (error) {
    return (
      <div>
        <Navbar />
        <div style={{ padding: '60px 24px', textAlign: 'center', minHeight: '100vh' }}>
          <h2 style={{ color: 'var(--red-primary)', marginBottom: '16px' }}>Error</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>{error}</p>
          <button 
            onClick={() => navigate('/clubs')}
            style={{
              padding: '10px 20px',
              backgroundColor: 'var(--green-primary)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Back to Clubs
          </button>
        </div>
      </div>
    );
  }

  if (!club) {
    return (
      <div>
        <Navbar />
        <div style={{ padding: '60px 24px', textAlign: 'center', minHeight: '100vh' }}>
          <h2>Club Not Found</h2>
        </div>
      </div>
    );
  }

  // Group players by position
  const groupedPlayers = players.reduce((acc, player) => {
    const pos = player.position || 'Unknown';
    if (!acc[pos]) acc[pos] = [];
    acc[pos].push(player);
    return acc;
  }, {});

  const positions = ['GOALKEEPER', 'DEFENDER', 'MIDFIELDER', 'FORWARD', 'Goalkeeper', 'Defender', 'Midfielder', 'Forward'];

  return (
    <div>
      <Navbar />
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        {/* Club Header */}
        <div style={{
          background: 'linear-gradient(135deg, var(--green-primary), var(--green-dark))',
          color: 'white',
          padding: '40px',
          borderRadius: '12px',
          marginBottom: '40px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>🛡️</div>
          <h1 style={{ fontSize: '48px', marginBottom: '8px', fontWeight: 'bold' }}>
            {club.name}
          </h1>
          <p style={{ fontSize: '20px', opacity: 0.95, marginBottom: '16px' }}>
            {club.league?.name || club.league_name || 'Bangladesh Premier League'}
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', flexWrap: 'wrap', marginTop: '24px' }}>
            <div>
              <div style={{ fontSize: '14px', opacity: 0.8 }}>Founded</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{club.founded_year || 'N/A'}</div>
            </div>
            <div>
              <div style={{ fontSize: '14px', opacity: 0.8 }}>Country</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>🇧🇩 {club.country}</div>
            </div>
            {club.budget && (
              <div>
                <div style={{ fontSize: '14px', opacity: 0.8 }}>Budget</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>€{(club.budget / 1000000).toFixed(1)}M</div>
              </div>
            )}
          </div>
        </div>

        {/* Squad Section */}
        <div>
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '32px', marginBottom: '8px', color: 'var(--text-primary)' }}>
              Squad ({players.length} Players)
            </h2>
            <p style={{ color: 'var(--text-muted)' }}>Current squad composition</p>
          </div>

          {players.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: '12px',
              color: 'var(--text-muted)'
            }}>
              <p style={{ fontSize: '18px' }}>No players in this club yet</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
              {positions.map(position => {
                const posPlayers = groupedPlayers[position] || [];
                if (posPlayers.length === 0) return null;

                return (
                  <div key={position} style={{
                    backgroundColor: 'var(--bg-secondary)',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    border: '1px solid var(--border-color)'
                  }}>
                    <div style={{
                      background: 'linear-gradient(135deg, var(--green-primary), var(--green-dark))',
                      color: 'white',
                      padding: '16px',
                      fontWeight: 'bold',
                      fontSize: '16px'
                    }}>
                      {position} ({posPlayers.length})
                    </div>
                    <div style={{ padding: '16px' }}>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {posPlayers.map(player => (
                          <li 
                            key={player.player_id} 
                            onClick={() => navigate(`/players/${player.player_id}`)}
                            style={{
                              padding: '12px 8px',
                              borderBottom: '1px solid var(--border-color)',
                              cursor: 'pointer',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              transition: 'background-color 0.2s',
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-hover)'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                            <span style={{ color: 'var(--text-primary)' }}>
                              {player.first_name} {player.last_name}
                            </span>
                            {player.fee > 0 && (
                              <span style={{
                                backgroundColor: 'var(--green-light)',
                                color: 'var(--green-dark)',
                                padding: '4px 8px',
                                borderRadius: '4px',
                                fontSize: '12px',
                                fontWeight: 'bold'
                              }}>
                                €{(player.fee / 1000).toFixed(0)}k
                              </span>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Back Button */}
        <div style={{ marginTop: '40px' }}>
          <button
            onClick={() => navigate('/clubs')}
            style={{
              padding: '12px 24px',
              backgroundColor: 'var(--green-primary)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
              transition: 'opacity 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.opacity = '0.8'}
            onMouseLeave={(e) => e.target.style.opacity = '1'}
          >
            ← Back to Clubs
          </button>
        </div>
      </div>
    </div>
  );
}
