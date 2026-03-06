import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useToast } from '../../context/ToastContext';
import Modal from '../../components/Modal';
import Button from '../../components/Button';
import axiosClient from '../../api/axiosClient';
import './AdminPlayers.css';

export default function AdminAgents() {
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const toast = useToast();
    const [showModal, setShowModal] = useState(false);
    const [editingAgent, setEditingAgent] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [formData, setFormData] = useState({
        agent_name: '',
    });
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadAgents();
    }, [searchTerm]);

    const loadAgents = async () => {
        try {
            setLoading(true);
            const params = {};
            if (searchTerm) params.search = searchTerm;

            const response = await axiosClient.get('/admin/agents', { params });
            setAgents(response.data.data.agents);
        } catch (err) {
            console.error('Load agents error:', err);
            const msg = err.response?.data?.error || 'Failed to load agents';
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setEditingAgent(null);
        setFormData({
            agent_name: '',
        });
        setShowModal(true);
    };

    const handleEdit = (agent) => {
        setEditingAgent(agent);
        setFormData({
            agent_name: agent.agent_name,
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            if (editingAgent) {
                await axiosClient.put(`/admin/agents/${editingAgent.agent_id}`, formData);
                toast.success('Agent updated successfully');
            } else {
                await axiosClient.post('/admin/agents', formData);
                toast.success('Agent added successfully');
            }
            setShowModal(false);
            loadAgents();
        } catch (err) {
            console.error('Save agent error:', err);
            const msg = err.response?.data?.error || 'Failed to save agent';
            setError(msg);
            toast.error(msg);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (agentId) => {
        if (!window.confirm('Are you sure you want to delete this agent?')) return;

        try {
            setDeletingId(agentId);
            await axiosClient.delete(`/admin/agents/${agentId}`);
            toast.success('Agent deleted');
            loadAgents();
        } catch (err) {
            console.error('Delete agent error:', err);
            const msg = err.response?.data?.error || 'Failed to delete agent';
            setError(msg);
            toast.error(msg);
        } finally {
            setDeletingId(null);
        }
    };

    if (loading && agents.length === 0) return <LoadingSpinner fullPage />;

    return (
        <div>
            <Navbar />
            <div className="admin-agents">
                <div className="admin-header">
                    <h1 className="admin-title">Agent Management</h1>
                    <p className="admin-subtitle">Manage agents and player representations</p>
                </div>

                <div className="admin-content">
                    {error && (
                        <div style={{ padding: '20px', textAlign: 'center' }}><p>{error}</p></div>
                    )}

                    <div className="toolbar">
                        <div className="search-filters">
                            <input
                                type="text"
                                placeholder="Search agents..."
                                className="search-input"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button className="add-btn" onClick={handleAdd}>
                            ➕ Add Agent
                        </button>
                    </div>

                    <div className="data-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Agent Name</th>
                                    <th>Players Represented</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {agents.map(agent => (
                                    <tr key={agent.agent_id}>
                                        <td>{agent.agent_id}</td>
                                        <td className="player-name">{agent.agent_name}</td>
                                        <td>{agent._count?.players || 0}</td>
                                        <td>
                                            <div className="action-btns">
                                                <button
                                                    className="btn-edit"
                                                    onClick={() => handleEdit(agent)}
                                                    disabled={deletingId !== null}
                                                    title="Edit"
                                                >
                                                    ✏️
                                                </button>
                                                <button
                                                    className="btn-delete"
                                                    onClick={() => handleDelete(agent.agent_id)}
                                                    disabled={deletingId === agent.agent_id}
                                                    title="Delete"
                                                >
                                                    {deletingId === agent.agent_id ? '⏳' : '🗑️'}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {agents.length === 0 && !loading && (
                        <div className="empty-state">
                            <p>No agents found</p>
                        </div>
                    )}
                </div>

                {showModal && (
                    <Modal onClose={() => setShowModal(false)}>
                        <h2 className="modal-title">
                            {editingAgent ? 'Edit Agent' : 'Add New Agent'}
                        </h2>
                        <form onSubmit={handleSubmit} className="agent-form">
                            <div className="form-group">
                                <label>Agent Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.agent_name}
                                    onChange={(e) => setFormData({ ...formData, agent_name: e.target.value })}
                                    placeholder="Enter agent name"
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
                                    {editingAgent ? 'Update Agent' : 'Add Agent'}
                                </Button>
                            </div>
                        </form>
                    </Modal>
                )}
            </div>
        </div>
    );
}
