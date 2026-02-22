import React from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const menuWrapRef = React.useRef(null);
  const toggleBtnRef = React.useRef(null);

  React.useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  React.useEffect(() => {
    if (!menuOpen) return undefined;

    const onPointerDown = (event) => {
      const menuEl = menuWrapRef.current;
      const toggleEl = toggleBtnRef.current;
      const target = event.target;
      if (!menuEl || !toggleEl) return;
      if (menuEl.contains(target) || toggleEl.contains(target)) return;
      setMenuOpen(false);
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('touchstart', onPointerDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('touchstart', onPointerDown);
    };
  }, [menuOpen]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="topbar">
      <div className="container topbar-inner">
        <div className="brand-wrap">
          <Link to="/home" className="brand">
            PrepSphere
          </Link>
          <p className="brand-tagline">Practice smart. Interview better.</p>
        </div>
        <div className="topbar-actions">
          {isAuthenticated ? <span className="user-chip">{user.name}</span> : null}
          <button className="theme-toggle" type="button" onClick={toggleTheme} aria-label="Toggle theme">
            {isDark ? 'Light' : 'Dark'}
          </button>
          <button
            ref={toggleBtnRef}
            className={`menu-toggle ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Open menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      <div ref={menuWrapRef} className={`container menu-panel-wrap ${menuOpen ? 'open' : ''}`}>
        <nav className="menu-panel">
          {isAuthenticated ? (
            <>
              <NavLink to="/dashboard">Dashboard</NavLink>
              <NavLink to="/questions">Questions</NavLink>
              <NavLink to="/mock-test">Mock Test</NavLink>
              <NavLink to="/performance">Performance</NavLink>
              <NavLink to="/profile">Profile</NavLink>
              <NavLink to="/history">History</NavLink>
              <button className="btn btn-outline menu-logout" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/home">Home</NavLink>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/register">Register</NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
