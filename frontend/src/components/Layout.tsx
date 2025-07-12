import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";

function Layout() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [active, setActive] = useState("");

  useEffect(() => {
    setActive(location.pathname);
  }, [location.pathname]);

  const handleLogout = () => {
    logout(); // this clears the token from context
    setTimeout(() => {
      navigate("/"); // wait until next tick before navigating
    }, 0);
  };
  

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light px-4">
      {/* Show Home or LandingPage based on token */}
      <Link className="navbar-brand" to={token ? "/Home" : "/"}>
        Products
      </Link>

      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav me-auto">
          {token && (
            <li className="nav-item px-2">
              <Link
                className={`nav-link ${active === "/Home" ? "active" : ""}`}
                to="/Home"
              >
                Home
              </Link>
            </li>
          )}
          {token && (
            <li className="nav-item px-2">
              <Link
                className={`nav-link ${
                  active === "/AddProduct" ? "active" : ""
                }`}
                to="/AddProduct"
              >
                Product
              </Link>
            </li>
          )}
          {token && (
            <li className="nav-item px-2">
              <Link
                className={`nav-link ${active === "/AboutUs" ? "active" : ""}`}
                to="/AboutUs"
              >
                About Us
              </Link>
            </li>
          )}
        </ul>

        <ul className="navbar-nav ms-auto">
          {!token ? (
            <>
              <li className="nav-item px-2">
                <Link
                  className={`nav-link ${active === "/login" ? "active" : ""}`}
                  to="/login"
                >
                  Login
                </Link>
              </li>
              <li className="nav-item px-2">
                <Link
                  className={`nav-link ${
                    active === "/register" ? "active" : ""
                  }`}
                  to="/register"
                >
                  Register
                </Link>
              </li>
            </>
          ) : (
            <li className="nav-item px-2">
              <button className="btn btn-outline-danger" onClick={handleLogout}>
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