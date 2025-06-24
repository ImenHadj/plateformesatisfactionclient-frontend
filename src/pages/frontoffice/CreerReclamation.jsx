import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import "./CreerReclamation.css";
import Navbar from "../../components/Navbar";
import { FiSend, FiHeadphones, FiMail, FiPhone, FiAlertCircle } from "react-icons/fi";
import { BsCheckCircleFill, BsExclamationCircleFill } from "react-icons/bs";
import { RiCustomerService2Fill } from "react-icons/ri";

function CreerReclamation() {
  const [contenu, setContenu] = useState("");
  const [confirmation, setConfirmation] = useState(null);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedType, setSelectedType] = useState("");

  const reclamationTypes = [
  { id: "SERVICE_CLIENT", label: "Service client" },
  { id: "PRODUIT", label: "Produit" },
  { id: "COMPTE", label: "Compte" },
  { id: "FACTURATION", label: "Facturation" },
  { id: "APPLICATION_MOBILE", label: "Application Mobile" },
  { id: "SITE_WEB", label: "Site Web" },
  { id: "AGENCE", label: "Agence" },
  { id: "AUTRE", label: "Autre" },
];


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedType) {
      setConfirmation("Veuillez sélectionner un type de réclamation");
      setIsError(true);
      setTimeout(() => setConfirmation(null), 5000);
      return;
    }
    
    setIsLoading(true);
    try {
      const jwt = localStorage.getItem("jwt");
      await axios.post(
        "http://localhost:8083/api/reclamations/submit",
        { contenu, type: selectedType },
        {
          headers: { Authorization: `Bearer ${jwt}` },
        }
      );
      setContenu("");
      setSelectedType("");
      setConfirmation("Votre réclamation a été transmise avec succès");
      setIsError(false);
    } catch (error) {
      setConfirmation("Erreur lors de la soumission de votre réclamation");
      setIsError(true);
    } finally {
      setIsLoading(false);
      setTimeout(() => setConfirmation(null), 5000);
    }
  };

  return (
    <>
      <Navbar />
      <div className="reclamation-page">
        <div className="particle-background">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="particle"
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 0.6, 0],
                y: [0, -100],
                x: [0, Math.random() * 100 - 50]
              }}
              transition={{
                duration: 10 + Math.random() * 10,
                repeat: Infinity,
                delay: Math.random() * 5
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 10 + 5}px`,
                height: `${Math.random() * 10 + 5}px`,
                background: `rgba(255, 107, 53, ${Math.random() * 0.5 + 0.1})`
              }}
            />
          ))}
        </div>
        
        <motion.div
          className="reclamation-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="reclamation-card"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.7 }}
          >
            <div className="form-header">
              <motion.div 
                className="header-icon-container"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
              >
                <RiCustomerService2Fill className="header-icon" />
              </motion.div>
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <span>Formulaire de Réclamation</span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Votre satisfaction est notre priorité absolue
              </motion.p>
            </div>

            <form onSubmit={handleSubmit} className="reclamation-form">
              <div className="type-selection">
                <label>Type de réclamation</label>
                <div className="type-options">
                  {reclamationTypes.map((type) => (
                    <motion.div
                      key={type.id}
                      className={`type-option ${selectedType === type.id ? "selected" : ""}`}
                      onClick={() => setSelectedType(type.id)}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {type.label}
                      {selectedType === type.id && (
                        <motion.div 
                          className="selection-indicator"
                          layoutId="selectionIndicator"
                          initial={false}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className={`form-group ${isFocused ? "focused" : ""}`}>
                <label htmlFor="reclamation">Décrivez votre préoccupation en détail</label>
                <motion.textarea
                  id="reclamation"
                  value={contenu}
                  onChange={(e) => setContenu(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder="Décrivez votre problème ou préoccupation avec le plus de détails possible..."
                  required
                  rows="6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                />
                <div className="focus-border"></div>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <motion.button
                  type="submit"
                  className="submit-button"
                  whileHover={{ 
                    y: -3,
                    boxShadow: "0 15px 30px rgba(255, 107, 53, 0.4)"
                  }}
                  whileTap={{ scale: 0.96 }}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="loading-dots">
                      <span>.</span><span>.</span><span>.</span>
                    </span>
                  ) : (
                    <>
                      <FiSend className="button-icon" />
                      <span>Envoyer la réclamation</span>
                    </>
                  )}
                </motion.button>
              </motion.div>
            </form>

            <AnimatePresence>
              {confirmation && (
                <motion.div
                  className={`confirmation-toast ${isError ? "error" : "success"}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {isError ? (
                    <BsExclamationCircleFill className="toast-icon" />
                  ) : (
                    <BsCheckCircleFill className="toast-icon" />
                  )}
                  <span>{confirmation}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div
            className="contact-panel"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.7 }}
          >
            <div className="contact-visual">
              <div className="floating-elements">
                <div className="floating-circle circle-1"></div>
                <div className="floating-circle circle-2"></div>
                <div className="floating-circle circle-3"></div>
                <motion.div 
                  className="support-illustration"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  <RiCustomerService2Fill />
                </motion.div>
              </div>
            </div>
            
            <div className="contact-info">
              <h3>Besoin d'aide immédiate ?</h3>
              <p className="contact-description">Notre équipe est disponible 24/7 pour vous assister</p>
              
              <div className="contact-methods">
                <motion.div 
                  className="contact-method"
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="contact-icon-wrapper">
                    <FiMail className="contact-icon" />
                  </div>
                  <div>
                    <div className="contact-label">Email</div>
                    <div className="contact-value">support@attijaribank.tn</div>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="contact-method"
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="contact-icon-wrapper">
                    <FiPhone className="contact-icon" />
                  </div>
                  <div>
                    <div className="contact-label">Téléphone</div>
                    <div className="contact-value">+216 71 000 000</div>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="contact-method"
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="contact-icon-wrapper">
                    <FiAlertCircle className="contact-icon" />
                  </div>
                  <div>
                    <div className="contact-label">Urgence</div>
                    <div className="contact-value">+216 98 000 000</div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <footer className="reclamation-footer">
          <div className="footer-content">
            <p>© {new Date().getFullYear()} Attijari Bank. Tous droits réservés.</p>
            <div className="footer-links">
              <a href="/confidentialite">Confidentialité</a>
              <a href="/conditions">Conditions</a>
              <a href="/contact">Contact</a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

export default CreerReclamation;