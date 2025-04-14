// src/components/Sidebar.jsx
import React from "react";
import { FaHome, FaClipboardList, FaQuestionCircle, FaCog } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2 className="sidebar-title">Admin</h2>
      <ul className="sidebar-menu">
        <li><Link to="/dashboard"><FaHome /> Dashboard</Link></li>
        <li><Link to="/enquetes"><FaClipboardList /> Enquêtes</Link></li>
        <li><Link to="/questions"><FaQuestionCircle /> Questions</Link></li>
        <li><Link to="/settings"><FaCog /> Paramètres</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;
