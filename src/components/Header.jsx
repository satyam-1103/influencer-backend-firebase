import { useAuth } from '../context/AuthContext';
import { LogOut, Bell } from 'lucide-react';

const Header = ({ title }) => {
  const { currentUser, logout } = useAuth();

  const initials = currentUser?.email
    ? currentUser.email.slice(0, 2).toUpperCase()
    : 'GG';

  return (
    <header className="header">
      <h1 className="header-title">{title}</h1>
      <div className="header-actions">
        <button className="icon-btn" title="Notifications">
          <Bell size={20} />
        </button>
        <div className="user-badge">{initials}</div>
        <button className="logout-btn" onClick={logout} title="Logout">
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
