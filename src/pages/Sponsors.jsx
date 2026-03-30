import { useEffect, useState } from 'react';
import { getCollection } from '../firebase/firestore';
import { Handshake, Search, RefreshCw } from 'lucide-react';

const Sponsors = () => {
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getCollection('sponsors');
      setSponsors(data);
    } catch (err) {
      setError('Failed to load sponsors. Check your Firebase config.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const filtered = sponsors.filter((item) =>
    (item.company_name || '').toLowerCase().includes(search.toLowerCase()) ||
    (item.industry || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h2 className="page-title">Sponsors</h2>
          <p className="page-subtitle">{sponsors.length} total sponsors</p>
        </div>
        <div className="header-controls">
          <div className="search-box">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search by company or industry..."
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
          <p>Loading sponsors...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <Handshake size={48} />
          <h3>{search ? 'No results found' : 'No sponsors yet'}</h3>
          <p>{search ? 'Try a different search term.' : 'Add sponsor records to the Firestore "sponsors" collection.'}</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Company</th>
                <th>Industry</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Contact Person</th>
                <th>Email</th>
                <th>Phone</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, index) => (
                <tr key={item.id}>
                  <td className="row-num">{index + 1}</td>
                  <td className="name-cell">
                    <div className="avatar-chip purple">{(item.company_name || 'C')[0]?.toUpperCase()}</div>
                    {item.company_name || '—'}
                  </td>
                  <td><span className="badge badge-purple">{item.industry || '—'}</span></td>
                  <td>{item.sponsorship_type || '—'}</td>
                  <td>{item.amount ? `₹${Number(item.amount).toLocaleString()}` : '—'}</td>
                  <td>{item.contact_person || '—'}</td>
                  <td>{item.email || '—'}</td>
                  <td>{item.phone || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Sponsors;
