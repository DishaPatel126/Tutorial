import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Layout() {
  const { token, logout } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light px-4">
      <Link className="navbar-brand" to="/Home">Navbar</Link>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav me-auto">
          <li className="nav-item px-2"><Link className="nav-link" to="/Home">Home</Link></li>
          {token && (
            <li className="nav-item px-2"><Link className="nav-link" to="/AddProduct">Product</Link></li>
          )}
          <li className="nav-item px-2"><Link className="nav-link" to="/AboutUs">About Us</Link></li>
        </ul>
        <ul className="navbar-nav ms-auto">
          {!token ? (
            <>
              <li className="nav-item px-2"><Link className="nav-link" to="/login">Login</Link></li>
              <li className="nav-item px-2"><Link className="nav-link" to="/register">Register</Link></li>
            </>
          ) : (
            <li className="nav-item px-2"><button className="btn btn-outline-danger" onClick={logout}>Logout</button></li>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Layout;
