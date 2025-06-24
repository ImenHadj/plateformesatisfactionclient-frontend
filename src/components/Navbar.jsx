import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { logout } from "../pages/auth/auth";
import "./Navbar.css";

const NavbarClient = () => {
  const navigate = useNavigate();
  const [hoveredItem, setHoveredItem] = useState(null);

  const handleLogout = async (e) => {
    e.preventDefault();
    await logout(navigate);
  };

  const navItems = [
    { path: "/accueil-client", label: "Accueil" },
    { path: "/creer-reclamation", label: "Créer Réclamation" },
    { path: "#logout", label: "Se déconnecter", onClick: handleLogout }
  ];

  return (
    <motion.nav
      className="navbar-client"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ 
        type: "spring", 
        stiffness: 150, 
        damping: 20,
        delay: 0.2
      }}
    >
      <div className="navbar-glass-container">
        <div className="navbar-content">
          <motion.div 
            className="logo-client"
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <motion.img 
              src="/images/logo attijari.jpg" 
              alt="Logo" 
              whileHover={{ rotate: -5 }}
            />
            <motion.span
              initial={{ backgroundSize: "0% 3px" }}
              whileHover={{ 
                backgroundSize: "100% 3px",
                transition: { duration: 0.4 }
              }}
            >
              Satisfaction Client
            </motion.span>
          </motion.div>
          
          <ul className="nav-links-client">
            {navItems.map((item, index) => (
              <motion.li 
                key={index}
                onHoverStart={() => setHoveredItem(index)}
                onHoverEnd={() => setHoveredItem(null)}
              >
                <Link 
                  to={item.path} 
                  onClick={item.onClick}
                  className={index === navItems.length - 1 ? "logout-link" : ""}
                >
                  {item.label}
                  <AnimatePresence>
                    {hoveredItem === index && (
                      <motion.span
                        className="nav-item-highlight"
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        exit={{ width: 0 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </AnimatePresence>
                </Link>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </motion.nav>
  );
};

export default NavbarClient;