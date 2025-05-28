import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "./Navbar.css";

const NavbarClient = () => {
  return (
    <motion.nav
      className="navbar-client"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 80 }}
    >
      <div className="logo-client">
        <img src="/images/logo attijari.jpg" alt="Logo" />
        <span>Satisfaction Client</span>
      </div>
      <ul className="nav-links-client">
        <li><Link to="/accueil-client">Accueil</Link></li>
        <li><Link to="/creer-reclamation">Créer Réclamation</Link></li>
        <li><Link to="/signin">Se déconnecter</Link></li>
      </ul>
    </motion.nav>
  );
};

export default NavbarClient;
