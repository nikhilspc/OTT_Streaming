import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('access');

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="brand">OTT Platform</Link>
      <div className="nav-links">
        <Link to="/">Browse</Link>
        <Link to="/subscribe">Subscribe</Link>
        {isLoggedIn ? (
          <>
            <Link to="/admin">Admin Panel</Link>
            <button className="nav-btn" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" className="nav-cta">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}