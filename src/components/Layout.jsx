import React from "react";
import { Link } from "react-router-dom";
import { FaTachometerAlt, FaTable, FaCreditCard, FaCog } from "react-icons/fa";
import { motion } from "framer-motion";
import "./Layout.css"; // Fichier CSS pour le style du layout (à créer)

const Layout = ({ children }) => {
  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <img src="https://via.placeholder.com/50" alt="Logo" className="logo" />
          <h3>Creative Dashboard</h3>
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li>
              <Link to="/dashboard" className="nav-link">
                <FaTachometerAlt /> Dashboard
              </Link>
            </li>
            <li>
              <Link to="/tables" className="nav-link">
                <FaTable /> Tables
              </Link>
            </li>
            <li>
              <Link to="/billing" className="nav-link">
                <FaCreditCard /> Billing
              </Link>
            </li>
            <li>
              <Link to="/settings" className="nav-link">
                <FaCog /> Settings
              </Link>
            </li>
          </ul>
        </nav>
        <div className="sidebar-footer">
          <Link to="/logout" className="btn-logout">Logout</Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <nav className="navbar">
          <div className="navbar-container">
            {/* Search bar */}
            <input type="text" className="search-box" placeholder="Search..." />
            <div className="navbar-icons">
              <i className="fas fa-bell"></i>
              <i className="fas fa-user-circle"></i>
            </div>
          </div>
        </nav>

        {/* Content of the page (dynamic based on route) */}
        <section className="dashboard-content">
          {children}
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <p>&copy; 2024 Your Company</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
