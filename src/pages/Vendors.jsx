import { useEffect, useState } from 'react';
import { getCollection } from '../firebase/firestore';
import { Store, Search, RefreshCw } from 'lucide-react';

const Vendors = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getCollection('vendors');
      setVendors(data);
    } catch (err) {
      setError('Failed to load vendors. Check your Firebase config.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const filtered = vendors.filter((item) =>
    (item.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (item.service || item.product || '').toLowerCase().includes(search.toLowerCase()) ||
    (item.location || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h2 className="page-title">Vendors</h2>
          <p className="page-subtitle">{vendors.length} total vendors</p>
        </div>
        <div className="header-controls">
          <div className="search-box">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search by name, service, or location..."
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
          <p>Loading vendors...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <Store size={48} />
          <h3>{search ? 'No results found' : 'No vendors yet'}</h3>
          <p>{search ? 'Try a different search term.' : 'Add vendor records to the Firestore "vendors" collection.'}</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Vendor Name</th>
                <th>Product / Service</th>
                <th>Location</th>
                <th>Contact</th>
                <th>Email</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, index) => (
                <tr key={item.id}>
                  <td className="row-num">{index + 1}</td>
                  <td className="name-cell">
                    <div className="avatar-chip green">{(item.name || 'V')[0]}</div>
                    {item.name || '—'}
                  </td>
                  <td><span className="badge badge-green">{item.service || item.product || '—'}</span></td>
                  <td>{item.location || '—'}</td>
                  <td>{item.contact || item.phone || '—'}</td>
                  <td>{item.email || '—'}</td>
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

export default Vendors;
