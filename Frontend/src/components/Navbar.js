import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const nav = useNavigate();
  const token = localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("token");
    nav("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">

        {/* Logo */}
        <Link to="/" className="navbar-logo">
          Akansha❤️
        </Link>

        {/* Navigation */}
        <div className="navbar-links">
          {token ? (
            <>
              <Link to="/" className="nav-link">
                🏠 <span>Home</span>
              </Link>

              <Link to="/search" className="nav-link">
                🔍 <span>Search</span>
              </Link>

              <Link to="/create" className="nav-link">
                ➕ <span>Create</span>
              </Link>

              <Link to="/profile" className="nav-link">
                👤 <span>Profile</span>
              </Link>

              <button onClick={logout} className="logout-btn">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                Login
              </Link>

              <Link to="/register" className="register-btn">
                Register
              </Link>
            </>
          )}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;