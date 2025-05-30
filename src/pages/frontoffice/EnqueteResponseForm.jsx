import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useLocation } from "react-router-dom";
import { QuestionTypeMapper } from "./QuestionTypeMapper";
import { QuestionRenderer } from "./QuestionRenderer";
import { motion, AnimatePresence } from "framer-motion";
import "./EnqueteResponseForm.css";

const EnqueteResponseForm = () => {
  const { enqueteId } = useParams();
  const location = useLocation();

  const [enquete, setEnquete] = useState(null);
  const [reponses, setReponses] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [resumeVisible, setResumeVisible] = useState(false);
  const [submittedAnswers, setSubmittedAnswers] = useState([]);
  const [formError, setFormError] = useState(null);
  const [remainingTime, setRemainingTime] = useState(null);
  const [countdownColor, setCountdownColor] = useState("green");

  // Charger l'enquête
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const userIdFromUrl = params.get("userId");

    if (!userIdFromUrl) {
      setError("L'ID de l'utilisateur est manquant.");
      setIsLoading(false);
      return;
    }

    setUserId(userIdFromUrl);

    if (enqueteId) {
      axios
        .get(`http://localhost:8083/enquete/respond/${enqueteId}`)
        .then((response) => {
          const data = response.data;
          if (data?.questions?.length > 0) {
            setEnquete({
              ...data,
              questions: data.questions.map((q) => ({
                ...q,
                obligatoire: true,
              })),
            });
          } else {
            setError("Aucune question disponible pour cette enquête.");
          }
        })
        .catch((err) => {
          setError(`Erreur: ${err.response?.data?.message || err.message}`);
        })
        .finally(() => setIsLoading(false));
    }
  }, [enqueteId, location]);

  // Gérer le compte à rebours
  useEffect(() => {
    if (!enquete?.dateExpiration) return;

    const interval = setInterval(() => {
      const expirationDate = new Date(enquete.dateExpiration);
      const now = new Date();
      const diff = expirationDate - now;

      if (diff <= 0) {
        setRemainingTime("L'enquête est expirée");
        clearInterval(interval);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setRemainingTime(`${days}j ${hours}h ${minutes}m ${seconds}s`);

      if (diff < 5 * 60 * 1000) setCountdownColor("red");
      else if (diff < 60 * 60 * 1000) setCountdownColor("orange");
      else setCountdownColor("green");
    }, 1000);

    return () => clearInterval(interval);
  }, [enquete]);

  const isExpired = () => {
    if (!enquete?.dateExpiration) return false;
    return new Date() > new Date(enquete.dateExpiration);
  };

  const handleChange = (questionId, value) => {
    setReponses((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isExpired()) {
      alert("Cette enquête est expirée. Vous ne pouvez plus y répondre.");
      return;
    }

    const missingRequired = enquete.questions.filter((q) =>
      q.obligatoire &&
      (
        reponses[q.id] === undefined ||
        reponses[q.id] === null ||
        reponses[q.id] === "" ||
        (Array.isArray(reponses[q.id]) && reponses[q.id].length === 0)
      )
    );

    if (missingRequired.length > 0) {
      setFormError("Merci de répondre à toutes les questions obligatoires.");
      return;
    } else {
      setFormError(null);
    }

    const reponsesDTO = enquete.questions
      .filter((q) => reponses[q.id] !== undefined)
      .map((q) => {
        const value = reponses[q.id];
        const type = QuestionTypeMapper[q.type] || "TEXTE";

        const dto = {
          questionId: Number(q.id),
          typeReponse: type,
        };

        switch (type) {
          case "TEXTE":
            dto.texteReponse = String(value || "");
            break;
          case "CHOIX_SIMPLE":
            dto.choixReponses = [value];
            break;
          case "CHOIX_MULTIPLE":
            dto.choixReponses = Array.isArray(value) ? value : value ? [value] : [];
            break;
          case "NUMERIQUE":
          case "NOTE":
          case "SLIDER":
          case "POURCENTAGE":
          case "DEVISE":
            dto.valeurNumerique = parseFloat(value || 0);
            break;
          case "DATE_HEURE":
          case "DATE":
          case "HEURE":
          case "CHOIX_COULEUR":
            dto.texteReponse = value || "";
            break;
          default:
            dto.texteReponse = String(value || "");
        }

        return dto;
      });

    try {
      await axios.post(
        `http://localhost:8083/enquete/respond/${enqueteId}?userId=${userId}`,
        reponsesDTO,
        { headers: { "Content-Type": "application/json" } }
      );

      alert("Réponses enregistrées avec succès !");
      setSubmittedAnswers(reponsesDTO);
      setResumeVisible(true);
    } catch (err) {
      console.error("Erreur:", err);
      alert(`Erreur: ${err.response?.data?.message || err.message}`);
    }
  };

  if (isLoading) return <div className="loading">Chargement...</div>;
  if (error) return <div className="error">Erreur: {error}</div>;
  if (!enquete?.questions?.length)
    return <div className="error">Aucune question disponible</div>;

  return (
    <div className="enquete-container">
      <motion.div
        className="glass-form"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2>{enquete.titre}</h2>
        <p>{enquete.description}</p>

        {remainingTime && !isExpired() && (
          <p className="countdown" style={{ color: countdownColor }}>
            ⏳ {remainingTime}
          </p>
        )}

        {isExpired() && <p className="expired">⚠️ Cette enquête est expirée.</p>}

        <form onSubmit={handleSubmit} className="form-style">
          {enquete.questions.map((q, index) => (
            <motion.div
              key={q.id}
              className="question-block"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <h4>
                {q.texte}{" "}
                {q.obligatoire && <span className="required">*</span>}
              </h4>
              <QuestionRenderer
                question={q}
                value={reponses[q.id]}
                onChange={(val) => handleChange(q.id, val)}
              />
            </motion.div>
          ))}

          {formError && <p className="error-message">{formError}</p>}

          <motion.button
            type="submit"
            className="submit-button"
            disabled={isExpired()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ✅ Soumettre
          </motion.button>
        </form>

        <AnimatePresence>
          {resumeVisible && (
            <motion.div
              className="resume-section"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.5 }}
            >
              <h3>🧾 Résumé de vos réponses :</h3>
              <ul>
                {submittedAnswers.map((r, i) => (
                  <li key={i}>
                    <strong>Question ID {r.questionId}</strong> :{" "}
                    {r.texteReponse ??
                      r.valeurNumerique ??
                      (r.choixReponses?.length
                        ? r.choixReponses.join(", ")
                        : "Aucune réponse")}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default EnqueteResponseForm;
