import { useEffect, useState } from 'react';
import { getCollection } from '../firebase/firestore';
import { Users, Search, RefreshCw, Download } from 'lucide-react';
import { exportToCsv } from '../utils/exportCsv';

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
      console.log(data)
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

  const handleExport = () => {
    const headers = [
      { label: 'Name', key: 'full_name' },
      { label: 'Category', key: 'award_category' },
      { label: 'Followers Range', key: 'follower_range' },
      { label: 'Platform', key: 'platform' },
      { label: 'Email', key: 'email' },
      { label: 'Contact', key: 'phone' },
      { label: 'Niche', key: 'niche' },
      { label: 'Social Link', key: 'profile_link' },
      { label: 'Fee Consent', key: 'fee_consent' },
      { label: 'Referred By Sponsor', key: 'is_referred' },
      { label: 'Referral Code', key: 'referral_code' },
      { label: 'Why Win', key: 'why_win' },
      { label: 'Status', key: 'status' }
    ];
    exportToCsv('Influencers', filtered, headers);
  };

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
          <button className="btn-icon" onClick={handleExport} title="Export CSV">
            <Download size={16} />
          </button>
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
                <th>Email</th>
                <th>Contact</th>
                <th>Niche</th>
                <th>Social Link</th>
                <th>Fee Consent</th>
                <th>Referred By Sponsor</th>
                <th>Referal Code</th>
                <th>Why Win</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, index) => (
                <tr key={item.id}>
                  <td className="row-num">{index + 1}</td>
                  <td className="name-cell">
                    <div className="avatar-chip">{(item.name || 'N')[0]}</div>
                    {item.full_name || '—'}
                  </td>
                  <td><span className="badge badge-gold">{item.award_category || '—'}</span></td>
                  <td>{item.follower_range ? item.follower_range : '—'}</td>
                  <td>{item.platform || '—'}</td>
                  <td>{item.email || '—'}</td>
                  <td>{item.phone || '—'}</td>
                  <td>{item.niche || '—'}</td>
                  <td>{item.profile_link || '—'}</td>
                  <td>{item.fee_consent || 'No'}</td>
                  <td>{item.is_referred ? 'Yes' : 'No'}</td>
                  <td>{item.referral_code || '—'}</td>
                  <td>{item.why_win || '—'}</td>
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
