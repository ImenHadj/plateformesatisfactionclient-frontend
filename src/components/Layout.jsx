import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes, FaMoon, FaSun, FaTachometerAlt, FaTable, FaCreditCard, FaCog } from "react-icons/fa";
import { motion } from "framer-motion";
import { useTheme } from "./ThemeContext";
import "./Layout.css";

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { darkMode, toggleTheme } = useTheme();

  return (
    <div className="dashboard">
      <button className="burger-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
        {isSidebarOpen ? <FaTimes /> : <FaBars />}
      </button>
      <button className="theme-toggle" onClick={toggleTheme}>
        {darkMode ? <FaSun /> : <FaMoon />}
      </button>

      <motion.aside
        className="sidebar-modern"
        initial={{ x: -300 }}
        animate={{ x: isSidebarOpen ? 0 : -300 }}
        transition={{ duration: 0.4 }}
      >
        <h3 className="sidebar-title">Creative Dashboard</h3>
        <ul>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/tables">Tables</Link></li>
          <li><Link to="/billing">Billing</Link></li>
          <li><Link to="/settings">Settings</Link></li>
        </ul>
      </motion.aside>

      <main className="main-content" style={{ marginLeft: isSidebarOpen ? 260 : 0 }}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
