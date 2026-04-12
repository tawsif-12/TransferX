import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import DataTable from '../../components/DataTable';
import LoadingSpinner from '../../components/LoadingSpinner';
import PlayerRating from '../../components/PlayerRating';
import { useToast } from '../../context/ToastContext';
import axiosClient from '../../api/axiosClient';
import './PlayersPage.css';

export default function PlayersPage() {
    const [players, setPlayers] = useState([]);
    const [clubs, setClubs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterPosition, setFilterPosition] = useState('');
    const [filterClub, setFilterClub] = useState('');
    const toast = useToast();
    const [sortBy, setSortBy] = useState('name');

    useEffect(() => {
        loadClubs();
    }, []);

    useEffect(() => {
        loadPlayers();
    }, [searchTerm, filterPosition, filterClub, sortBy]);

    const loadClubs = async () => {
        try {
            const response = await axiosClient.get('/clubs');
            const clubsData = response.data.data || response.data || [];
            const sortedClubs = clubsData
                .sort((a, b) => a.name.localeCompare(b.name))
                .map(club => ({
                    id: club.club_id,
                    name: club.name
                }));
            setClubs(sortedClubs);
        } catch (err) {
            console.error('Error loading clubs:', err);
        }
    };

    const loadPlayers = async () => {
        try {
            setLoading(true);
            setError('');
            
            const params = {};
            if (searchTerm) params.name = searchTerm;
            if (filterPosition) params.position = filterPosition;
            if (filterClub) params.clubId = filterClub;

            const response = await axiosClient.get('/players', { params });
            let playersData = (response.data.data || response.data || []).map(p => ({
                ...p,
                name: `${p.first_name} ${p.last_name}`,
                age: p.date_of_birth ? new Date().getFullYear() - new Date(p.date_of_birth).getFullYear() : 'N/A',
                club: p.current_club?.name || 'Free Agent',
                market_value: p.fee ? p.fee * 1000000 : 0, // Convert from millions to actual value
            }));

            // Sort players based on sortBy
            if (sortBy === 'value-high') {
                playersData.sort((a, b) => b.market_value - a.market_value);
            } else if (sortBy === 'value-low') {
                playersData.sort((a, b) => a.market_value - b.market_value);
            } else if (sortBy === 'age-young') {
                playersData.sort((a, b) => {
                    const ageA = typeof a.age === 'number' ? a.age : 999;
                    const ageB = typeof b.age === 'number' ? b.age : 999;
                    return ageA - ageB;
                });
            } else if (sortBy === 'age-old') {
                playersData.sort((a, b) => {
                    const ageA = typeof a.age === 'number' ? a.age : 0;
                    const ageB = typeof b.age === 'number' ? b.age : 0;
                    return ageB - ageA;
                });
            } else {
                // Default: sort by name
                playersData.sort((a, b) => a.name.localeCompare(b.name));
            }

            setPlayers(playersData);
        } catch (err) {
            console.error('Load players error:', err);
            const msg = err.response?.data?.error || err.message || 'Failed to load players.';
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <LoadingSpinner fullPage />;

    return (
        <div>
            <Navbar />
            <div className="players-page">
                <div className="page-header">
                    <h1 className="page-title">Players</h1>
                    <p className="page-subtitle">Browse all players in Bangladesh football</p>
                </div>

                {/*     <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="filter-select"
                        >
                            <option value="name">Sort by Name</option>
                            <option value="value-high">Market Value: High to Low</option>
                            <option value="value-low">Market Value: Low to High</option>
                            <option value="age-young">Age: Youngest First</option>
                            <option value="age-old">Age: Oldest First</option>
                        </select>
                    Search and Filter Section */}
                <div className="filters-section">
                    <div className="search-box">
                        <input
                            type="text"
                            placeholder="Search by player name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>
                    <div className="filter-group">
                        <select
                            value={filterPosition}
                            onChange={(e) => setFilterPosition(e.target.value)}
                            className="filter-select"
                        >
                            <option value="">All Positions</option>
                            <option value="GOALKEEPER">Goalkeeper</option>
                            <option value="DEFENDER">Defender</option>
                            <option value="MIDFIELDER">Midfielder</option>
                            <option value="FORWARD">Forward</option>
                        </select>
                        <select
                            value={filterClub}
                            onChange={(e) => setFilterClub(e.target.value)}
                            className="filter-select"
                        >
                            <option value="">All Clubs</option>
                            {clubs.map(club => (
                                <option key={club.id} value={club.id}>{club.name}</option>
                            ))}
                        </select>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="filter-select"
                        >
                            <option value="name">Sort by Name</option>
                            <option value="value-high">Market Value: High to Low</option>
                            <option value="value-low">Market Value: Low to High</option>
                            <option value="age-young">Age: Youngest First</option>
                            <option value="age-old">Age: Oldest First</option>
                        </select>
                    </div>
                </div>

                {error ? (
                    <div style={{ padding: '40px', textAlign: 'center' }}>
                        <p>{error}</p>
                    </div>
                ) : (
                    <div className="page-content">
                        {players.length === 0 ? (
                            <div className="no-players">
                                <p>No players found.</p>
                            </div>
                        ) : (
                            <div className="players-grid">
                                {players.map((player) => (
                                    <div key={player.player_id} className="player-card">
                                        <div className="player-card-header">
                                            <div className="player-avatar">⚽</div>
                                            <div className="player-info">
                                                <h3 className="player-name">{player.name}</h3>
                                                <p className="player-position">{player.position}</p>
                                            </div>
                                        </div>
                                        <div className="player-details">
                                            <div className="detail-row">
                                                <span className="detail-label">Age</span>
                                                <span className="detail-value">{player.age}</span>
                                            </div>
                                            <div className="detail-row">
                                                <span className="detail-label">Club</span>
                                                <span className="detail-value">{player.club}</span>
                                            </div>
                                            <div className="detail-row">
                                                <span className="detail-label">Nationality</span>
                                                <span className="detail-value">🇧🇩 {player.nationality || 'Bangladesh'}</span>
                                            </div>
                                            <div className="detail-row">
                                                <span className="detail-label">Market Value</span>
                                                <span className="detail-value highlight">
                                                    €{player.market_value >= 1000000 
                                                        ? `${(player.market_value / 1000000).toFixed(2)}M` 
                                                        : `${(player.market_value / 1000).toFixed(0)}K`}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="player-rating-section">
                                            <PlayerRating 
                                                playerId={player.player_id} 
                                                playerName={player.name}
                                            />
                                        </div>
                                        <a href={`/players/${player.player_id}`} className="player-card-link">View Profile</a>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
