import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorBanner from '../../components/ErrorBanner';
import Modal from '../../components/Modal';
import axiosClient from '../../api/axiosClient';
import './AdminPlayers.css';

export default function AdminContracts() {
    const [contracts, setContracts] = useState([]);
    const [players, setPlayers] = useState([]);
    const [clubs, setClubs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingContract, setEditingContract] = useState(null);
    const [formData, setFormData] = useState({
        player_id: '',
        club_id: '',
        start_date: new Date().toISOString().split('T')[0],
        end_date: '',
        salary: '',
    });
    const [filterStatus, setFilterStatus] = useState('');
    const [filterClub, setFilterClub] = useState('');

    useEffect(() => {
        loadContracts();
        loadPlayers();
        loadClubs();
    }, [filterStatus, filterClub]);

    const loadContracts = async () => {
        try {
            setLoading(true);
            const params = {};
            if (filterStatus) params.status = filterStatus;
            if (filterClub) params.clubId = filterClub;
            
            const response = await axiosClient.get('/admin/contracts', { params });
            setContracts(response.data.data.contracts);
        } catch (err) {
            console.error('Load contracts error:', err);
            setError(err.response?.data?.error || 'Failed to load contracts');
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
        setEditingContract(null);
        // Default end date to 1 year from start
        const startDate = new Date();
        const endDate = new Date();
        endDate.setFullYear(endDate.getFullYear() + 1);
        
        setFormData({
            player_id: '',
            club_id: '',
            start_date: startDate.toISOString().split('T')[0],
            end_date: endDate.toISOString().split('T')[0],
            salary: '',
        });
        setShowModal(true);
    };

    const handleEdit = (contract) => {
        setEditingContract(contract);
        setFormData({
            player_id: contract.player_id,
            club_id: contract.club_id,
            start_date: contract.start_date?.split('T')[0] || '',
            end_date: contract.end_date?.split('T')[0] || '',
            salary: contract.salary || '',
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingContract) {
                await axiosClient.put(`/admin/contracts/${editingContract.contract_id}`, formData);
            } else {
                await axiosClient.post('/admin/contracts', formData);
            }
            setShowModal(false);
            loadContracts();
        } catch (err) {
            console.error('Save contract error:', err);
            alert(err.response?.data?.error || 'Failed to save contract');
        }
    };

    const handleDelete = async (contractId) => {
        if (!window.confirm('Are you sure you want to delete this contract?')) return;
        
        try {
            await axiosClient.delete(`/admin/contracts/${contractId}`);
            loadContracts();
        } catch (err) {
            console.error('Delete contract error:', err);
            alert(err.response?.data?.error || 'Failed to delete contract');
        }
    };

    if (loading && contracts.length === 0) return <LoadingSpinner fullPage />;

    return (
        <div>
            <Navbar />
            <div className="admin-contracts">
                <div className="admin-header">
                    <h1 className="admin-title">Contract Management</h1>
                    <p className="admin-subtitle">Manage player contracts and track expirations</p>
                </div>

                <div className="admin-content">
                    {error && <ErrorBanner message={error} />}

                    <div className="toolbar">
                        <div className="search-filters">
                            <select
                                className="filter-select"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <option value="">All Status</option>
                                <option value="active">Active</option>
                                <option value="expired">Expired</option>
                                <option value="expiring">Expiring Soon</option>
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
                            ➕ Add Contract
                        </button>
                    </div>

                    <div className="data-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Player</th>
                                    <th>Club</th>
                                    <th>Start Date</th>
                                    <th>End Date</th>
                                    <th>Salary (€/week)</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {contracts.map(contract => (
                                    <tr key={contract.contract_id}>
                                        <td>{contract.contract_id}</td>
                                        <td className="player-name">
                                            {contract.player.first_name} {contract.player.last_name}
                                        </td>
                                        <td>{contract.club.name}</td>
                                        <td>{new Date(contract.start_date).toLocaleDateString()}</td>
                                        <td>{new Date(contract.end_date).toLocaleDateString()}</td>
                                        <td>
                                            {contract.salary 
                                                ? `€${Number(contract.salary).toLocaleString()}`
                                                : 'N/A'
                                            }
                                        </td>
                                        <td>
                                            <span className={`badge status-${contract.status}`}>
                                                {contract.status}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="action-btns">
                                                <button 
                                                    className="btn-edit"
                                                    onClick={() => handleEdit(contract)}
                                                    title="Edit"
                                                >
                                                    ✏️
                                                </button>
                                                <button 
                                                    className="btn-delete"
                                                    onClick={() => handleDelete(contract.contract_id)}
                                                    title="Delete"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {contracts.length === 0 && !loading && (
                        <div className="empty-state">
                            <p>No contracts found</p>
                        </div>
                    )}
                </div>

                {showModal && (
                    <Modal onClose={() => setShowModal(false)}>
                        <h2 className="modal-title">
                            {editingContract ? 'Edit Contract' : 'Add New Contract'}
                        </h2>
                        <form onSubmit={handleSubmit} className="contract-form">
                            <div className="form-group">
                                <label>Player *</label>
                                <select
                                    required
                                    value={formData.player_id}
                                    onChange={(e) => setFormData({...formData, player_id: e.target.value})}
                                >
                                    <option value="">Select Player</option>
                                    {players.map(player => (
                                        <option key={player.player_id} value={player.player_id}>
                                            {player.first_name} {player.last_name} - {player.position}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            
                            <div className="form-group">
                                <label>Club *</label>
                                <select
                                    required
                                    value={formData.club_id}
                                    onChange={(e) => setFormData({...formData, club_id: e.target.value})}
                                >
                                    <option value="">Select Club</option>
                                    {clubs.map(club => (
                                        <option key={club.club_id} value={club.club_id}>
                                            {club.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Start Date *</label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.start_date}
                                        onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>End Date *</label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.end_date}
                                        onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Weekly Salary (€)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={formData.salary}
                                    onChange={(e) => setFormData({...formData, salary: e.target.value})}
                                    placeholder="Optional"
                                />
                            </div>

                            <div className="form-actions">
                                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="btn-submit">
                                    {editingContract ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </Modal>
                )}
            </div>
        </div>
    );
}
