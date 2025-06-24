import React, { useEffect, useState } from "react";
import axios from "axios";
import EnqueteResponseFormDynamic from "./EnqueteResponseFormDynamic";
import Navbar from "../../components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiCalendar, 
  FiAlertTriangle, 
  FiBell, 
  FiCheck, 
  FiX, 
  FiArrowRight,
  FiClock
} from "react-icons/fi";
import { MdOutlineNewReleases } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ClientEnquetePage.css";

const ClientEnquetePage = () => {
  const [enquetes, setEnquetes] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem("jwt");

  // Vérifie si une enquête est nouvelle (publiée il y a moins de 3 jours)
  const isNewEnquete = (datePublication) => {
    const troisJoursEnMs = 3 * 24 * 60 * 60 * 1000;
    return new Date() - new Date(datePublication) < troisJoursEnMs;
  };

  // Vérifie si une enquête est sur le point d'expirer (dans les 2 jours)
  const isAboutToExpire = (dateExpiration) => {
    const deuxJoursEnMs = 2 * 24 * 60 * 60 * 1000;
    return new Date(dateExpiration) - new Date() < deuxJoursEnMs;
  };

  // Affiche une notification moderne
  const showModernNotification = (type, title, message) => {
    toast(
      <div className="toast-content">
        <div className="toast-icon">
          {type === "new" ? (
            <MdOutlineNewReleases className="pulse" />
          ) : (
            <FiAlertTriangle />
          )}
        </div>
        <div className="toast-text">
          <h4>{title}</h4>
          <p>{message}</p>
        </div>
      </div>,
      {
        position: "top-right",
        autoClose: type === "new" ? 6000 : 8000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        className: `modern-toast ${type}-toast`,
      }
    );
  };

  useEffect(() => {
    const fetchEnquetes = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get("http://localhost:8083/enquete/publiees", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEnquetes(res.data);

        // Vérifier les alertes après le chargement
        res.data.forEach(enquete => {
          if (isNewEnquete(enquete.datePublication)) {
            showModernNotification(
              "new",
              "Nouvelle enquête disponible !",
              `${enquete.titre} - Publiée le ${new Date(enquete.datePublication).toLocaleDateString("fr-FR")}`
            );
          }

          if (isAboutToExpire(enquete.dateExpiration) && !isExpired(enquete.dateExpiration)) {
            showModernNotification(
              "expiring",
              "Enquête bientôt expirée",
              `${enquete.titre} - Expire le ${new Date(enquete.dateExpiration).toLocaleDateString("fr-FR")}`
            );
          }
        });
      } catch (err) {
        console.error("Erreur fetch enquêtes", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEnquetes();
  }, [token]);

  const isExpired = (date) => new Date(date) < new Date();

  return (
    <div className="bank-theme-container">
      <Navbar />
      
      {/* Configuration des notifications */}
      <ToastContainer
        position="top-right"
        autoClose={6000}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        limit={3}
      />
      
      <div className="bank-header-spacer"></div>

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bank-main-content"
      >
        <header className="bank-page-header">
          <motion.h1 
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.2 }}
            className="bank-title"
          >
            Vos Enquêtes Bancaires
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bank-subtitle"
          >
            Votre opinion nous aide à améliorer nos services
          </motion.p>
        </header>

        {isLoading ? (
          <div className="bank-loading-state">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="bank-spinner"
            />
            <p>Chargement de vos enquêtes...</p>
          </div>
        ) : enquetes.length === 0 ? (
          <div className="bank-empty-state">
            <div className="empty-icon-bank"></div>
            <h3>Aucune enquête disponible</h3>
            <p>Nous publierons de nouvelles enquêtes prochainement</p>
          </div>
        ) : (
          <>
            <div className="bank-cards-container">
              <div className="bank-cards-grid">
                {enquetes.map((enquete) => (
                  <motion.div
                    key={enquete.id}
                    className={`bank-card ${isExpired(enquete.dateExpiration) ? 'expired' : ''} ${enquete.id === selectedId ? 'selected' : ''}`}
                    onClick={() => !isExpired(enquete.dateExpiration) && setSelectedId(enquete.id)}
                    whileHover={{ y: -5 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="bank-card-content">
                      <div className="bank-card-header">
                        <h3>{enquete.titre}</h3>
                        <div className="bank-card-badges">
                          {enquete.id === selectedId && (
                            <span className="bank-selected-badge">
                              <FiCheck /> Sélectionné
                            </span>
                          )}
                          {isNewEnquete(enquete.datePublication) && (
                            <span className="bank-new-badge">
                              <FiBell /> Nouveau
                            </span>
                          )}
                          {isAboutToExpire(enquete.dateExpiration) && !isExpired(enquete.dateExpiration) && (
                            <span className="bank-expiring-badge">
                              <FiAlertTriangle /> Bientôt expiré
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="bank-card-description">{enquete.description}</p>
                      
                      <div className="bank-card-footer">
                        <span className="bank-date-info">
                          <FiCalendar /> Expire le {new Date(enquete.dateExpiration).toLocaleDateString("fr-FR")}
                        </span>
                        {isExpired(enquete.dateExpiration) ? (
                          <span className="bank-expired-tag">Terminé</span>
                        ) : (
                          <button className="bank-action-btn">
                            <FiArrowRight />
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <AnimatePresence>
              {selectedId && (
                <motion.div
                  className="bank-response-panel"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 50 }}
                  transition={{ type: "spring", damping: 25 }}
                >
                  <div className="bank-panel-header">
                    <h2>Formulaire d'enquête</h2>
                    <button 
                      onClick={() => setSelectedId(null)}
                      className="bank-close-btn"
                    >
                      <FiX />
                    </button>
                  </div>
                  <EnqueteResponseFormDynamic enqueteId={selectedId} />
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </motion.main>
    </div>
  );
};

export default ClientEnquetePage;