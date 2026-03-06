import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useToast } from '../../context/ToastContext';
import axiosClient from '../../api/axiosClient';
import './AgentsPage.css';

export default function AgentsPage() {
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const toast = useToast();

    useEffect(() => {
        loadAgents();
    }, []);

    const loadAgents = async () => {
        try {
            setLoading(true);
            const response = await axiosClient.get('/agents');
            setAgents(response.data.data || []);
        } catch (err) {
            console.error('Agents error:', err);
            const msg = err.response?.data?.error || 'Failed to load agents.';
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
            <div className="agents-page">
                <div className="page-header">
                    <h1 className="page-title">Agents</h1>
                    <p className="page-subtitle">Football agents in Bangladesh</p>
                </div>

                {error ? (
                    <div style={{ padding: '40px', textAlign: 'center' }}>
                        <p>{error}</p>
                    </div>
                ) : (
                    <div className="page-content">
                        <div className="agents-grid">
                            {agents.map((agent) => {
                                const playerCount = agent.players?.length || agent.player_count || 0;

                                return (
                                    <div key={agent.agent_id} className="agent-card">
                                        <div className="agent-card-header">
                                            <div className="agent-avatar">👤</div>
                                            <div className="agent-info">
                                                <h3 className="agent-name">{agent.first_name} {agent.last_name}</h3>
                                                <p className="agent-title">Football Agent</p>
                                            </div>
                                        </div>

                                        <div className="agent-details">
                                            <div className="contact-item">
                                                <span className="icon">📧</span>
                                                <div>
                                                    <div className="label">Email</div>
                                                    <div className="value">{agent.email || 'N/A'}</div>
                                                </div>
                                            </div>
                                            <div className="contact-item">
                                                <span className="icon">📱</span>
                                                <div>
                                                    <div className="label">Phone</div>
                                                    <div className="value">{agent.phone || 'N/A'}</div>
                                                </div>
                                            </div>
                                            <div className="contact-item">
                                                <span className="icon">👥</span>
                                                <div>
                                                    <div className="label">Represented Players</div>
                                                    <div className="value">
                                                        {playerCount} Player{playerCount !== 1 ? 's' : ''}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <button className="agent-card-btn">Contact Agent</button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
