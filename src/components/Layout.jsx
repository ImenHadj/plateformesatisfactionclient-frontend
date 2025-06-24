import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  FaBars, FaTimes, FaMoon, FaSun,
  FaChartBar, FaPlusCircle, FaList, 
  FaFileAlt, FaUsersCog, FaSignOutAlt,
  FaChevronRight
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
      label: "Create Survey",
      roles: ["ROLE_ADMIN"],
    },
    {
      to: "/utilisateurs",
      icon: <FaUsersCog className="icon" />,
      label: "User Management",
      roles: ["ROLE_ADMIN"],
    },
    {
      to: "/enquetes",
      icon: <FaList className="icon" />,
      label: "Survey List",
      roles: ["ROLE_ADMIN"],
    },
  ] : []),
  ...((isAdmin || isAgent) ? [{
    to: "/reclamations",
    icon: <FaFileAlt className="icon" />,
    label: "Claims",
    roles: ["ROLE_ADMIN", "ROLE_AgentBancaire"],
  }] : []),
];

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activePath, setActivePath] = useState("");
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setActivePath(location.pathname);
  }, [location]);

  const user = JSON.parse(localStorage.getItem("user"));
  const roles = user?.roles || [];

  const isAdmin = roles.includes("ROLE_ADMIN");
  const isAgent = roles.includes("ROLE_AgentBancaire");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/signin");
  };

  // Variants framer-motion améliorés
  const sidebarVariants = {
    open: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300,
        staggerChildren: 0.1,
        delayChildren: 0.15,
      },
    },
    closed: {
      x: -320,
      opacity: 0,
      transition: {
        type: "spring",
        damping: 30,
        stiffness: 300,
        staggerChildren: 0.05,
        staggerDirection: -1,
        when: "afterChildren",
      },
    },
  };

  const itemVariants = {
    open: {
      opacity: 1,
      x: 0,
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 20 
      },
    },
    closed: {
      opacity: 0,
      x: -40,
      transition: { duration: 0.2 },
    },
  };

  return (
    <div className={`dashboard ${darkMode ? "dark-mode" : "light-mode"}`}>
      <motion.button
        className="burger-btn"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        aria-label={isSidebarOpen ? "Close menu" : "Open menu"}
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <AnimatePresence mode="wait">
          {isSidebarOpen ? (
            <motion.span
              key="close"
              initial={{ rotate: 0 }}
              animate={{ rotate: 180 }}
              exit={{ rotate: 0 }}
              transition={{ duration: 0.3 }}
            >
              <FaTimes />
            </motion.span>
          ) : (
            <motion.span
              key="open"
              initial={{ rotate: 180 }}
              animate={{ rotate: 0 }}
              exit={{ rotate: 180 }}
              transition={{ duration: 0.3 }}
            >
              <FaBars />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      <motion.button
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <AnimatePresence mode="wait">
          {darkMode ? (
            <motion.span
              key="sun"
              initial={{ rotate: -30, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 30, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <FaSun />
            </motion.span>
          ) : (
            <motion.span
              key="moon"
              initial={{ rotate: 30, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -30, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <FaMoon />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      <motion.aside
        className="sidebar-elite-plus"
        initial="closed"
        animate={isSidebarOpen ? "open" : "closed"}
        variants={sidebarVariants}
        aria-hidden={!isSidebarOpen}
      >
        <div className="sidebar-header">
          <motion.div 
            className="logo-container"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="logo-icon">💎</div>
            <h3 className="sidebar-title">DIAMOND WEALTH</h3>
          </motion.div>
          <p className="sidebar-subtitle">Private Banking System</p>
        </div>
        
        <motion.ul className="sidebar-menu">
          {menuItems(isAdmin, isAgent).map(({ to, icon, label }, index) => (
            <motion.li
              key={label}
              variants={itemVariants}
              tabIndex={isSidebarOpen ? 0 : -1}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={activePath === to ? "active" : ""}
              custom={index}
              initial="closed"
              animate="open"
              transition={{ delay: 0.1 * index }}
            >
              <Link to={to} tabIndex={isSidebarOpen ? 0 : -1}>
                <div className="menu-item-content">
                  <div className="icon-container">
                    {icon}
                    <div className="icon-halo"></div>
                    <div className="active-indicator"></div>
                  </div>
                  <span>{label}</span>
                </div>
                <div className="menu-item-glow"></div>
                <motion.div 
                  className="menu-item-arrow"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.05 }}
                >
                  <FaChevronRight />
                </motion.div>
              </Link>
            </motion.li>
          ))}

          <motion.li
            onClick={handleLogout}
            className="logout-item"
            tabIndex={isSidebarOpen ? 0 : -1}
            role="button"
            aria-label="Logout"
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            custom={menuItems(isAdmin, isAgent).length}
            initial="closed"
            animate="open"
            transition={{ delay: 0.1 * menuItems(isAdmin, isAgent).length }}
          >
            <div className="menu-item-content">
              <div className="icon-container">
                <FaSignOutAlt className="icon logout-icon" />
                <div className="icon-halo"></div>
              </div>
              <span>Logout</span>
            </div>
            <div className="menu-item-glow"></div>
          </motion.li>
        </motion.ul>
        
        <div className="sidebar-footer">
          <motion.div 
            className="security-badge"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <span className="badge-icon">🛡️</span>
            <span>Military-Grade Encryption</span>
            <div className="verified-badge">✓ Verified</div>
          </motion.div>
          <motion.p 
            className="version-info"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            v3.2.1 • ©2023
          </motion.p>
        </div>

        {/* Effets visuels supplémentaires */}
        <div className="sidebar-effects">
          <div className="corner-light top-left"></div>
          <div className="corner-light top-right"></div>
          <div className="corner-light bottom-left"></div>
          <div className="corner-light bottom-right"></div>
          <div className="particle-effect"></div>
        </div>
      </motion.aside>

      <main className={`main-content ${isSidebarOpen ? "sidebar-open" : ""}`}>
        {children}
      </main>
    </div>
  );
};

export default Layout;