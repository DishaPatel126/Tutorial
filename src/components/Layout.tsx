import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Layout() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light px-4">
      <Link className="navbar-brand" to="/Home" style={{ marginRight: '2rem', fontWeight: 'bold' }}>
        Navbar
      </Link>

      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav">
          <li className="nav-item px-2">
            <Link className="nav-link" to="/Home">Home</Link>
          </li>
          <li className="nav-item px-2">
            <Link className="nav-link" to="/AddProduct">Product</Link>
          </li>
          <li className="nav-item px-2">
            <Link className="nav-link" to="/AboutUs">About Us</Link>
          </li>
          <li className="nav-item px-2">
            <Link className="nav-link" to="/prods">Dashboard</Link>
          </li>
          {!token && (
            <>
              <li className="nav-item px-2">
                <Link className="nav-link" to="/login">Login</Link>
              </li>
              <li className="nav-item px-2">
                <Link className="nav-link" to="/register">Register</Link>
              </li>
            </>
          )}
          {token && (
            <li className="nav-item px-2">
              <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
                Logout
              </button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Layout;