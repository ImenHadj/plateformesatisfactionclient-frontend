import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Card } from '@mui/material';
import { FaTachometerAlt, FaTable, FaCreditCard, FaCog } from 'react-icons/fa';
import { motion } from "framer-motion";
import './Dashboard.css'; // Assurez-vous que ce fichier existe et que vous avez les styles nécessaires

const Dashboard = () => {
  return (
    <div className="dashboard">
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
      <main className="main-content">
        <nav className="navbar">
          <div className="navbar-container">
            {/* Central Search Bar */}
            <input type="text" className="search-box" placeholder="Search..." />
            <div className="navbar-icons">
              <i className="fas fa-bell"></i>
              <i className="fas fa-user-circle"></i>
            </div>
          </div>
        </nav>
        <section className="dashboard-content">
          {/* Welcome Text with Continuous Horizontal Floating Animation */}
          <motion.h2
            animate={{
              x: ["0%", "100%"],  // Move from 0 to 100% of its width
            }}
            transition={{
              duration: 5,
              repeat: Infinity,  // Repeat the animation indefinitely
              repeatType: "loop", // Ensure continuous loop
              ease: "linear",
            }}
            className="welcome-text"
          >
            Welcome to the Dashboard
          </motion.h2>
          <div className="stats">
            {/* Card with Continuous Horizontal Floating Effect */}
            <motion.div
              className="card"
              animate={{
                x: ["-100%", "100%"],  // Move from left to right
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                repeatType: "loop",
                ease: "linear",
              }}
            >
              <h4>Today's Revenue</h4>
              <p>$15,500</p>
            </motion.div>
            <motion.div
              className="card"
              animate={{
                x: ["-100%", "100%"],  // Move from left to right
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                repeatType: "loop",
                ease: "linear",
              }}
            >
              <h4>Active Users</h4>
              <p>1,200</p>
            </motion.div>
            <motion.div
              className="card"
              animate={{
                x: ["-100%", "100%"],  // Move from left to right
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                repeatType: "loop",
                ease: "linear",
              }}
            >
              <h4>Orders Completed</h4>
              <p>320</p>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
