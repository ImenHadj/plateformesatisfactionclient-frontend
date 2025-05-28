import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "./Navbar.css";

const NavbarClient = () => {
  return (
    <motion.nav
      className="navbar-client"
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 80 }}
    >
      {/* Left: Logo */}
      <div className="logo-client">
        <img src="/images/logo.png" alt="Logo" />
        <span>Satisfaction Client</span>
      </div>

      {/* Center: Nav links */}
      <ul className="nav-links-client">
        <li><Link to="/accueil-client">Accueil</Link></li>
        <li><Link to="/creer-reclamation">Créer Réclamation</Link></li>
      </ul>

      {/* Right: Logout */}
      <div className="logout-link">
        <Link to="/signin">Se déconnecter</Link>
      </div>
    </motion.nav>
  );
};

export default NavbarClient;
