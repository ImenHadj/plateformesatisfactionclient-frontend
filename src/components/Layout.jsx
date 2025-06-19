import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaBars, FaTimes, FaMoon, FaSun,
  FaChartBar, FaPlusCircle, FaList, FaFileAlt, FaUsersCog, FaSignOutAlt
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "./ThemeContext";
import "./Layout.css";

const menuItems = (isAdmin, isAgent) => [
  {
    to: "/dashboard",
    icon: <FaChartBar className="icon" />,
    label: "Dashboard",
    roles: ["ALL"],
  },
  ...(isAdmin ? [
    {
      to: "/create-enquete",
      icon: <FaPlusCircle className="icon" />,
      label: "Créer Enquête",
      roles: ["ROLE_ADMIN"],
    },
    {
      to: "/utilisateurs",
      icon: <FaUsersCog className="icon" />,
      label: "Utilisateurs",
      roles: ["ROLE_ADMIN"],
    },
    {
      to: "/enquetes",
      icon: <FaList className="icon" />,
      label: "Liste Enquêtes",
      roles: ["ROLE_ADMIN"],
    },
  ] : []),
  ...((isAdmin || isAgent) ? [{
    to: "/reclamations",
    icon: <FaFileAlt className="icon" />,
    label: "Réclamations",
    roles: ["ROLE_ADMIN", "ROLE_AgentBancaire"],
  }] : []),
];

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const roles = user?.roles || [];

  const isAdmin = roles.includes("ROLE_ADMIN");
  const isAgent = roles.includes("ROLE_AgentBancaire");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/signin");
  };

  // Variants framer-motion pour la liste (container + items)
  const sidebarVariants = {
    open: {
      x: 0,
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.2,
        when: "beforeChildren",
      },
    },
    closed: {
      x: -280,
      opacity: 0,
      transition: {
        when: "afterChildren",
      },
    },
  };

  const itemVariants = {
    open: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
    closed: {
      opacity: 0,
      x: -20,
      transition: { duration: 0.2 },
    },
  };

  return (
    <div className={`dashboard ${darkMode ? "dark-mode" : "light-mode"}`}>
      <button
        className="burger-btn"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        aria-label={isSidebarOpen ? "Fermer le menu" : "Ouvrir le menu"}
      >
        {isSidebarOpen ? <FaTimes /> : <FaBars />}
      </button>

      <button
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label={darkMode ? "Passer au mode clair" : "Passer au mode sombre"}
      >
        {darkMode ? <FaSun /> : <FaMoon />}
      </button>

      <motion.aside
        className="sidebar-modern"
        initial="closed"
        animate={isSidebarOpen ? "open" : "closed"}
        variants={sidebarVariants}
        aria-hidden={!isSidebarOpen}
      >
        <h3 className="sidebar-title">BackOffice</h3>
        <motion.ul>
          {menuItems(isAdmin, isAgent).map(({ to, icon, label }, index) => (
            <motion.li
              key={label}
              variants={itemVariants}
              tabIndex={isSidebarOpen ? 0 : -1}
            >
              <Link to={to} tabIndex={isSidebarOpen ? 0 : -1}>
                {icon}
                {label}
              </Link>
            </motion.li>
          ))}

          <motion.li
            onClick={handleLogout}
            style={{ cursor: "pointer", color: "#ff5c5c" }}
            tabIndex={isSidebarOpen ? 0 : -1}
            role="button"
            aria-label="Se déconnecter"
            variants={itemVariants}
          >
            <FaSignOutAlt className="icon logout-icon" />
            Se déconnecter
          </motion.li>
        </motion.ul>
      </motion.aside>

      <main className={`main-content ${isSidebarOpen ? "sidebar-open" : ""}`}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
