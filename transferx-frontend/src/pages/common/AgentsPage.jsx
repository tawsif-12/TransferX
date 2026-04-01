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
                                const marketValue = agent.market_value_managed || 0;
                                const formattedValue = marketValue ? `$${(marketValue / 1000000).toFixed(1)}M` : 'N/A';

                                return (
                                    <div key={agent.agent_id} className="agent-card">
                                        <div className="agent-card-header">
                                            <div className="agent-avatar">👤</div>
                                            <div className="agent-info">
                                                <h3 className="agent-name">{agent.agent_name}</h3>
                                                <p className="agent-title">Football Agent</p>
                                            </div>
                                        </div>

                                        <div className="agent-details">
                                            <div className="contact-item">
                                                <div>
                                                    <div className="label">Age</div>
                                                    <div className="value">{agent.age || 'N/A'}</div>
                                                </div>
                                            </div>
                                            <div className="contact-item">
                                                <div>
                                                    <div className="label">Experience</div>
                                                    <div className="value">{agent.experience_years || 0} years</div>
                                                </div>
                                            </div>
                                            <div className="contact-item">
                                                <div>
                                                    <div className="label">Market Value Managed</div>
                                                    <div className="value">{formattedValue}</div>
                                                </div>
                                            </div>
                                            <div className="contact-item">
                                                <div>
                                                    <div className="label">Email</div>
                                                    <div className="value">{agent.contact_info || 'N/A'}</div>
                                                </div>
                                            </div>
                                            <div className="contact-item">
                                                <div>
                                                    <div className="label">Clients</div>
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
