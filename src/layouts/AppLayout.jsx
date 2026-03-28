import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { useLocation } from 'react-router-dom';

const pageTitles = {
  '/': 'Dashboard',
  '/influencers': 'Influencers',
  '/sponsors': 'Sponsors',
  '/vendors': 'Vendors',
};

const AppLayout = ({ children }) => {
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'Gold Glam';

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-area">
        <Header title={title} />
        <main className="main-content">{children}</main>
      </div>
    </div>
  );
};

export default AppLayout;
