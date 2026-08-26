import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('access');
  const username = localStorage.getItem('username');
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.clear();
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
            <span>Hi, {username}</span>
            {(role === 'admin' || role === 'subadmin') && (
              <Link to="/admin">Admin Panel</Link>
            )}
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}