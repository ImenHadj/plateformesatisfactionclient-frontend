import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { logout } from "../pages/auth/auth";// adapte le chemin si nécessaire
import "./Navbar.css";

const NavbarClient = () => {
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault();
    await logout(navigate);
  };

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
        <li><a href="#logout" onClick={handleLogout}>Se déconnecter</a></li>
      </ul>
    </motion.nav>
  );
};

export default NavbarClient;
