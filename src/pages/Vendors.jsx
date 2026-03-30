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
    (item.vendor_name || '').toLowerCase().includes(search.toLowerCase()) ||
    (item.business_name || '').toLowerCase().includes(search.toLowerCase()) ||
    (item.service_type || '').toLowerCase().includes(search.toLowerCase())
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
              placeholder="Search by vendor, business, or service..."
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
                <th>Business Name</th>
                <th>Service Type</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Instagram</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, index) => (
                <tr key={item.id}>
                  <td className="row-num">{index + 1}</td>
                  <td className="name-cell">
                    <div className="avatar-chip green">{(item.vendor_name || 'V')[0]?.toUpperCase()}</div>
                    {item.vendor_name || '—'}
                  </td>
                  <td>{item.business_name || '—'}</td>
                  <td><span className="badge badge-green">{item.service_type || '—'}</span></td>
                  <td>{item.phone || '—'}</td>
                  <td>{item.email || '—'}</td>
                  <td>{item.instagram_page || '—'}</td>
                  <td>{item.amount ? `₹${Number(item.amount).toLocaleString()}` : '—'}</td>
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
