import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useToast } from '../../context/ToastContext';
import Button from '../../components/Button';
import AdminPlayerEdit from './AdminPlayerEdit';
import axiosClient from '../../api/axiosClient';
import './AdminPlayers.css';

export default function AdminPlayers() {
    const navigate = useNavigate();
    const [players, setPlayers] = useState([]);
    const [clubs, setClubs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const toast = useToast();
    const [showModal, setShowModal] = useState(false);
    const [editingPlayer, setEditingPlayer] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        date_of_birth: '',
        position: 'MIDFIELDER',
        nationality: 'Bangladeshi',
        current_club_id: '',
        fee: '',
        marketValue: '',
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [filterPosition, setFilterPosition] = useState('');
    const [filterClub, setFilterClub] = useState('');

    useEffect(() => {
        loadPlayers();
        loadClubs();
    }, [searchTerm, filterPosition, filterClub]);

    const loadPlayers = async () => {
        try {
            setLoading(true);
            setError('');
            console.log('📋 Loading players...');
            const params = {};
            if (searchTerm) params.search = searchTerm;
            if (filterPosition) params.position = filterPosition;
            if (filterClub) params.clubId = filterClub;

            const response = await axiosClient.get('/admin/players', { params });
            console.log('✅ Players loaded:', response.data.data.players.length);
            setPlayers(response.data.data.players);
            return response.data.data.players;
        } catch (err) {
            console.error('❌ Load players error:', err);
            const msg = err.response?.data?.error || 'Failed to load players';
            setError(msg);
            toast.error(msg);
            return [];
        } finally {
            setLoading(false);
        }
    };

    const loadClubs = async () => {
        try {
            const response = await axiosClient.get('/clubs');
            setClubs(response.data.data || response.data);
        } catch (err) {
            console.error('Load clubs error:', err);
        }
    };

    const handleAdd = () => {
        setEditingPlayer(null);
        setShowModal(true);
    };

    const handleEdit = async (player) => {
        try {
            console.log('🔍 Fetching full player details for edit...');
            const response = await axiosClient.get(`/admin/players/${player.id}`);
            console.log('✅ Full player data loaded:', response.data.data);
            setEditingPlayer(response.data.data);
            setShowModal(true);
        } catch (err) {
            console.error('❌ Failed to load player details:', err);
            toast.error('Failed to load player details');
        }
    };

    const handleSubmit = async (data) => {
        try {
            setSubmitting(true);
            console.log('💾 Handling submit, editing:', !!editingPlayer);
            console.log('📊 Data to save:', data);
            
            if (editingPlayer) {
                console.log(`🔄 Updating player ${editingPlayer.id}...`);
                const response = await axiosClient.put(`/admin/players/${editingPlayer.id}`, data);
                console.log('✅ Update response:', response);
                toast.success('Player updated successfully');
            } else {
                console.log('➕ Creating new player...');
                const response = await axiosClient.post('/admin/players', data);
                console.log('✅ Create response:', response);
                toast.success('Player added successfully');
            }
            setShowModal(false);
            console.log('📋 Reloading players...');
            await loadPlayers();
            console.log('✅ Players reloaded');
        } catch (err) {
            console.error('❌ Save player error:', err);
            console.error('Error response:', err.response?.data);
            const msg = err.response?.data?.error || err.message || 'Failed to save player';
            setError(msg);
            toast.error(msg);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (playerId) => {
        if (!window.confirm('Are you sure you want to delete this player?')) return;

        try {
            setDeletingId(playerId);
            await axiosClient.delete(`/admin/players/${playerId}`);
            toast.success('Player deleted');
            loadPlayers();
        } catch (err) {
            console.error('Delete player error:', err);
            const msg = err.response?.data?.error || 'Failed to delete player';
            setError(msg);
            toast.error(msg);
        } finally {
            setDeletingId(null);
        }
    };

    const handleViewProfile = (playerId) => {
        navigate(`/players/${playerId}`);
    };

    if (loading && players.length === 0) return <LoadingSpinner fullPage />;

    return (
        <div>
            <Navbar />
            <div className="admin-players">
                <div className="admin-header">
                    <h1 className="admin-title">Player Management</h1>
                    <p className="admin-subtitle">Add, edit, and manage all players</p>
                </div>

                <div className="admin-content">
                    {error && (
                        <div style={{ padding: '20px', textAlign: 'center' }}><p>{error}</p></div>
                    )}
                    {/* Toolbar */}
                    <div className="toolbar">
                        <div className="search-filters">
                            <input
                                type="text"
                                placeholder="Search players..."
                                className="search-input"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <select
                                className="filter-select"
                                value={filterPosition}
                                onChange={(e) => setFilterPosition(e.target.value)}
                            >
                                <option value="">All Positions</option>
                                <option value="Goalkeeper">Goalkeeper</option>
                                <option value="Defender">Defender</option>
                                <option value="Midfielder">Midfielder</option>
                                <option value="Forward">Forward</option>
                            </select>
                            <select
                                className="filter-select"
                                value={filterClub}
                                onChange={(e) => setFilterClub(e.target.value)}
                            >
                                <option value="">All Clubs</option>
                                {clubs.map(club => (
                                    <option key={club.club_id} value={club.club_id}>
                                        {club.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button className="add-btn" onClick={handleAdd}>
                            ➕ Add Player
                        </button>
                    </div>

                    {/* Players Table */}
                    <div className="data-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Position</th>
                                    <th>Date of Birth</th>
                                    <th>Nationality</th>
                                    <th>Current Club</th>
                                    <th>Transfers</th>
                                    <th>Contracts</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {players.map(player => (
                                    <tr key={player.id}>
                                        <td>{player.id}</td>
                                        <td className="player-name">
                                            {player.first_name} {player.last_name}
                                        </td>
                                        <td>
                                            <span className="badge position">{player.position}</span>
                                        </td>
                                        <td>{player.date_of_birth ? new Date(player.date_of_birth).toLocaleDateString() : 'N/A'}</td>
                                        <td>{player.nationality || 'N/A'}</td>
                                        <td>{player.club_name || 'Free Agent'}</td>
                                        <td>-</td>
                                        <td>-</td>
                                        <td>
                                            <div className="action-btns">
                                                <button
                                                    className="btn-view"
                                                    onClick={() => handleViewProfile(player.id)}
                                                    disabled={deletingId !== null}
                                                    title="View Profile"
                                                >
                                                    👁️
                                                </button>
                                                <button
                                                    className="btn-edit"
                                                    onClick={() => handleEdit(player)}
                                                    disabled={deletingId !== null}
                                                    title="Edit"
                                                >
                                                    ✏️
                                                </button>
                                                <button
                                                    className="btn-delete"
                                                    onClick={() => handleDelete(player.id)}
                                                    disabled={deletingId === player.id}
                                                    title="Delete"
                                                >
                                                    {deletingId === player.id ? '⏳' : '🗑️'}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {players.length === 0 && !loading && (
                        <div className="empty-state">
                            <p>No players found</p>
                        </div>
                    )}
                </div>

                {/* Edit Player Modal */}
                {showModal && (
                    <AdminPlayerEdit
                        player={editingPlayer}
                        clubs={clubs}
                        onClose={() => setShowModal(false)}
                        onSubmit={handleSubmit}
                        isSubmitting={submitting}
                    />
                )}
            </div>
        </div>
    );
}
