import { useEffect, useState } from 'react';
import { getCollection } from '../firebase/firestore';
import { Users, Search, RefreshCw } from 'lucide-react';

const Influencers = () => {
  const [influencers, setInfluencers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getCollection('influencers');
      setInfluencers(data);
    } catch (err) {
      setError('Failed to load influencers. Check your Firebase config.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const filtered = influencers.filter((item) =>
    (item.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (item.category || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h2 className="page-title">Influencers</h2>
          <p className="page-subtitle">{influencers.length} total influencers</p>
        </div>
        <div className="header-controls">
          <div className="search-box">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search by name or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="btn-icon" onClick={fetchData} title="Refresh">
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {loading ? (
        <div className="loading-state">
          <div className="spinner large" />
          <p>Loading influencers...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <Users size={48} />
          <h3>{search ? 'No results found' : 'No influencers yet'}</h3>
          <p>{search ? 'Try a different search term.' : 'Add influencer records to the Firestore "influencers" collection.'}</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Category</th>
                <th>Followers</th>
                <th>Platform</th>
                <th>Contact</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, index) => (
                <tr key={item.id}>
                  <td className="row-num">{index + 1}</td>
                  <td className="name-cell">
                    <div className="avatar-chip">{(item.name || 'N')[0]}</div>
                    {item.name || '—'}
                  </td>
                  <td><span className="badge badge-gold">{item.category || '—'}</span></td>
                  <td>{item.followers ? Number(item.followers).toLocaleString() : '—'}</td>
                  <td>{item.platform || '—'}</td>
                  <td>{item.contact || item.email || '—'}</td>
                  <td>
                    <span className={`status-dot ${item.status === 'inactive' ? 'inactive' : 'active'}`}>
                      {item.status || 'Active'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Influencers;
