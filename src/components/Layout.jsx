import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaBars, FaTimes, FaMoon, FaSun,
  FaChartBar, FaPlusCircle, FaList, FaFileAlt, FaUsersCog, FaSignOutAlt
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useTheme } from "./ThemeContext";
import "./Layout.css";

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const roles = user?.roles || [];

  const isAdmin = roles.includes("ROLE_ADMIN");
  const isAgent = roles.includes("ROLE_AgentBancaire");

  // 🔓 Fonction logout
  const handleLogout = () => {
    localStorage.clear(); // ou localStorage.removeItem('user') si tu veux juste l'utilisateur
    navigate("/signin");
  };

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
        initial={{ x: -260 }}
        animate={{ x: isSidebarOpen ? 0 : -260 }}
        transition={{ duration: 0.4 }}
      >
        <h3 className="sidebar-title">BackOffice</h3>
        <ul>
          <li><Link to="/dashboard"><FaChartBar className="icon" /> Dashboard</Link></li>

          {isAdmin && (
            <>
              <li><Link to="/create-enquete"><FaPlusCircle className="icon" /> Créer Enquête</Link></li>
              <li><Link to="/utilisateurs"><FaUsersCog className="icon" /> Utilisateurs</Link></li>
              <li><Link to="/enquetes"><FaList className="icon" /> Liste Enquêtes</Link></li>
            </>
          )}

          {(isAdmin || isAgent) && (
            <li><Link to="/reclamations"><FaFileAlt className="icon" /> Réclamations</Link></li>
          )}

          {/* 🔓 Bouton Déconnexion */}
          <li onClick={handleLogout} style={{ cursor: "pointer", color: "red" }}>
            <FaSignOutAlt className="icon" /> Se déconnecter
          </li>
        </ul>
      </motion.aside>

      <main className="main-content">{children}</main>
    </div>
  );
};

export default Layout;
