import { useEffect, useState } from 'react';
import { Users, Handshake, Store, TrendingUp } from 'lucide-react';
import { getCollection } from '../firebase/firestore';

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="stat-card" style={{ '--accent': color }}>
    <div className="stat-icon">
      <Icon size={24} />
    </div>
    <div className="stat-info">
      <span className="stat-value">{value}</span>
      <span className="stat-label">{label}</span>
    </div>
    <div className="stat-glow" />
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({ influencers: 0, sponsors: 0, vendors: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const fetchCount = async (collectionName) => {
          try {
            const data = await getCollection(collectionName);
            return data.length;
          } catch (e) {
            console.warn(`Could not fetch ${collectionName}:`, e.message);
            return 0;
          }
        };

        const influencersCount = await fetchCount('influencers');
        const sponsorsCount = await fetchCount('sponsors');
        const vendorsCount = await fetchCount('vendors');

        setStats({
          influencers: influencersCount,
          sponsors: sponsorsCount,
          vendors: vendorsCount,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { icon: Users, label: 'Influencers', value: loading ? '—' : stats.influencers, color: '#c9a84c' },
    { icon: Handshake, label: 'Sponsors', value: loading ? '—' : stats.sponsors, color: '#7c6fcd' },
    { icon: Store, label: 'Vendors', value: loading ? '—' : stats.vendors, color: '#4caf8e' },
    {
      icon: TrendingUp,
      label: 'Total Partners',
      value: loading ? '—' : stats.influencers + stats.sponsors + stats.vendors,
      color: '#e67e4a',
    },
  ];

  return (
    <div className="page-content">
      <div className="page-header">
        <h2 className="page-title">Welcome back 👋</h2>
        <p className="page-subtitle">Here's what's happening with Gold Glam today.</p>
      </div>

      <div className="stats-grid">
        {cards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>

      <div className="dashboard-bottom">
        <div className="info-card">
          <h3>Quick Overview</h3>
          <p>Use the sidebar to navigate to Influencers, Sponsors, or Vendors sections to view and manage listings.</p>
          <div className="divider" />
          <ul className="quick-list">
            <li><Users size={14} /> Influencers — manage your brand ambassadors</li>
            <li><Handshake size={14} /> Sponsors — track corporate partnerships</li>
            <li><Store size={14} /> Vendors — oversee supplier & vendor network</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
