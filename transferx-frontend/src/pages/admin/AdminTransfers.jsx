import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useToast } from '../../context/ToastContext';
import Modal from '../../components/Modal';
import Button from '../../components/Button';
import axiosClient from '../../api/axiosClient';
import './AdminPlayers.css';

export default function AdminTransfers() {
    const [transfers, setTransfers] = useState([]);
    const [players, setPlayers] = useState([]);
    const [clubs, setClubs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const toast = useToast();
    const [showModal, setShowModal] = useState(false);
    const [editingTransfer, setEditingTransfer] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [formData, setFormData] = useState({
        player_id: '',
        from_club_id: '',
        to_club_id: '',
        transfer_fee: '',
        transfer_date: new Date().toISOString().split('T')[0],
        transfer_type: 'PERMANENT',
    });
    const [filterType, setFilterType] = useState('');
    const [filterClub, setFilterClub] = useState('');

    useEffect(() => {
        loadTransfers();
        loadPlayers();
        loadClubs();
    }, [filterType, filterClub]);

    const loadTransfers = async () => {
        try {
            setLoading(true);
            const params = {};
            if (filterType) params.type = filterType;
            if (filterClub) params.clubId = filterClub;

            const response = await axiosClient.get('/admin/transfers', { params });
            setTransfers(response.data.data.transfers);
        } catch (err) {
            console.error('Load transfers error:', err);
            const msg = err.response?.data?.error || 'Failed to load transfers';
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    const loadPlayers = async () => {
        try {
            const response = await axiosClient.get('/players');
            setPlayers(response.data.data || response.data);
        } catch (err) {
            console.error('Load players error:', err);
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
        setEditingTransfer(null);
        setFormData({
            player_id: '',
            from_club_id: '',
            to_club_id: '',
            transfer_fee: '',
            transfer_date: new Date().toISOString().split('T')[0],
            transfer_type: 'PERMANENT',
        });
        setShowModal(true);
    };

    const handleEdit = (transfer) => {
        setEditingTransfer(transfer);
        setFormData({
            player_id: transfer.player_id,
            from_club_id: transfer.from_club_id,
            to_club_id: transfer.to_club_id,
            transfer_fee: transfer.transfer_fee || '',
            transfer_date: transfer.transfer_date?.split('T')[0] || '',
            transfer_type: transfer.transfer_type,
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            if (editingTransfer) {
                await axiosClient.put(`/admin/transfers/${editingTransfer.transfer_id}`, formData);
                toast.success('Transfer updated successfully');
            } else {
                await axiosClient.post('/admin/transfers', formData);
                toast.success('Transfer recorded successfully');
            }
            setShowModal(false);
            loadTransfers();
        } catch (err) {
            console.error('Save transfer error:', err);
            const msg = err.response?.data?.error || 'Failed to save transfer';
            setError(msg);
            toast.error(msg);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (transferId) => {
        if (!window.confirm('Are you sure you want to delete this transfer?')) return;

        try {
            setDeletingId(transferId);
            await axiosClient.delete(`/admin/transfers/${transferId}`);
            toast.success('Transfer deleted');
            loadTransfers();
        } catch (err) {
            console.error('Delete transfer error:', err);
            const msg = err.response?.data?.error || 'Failed to delete transfer';
            setError(msg);
            toast.error(msg);
        } finally {
            setDeletingId(null);
        }
    };

    if (loading && transfers.length === 0) return <LoadingSpinner fullPage />;

    return (
        <div>
            <Navbar />
            <div className="admin-transfers">
                <div className="admin-header">
                    <h1 className="admin-title">Transfer Management</h1>
                    <p className="admin-subtitle">Record and manage all transfers with full audit trail</p>
                </div>

                <div className="admin-content">
                    {error && (
                        <div style={{ padding: '20px', textAlign: 'center' }}><p>{error}</p></div>
                    )}

                    <div className="toolbar">
                        <div className="search-filters">
                            <select
                                className="filter-select"
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                            >
                                <option value="">All Types</option>
                                <option value="PERMANENT">Permanent</option>
                                <option value="LOAN">Loan</option>
                                <option value="FREE">Free</option>
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
                            ➕ Record Transfer
                        </button>
                    </div>

                    <div className="data-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Player</th>
                                    <th>From Club</th>
                                    <th>To Club</th>
                                    <th>Type</th>
                                    <th>Fee</th>
                                    <th>Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transfers.map(transfer => (
                                    <tr key={transfer.transfer_id}>
                                        <td>{transfer.transfer_id}</td>
                                        <td className="player-name">
                                            {transfer.player.first_name} {transfer.player.last_name}
                                        </td>
                                        <td>{transfer.from_club.name}</td>
                                        <td>{transfer.to_club.name}</td>
                                        <td>
                                            <span className={`badge transfer-type ${transfer.transfer_type}`}>
                                                {transfer.transfer_type}
                                            </span>
                                        </td>
                                        <td>
                                            {transfer.transfer_fee
                                                ? `€${(transfer.transfer_fee / 1000).toFixed(0)}K`
                                                : 'N/A'
                                            }
                                        </td>
                                        <td>{new Date(transfer.transfer_date).toLocaleDateString()}</td>
                                        <td>
                                            <div className="action-btns">
                                                <button
                                                    className="btn-edit"
                                                    onClick={() => handleEdit(transfer)}
                                                    disabled={deletingId !== null}
                                                    title="Edit"
                                                >
                                                    ✏️
                                                </button>
                                                <button
                                                    className="btn-delete"
                                                    onClick={() => handleDelete(transfer.transfer_id)}
                                                    disabled={deletingId === transfer.transfer_id}
                                                    title="Delete"
                                                >
                                                    {deletingId === transfer.transfer_id ? '⏳' : '🗑️'}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {transfers.length === 0 && !loading && (
                        <div className="empty-state">
                            <p>No transfers found</p>
                        </div>
                    )}
                </div>

                {showModal && (
                    <Modal onClose={() => setShowModal(false)}>
                        <h2 className="modal-title">
                            {editingTransfer ? 'Edit Transfer' : 'Record New Transfer'}
                        </h2>
                        <form onSubmit={handleSubmit} className="transfer-form">
                            <div className="form-group">
                                <label>Player *</label>
                                <select
                                    required
                                    value={formData.player_id}
                                    onChange={(e) => setFormData({ ...formData, player_id: e.target.value })}
                                >
                                    <option value="">Select Player</option>
                                    {players.map(player => (
                                        <option key={player.player_id} value={player.player_id}>
                                            {player.first_name} {player.last_name} - {player.position}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>From Club *</label>
                                    <select
                                        required
                                        value={formData.from_club_id}
                                        onChange={(e) => setFormData({ ...formData, from_club_id: e.target.value })}
                                    >
                                        <option value="">Select Club</option>
                                        {clubs.map(club => (
                                            <option key={club.club_id} value={club.club_id}>
                                                {club.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>To Club *</label>
                                    <select
                                        required
                                        value={formData.to_club_id}
                                        onChange={(e) => setFormData({ ...formData, to_club_id: e.target.value })}
                                    >
                                        <option value="">Select Club</option>
                                        {clubs.map(club => (
                                            <option key={club.club_id} value={club.club_id}>
                                                {club.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Transfer Type *</label>
                                    <select
                                        required
                                        value={formData.transfer_type}
                                        onChange={(e) => setFormData({ ...formData, transfer_type: e.target.value })}
                                    >
                                        <option value="PERMANENT">Permanent</option>
                                        <option value="LOAN">Loan</option>
                                        <option value="FREE">Free</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Transfer Fee (€)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={formData.transfer_fee}
                                        onChange={(e) => setFormData({ ...formData, transfer_fee: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Transfer Date *</label>
                                <input
                                    type="date"
                                    required
                                    value={formData.transfer_date}
                                    onChange={(e) => setFormData({ ...formData, transfer_date: e.target.value })}
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
                                    {editingTransfer ? 'Update Transfer' : 'Record Transfer'}
                                </Button>
                            </div>
                        </form>
                    </Modal>
                )}
            </div>
        </div>
    );
}
