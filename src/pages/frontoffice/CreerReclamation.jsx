import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import "./CreerReclamation.css";
import Navbar from "../../components/Navbar";
import { FaPaperPlane } from "react-icons/fa";

function CreerReclamation() {
  const [contenu, setContenu] = useState("");
  const [confirmation, setConfirmation] = useState(null);
  const [isError, setIsError] = useState(false);

 const [isLoading, setIsLoading] = useState(false);

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  try {
    const jwt = localStorage.getItem("jwt");
    await axios.post("http://localhost:8083/api/reclamations/submit", { contenu }, {
      headers: { Authorization: `Bearer ${jwt}` },
    });
    setContenu("");
    setConfirmation("✅ Réclamation envoyée avec succès !");
    setIsError(false);
  } catch (error) {
    setConfirmation("❌ Une erreur est survenue !");
    setIsError(true);
  } finally {
    setIsLoading(false);
    setTimeout(() => setConfirmation(null), 4000);
  }
};

  return (
    <>
      <Navbar />
      <div className="reclamation-container">
        <div className="reclamation-layout">
          <motion.div
            className="reclamation-form"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            {confirmation && (
              <div className={`toast-message ${isError ? "toast-error" : ""}`}>
                {confirmation}
              </div>
            )}

            <h2>📢 Soumettre une Réclamation</h2>
            <p>Aidez-nous à améliorer notre service</p>

            <form onSubmit={handleSubmit}>
              <textarea
                value={contenu}
                onChange={(e) => setContenu(e.target.value)}
                placeholder="Décrivez votre problème ici..."
                required
              />
             <motion.button
  whileHover={{ y: -2 }}
  whileTap={{ scale: 0.98 }}
  type="submit"
  className="send-button new-style"
  disabled={isLoading}
>
  {isLoading ? "Envoi en cours..." : (
    <>
      <FaPaperPlane className="send-icon" />
      Envoyer
    </>
  )}
</motion.button>
            </form>
          </motion.div>

          <div className="reclamation-illustration">
            <img
              src="/images/support.svg"
              alt="Support visuel"
              className="responsive-image"
            />
          </div>
        </div>

        <footer className="support-footer">
          <div className="support-info">
            <p>📧 support@Attijaribank.tn | 📱 +216 71 000 000</p>
          </div>
          <div className="footer-rights">© 2025 Attijaribank</div>
        </footer>
      </div>
    </>
  );
}

export default CreerReclamation;
