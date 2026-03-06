import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useToast } from '../../context/ToastContext';
import Modal from '../../components/Modal';
import Button from '../../components/Button';
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
        position: 'Midfielder',
        nationality: 'Bangladeshi',
        current_club_id: '',
        fee: '',
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
            const params = {};
            if (searchTerm) params.search = searchTerm;
            if (filterPosition) params.position = filterPosition;
            if (filterClub) params.clubId = filterClub;

            const response = await axiosClient.get('/admin/players', { params });
            setPlayers(response.data.data.players);
        } catch (err) {
            console.error('Load players error:', err);
            const msg = err.response?.data?.error || 'Failed to load players';
            setError(msg);
            toast.error(msg);
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
        setFormData({
            first_name: '',
            last_name: '',
            date_of_birth: '',
            position: 'Midfielder',
            nationality: 'Bangladeshi',
            current_club_id: '',
            fee: '',
        });
        setShowModal(true);
    };

    const handleEdit = (player) => {
        setEditingPlayer(player);
        setFormData({
            first_name: player.first_name,
            last_name: player.last_name,
            date_of_birth: player.date_of_birth?.split('T')[0] || '',
            position: player.position || 'Midfielder',
            nationality: player.nationality || 'Bangladeshi',
            current_club_id: player.current_club_id || '',
            fee: player.fee || '',
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            if (editingPlayer) {
                await axiosClient.put(`/admin/players/${editingPlayer.player_id}`, formData);
                toast.success('Player updated successfully');
            } else {
                await axiosClient.post('/admin/players', formData);
                toast.success('Player added successfully');
            }
            setShowModal(false);
            loadPlayers();
        } catch (err) {
            console.error('Save player error:', err);
            const msg = err.response?.data?.error || 'Failed to save player';
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
                                    <tr key={player.player_id}>
                                        <td>{player.player_id}</td>
                                        <td className="player-name">
                                            {player.first_name} {player.last_name}
                                        </td>
                                        <td>
                                            <span className="badge position">{player.position}</span>
                                        </td>
                                        <td>{player.date_of_birth ? new Date(player.date_of_birth).toLocaleDateString() : 'N/A'}</td>
                                        <td>{player.nationality || 'N/A'}</td>
                                        <td>{player.current_club?.name || 'Free Agent'}</td>
                                        <td>{player._count?.transfers_from || 0}</td>
                                        <td>{player._count?.contracts || 0}</td>
                                        <td>
                                            <div className="action-btns">
                                                <button
                                                    className="btn-view"
                                                    onClick={() => handleViewProfile(player.player_id)}
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
                                                    onClick={() => handleDelete(player.player_id)}
                                                    disabled={deletingId === player.player_id}
                                                    title="Delete"
                                                >
                                                    {deletingId === player.player_id ? '⏳' : '🗑️'}
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

                {/* Modal */}
                {showModal && (
                    <Modal onClose={() => setShowModal(false)}>
                        <h2 className="modal-title">
                            {editingPlayer ? 'Edit Player' : 'Add New Player'}
                        </h2>
                        <form onSubmit={handleSubmit} className="player-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label>First Name *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.first_name}
                                        onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Last Name *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.last_name}
                                        onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Date of Birth *</label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.date_of_birth}
                                        onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Position</label>
                                    <select
                                        value={formData.position}
                                        onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                                    >
                                        <option value="Goalkeeper">Goalkeeper</option>
                                        <option value="Defender">Defender</option>
                                        <option value="Midfielder">Midfielder</option>
                                        <option value="Forward">Forward</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Nationality</label>
                                    <input
                                        type="text"
                                        value={formData.nationality}
                                        onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Current Club</label>
                                    <select
                                        value={formData.current_club_id}
                                        onChange={(e) => setFormData({ ...formData, current_club_id: e.target.value })}
                                    >
                                        <option value="">Free Agent</option>
                                        {clubs.map(club => (
                                            <option key={club.club_id} value={club.club_id}>
                                                {club.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Transfer Fee (€)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.fee}
                                    onChange={(e) => setFormData({ ...formData, fee: e.target.value })}
                                />
                            </div>

                            <div className="form-actions">
                                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)} disabled={submitting}>
                                    Cancel
                                </button>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    loading={submitting}
                                    disabled={submitting}
                                >
                                    {editingPlayer ? 'Update Player' : 'Create Player'}
                                </Button>
                            </div>
                        </form>
                    </Modal>
                )}
            </div>
        </div>
    );
}
