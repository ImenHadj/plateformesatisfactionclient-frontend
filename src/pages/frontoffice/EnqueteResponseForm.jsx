import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@mui/material";
import { useParams, useLocation } from "react-router-dom";
import { QuestionTypeMapper } from "./QuestionTypeMapper";
import { QuestionRenderer } from "./QuestionRenderer";

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

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const userIdFromUrl = params.get("userId");

    if (userIdFromUrl) {
      setUserId(userIdFromUrl);
    } else {
      setError("L'ID de l'utilisateur est manquant.");
      setIsLoading(false);
      return;
    }

    if (enqueteId) {
      axios.get(`http://localhost:9090/enquete/respond/${enqueteId}`)
        .then((response) => {
          if (response.data?.questions) {
            setEnquete({
              ...response.data,
              questions: response.data.questions.map((q) => ({
                ...q,
                obligatoire: true
              }))
            });
          }
        })
        .catch((err) => {
          setError(`Erreur: ${err.response?.data?.message || err.message}`);
        })
        .finally(() => setIsLoading(false));
    }
  }, [enqueteId, location]);

  useEffect(() => {
    if (!enquete?.dateExpiration) return;

    const interval = setInterval(() => {
      const expirationDate = new Date(enquete.dateExpiration);
      const now = new Date();
      const diff = expirationDate.getTime() - now.getTime();

      if (diff <= 0) {
        setRemainingTime("L'enquête est expirée");
        clearInterval(interval);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      const display = `${days}j ${hours}h ${minutes}m ${seconds}s`;
      setRemainingTime(display);

      if (diff < 5 * 60 * 1000) setCountdownColor("red");
      else if (diff < 60 * 60 * 1000) setCountdownColor("orange");
      else setCountdownColor("green");
    }, 1000);

    return () => clearInterval(interval);
  }, [enquete]);

  const handleChange = (questionId, value) => {
    setReponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const isExpired = () => {
    if (!enquete?.dateExpiration) return false;
    const expirationDate = new Date(enquete.dateExpiration);
    const now = new Date();
    return now > expirationDate;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isExpired()) {
      alert("Cette enquête est expirée. Vous ne pouvez plus y répondre.");
      return;
    }

    const missingRequired = enquete.questions.filter(q => q.obligatoire && (reponses[q.id] === undefined || reponses[q.id] === null || reponses[q.id] === "" || (Array.isArray(reponses[q.id]) && reponses[q.id].length === 0)));
    if (missingRequired.length > 0) {
      setFormError("Merci de répondre à toutes les questions obligatoires.");
      return;
    } else {
      setFormError(null);
    }

    const reponsesDTO = enquete.questions
      .filter(question => question.id && reponses[question.id] !== undefined)
      .map(question => {
        const responseValue = reponses[question.id];
        const backendType = QuestionTypeMapper[question.type] || "TEXTE";

        const responseDTO = {
          questionId: Number(question.id),
          typeReponse: backendType,
        };

        switch (backendType) {
          case "TEXTE":
            responseDTO.texteReponse = String(responseValue || "");
            break;

          case "CHOIX_SIMPLE":
            responseDTO.choixReponses = [responseValue];
            break;

          case "CHOIX_MULTIPLE":
            responseDTO.choixReponses = Array.isArray(responseValue)
              ? responseValue
              : responseValue ? [responseValue] : [];
            break;

          case "NUMERIQUE":
          case "NOTE":
          case "SLIDER":
          case "POURCENTAGE":
          case "DEVISE":
            responseDTO.valeurNumerique = parseFloat(responseValue || 0);
            break;

          case "DATE_HEURE":
          case "DATE":
          case "HEURE":
          case "CHOIX_COULEUR":
            responseDTO.texteReponse = responseValue || "";
            break;

          default:
            responseDTO.texteReponse = String(responseValue || "");
        }

        return responseDTO;
      });

    try {
      const response = await axios.post(
        `http://localhost:9090/enquete/respond/${enqueteId}?userId=${userId}`,
        reponsesDTO,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      alert("Réponses enregistrées avec succès !");
      setSubmittedAnswers(reponsesDTO);
      setResumeVisible(true);
    } catch (error) {
      console.error("Erreur complète:", error);
      alert(`Erreur: ${error.response?.data?.message || error.message}`);
    }
  };

  if (isLoading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;
  if (!enquete?.questions?.length) return <div>Aucune question disponible</div>;

  return (
    <div>
      <h2>{enquete.titre}</h2>
      <p>{enquete.description}</p>

      {!isExpired() && remainingTime && (
        <p style={{ fontWeight: "bold", color: countdownColor }}>{remainingTime}</p>
      )}

      {isExpired() && <p style={{ color: "red" }}>⚠️ Cette enquête est expirée.</p>}

      <form onSubmit={handleSubmit}>
        {enquete.questions.map((question) => (
          <div key={`q-${question.id}`} style={{ marginBottom: '20px' }}>
            <h4>
              {question.texte} {question.obligatoire && <span style={{ color: "red" }}>*</span>}
            </h4>
            <QuestionRenderer
              question={question}
              value={reponses[question.id]}
              onChange={(value) => handleChange(question.id, value)}
            />
          </div>
        ))}

        {formError && <p style={{ color: "red" }}>{formError}</p>}

        <Button type="submit" variant="contained" color="primary" disabled={isExpired()}>
          Soumettre
        </Button>
      </form>

      {resumeVisible && (
        <div style={{ marginTop: "30px" }}>
          <h3>🧾 Résumé de vos réponses :</h3>
          <ul>
            {submittedAnswers.map((r, i) => (
              <li key={i}>
                <strong>Question ID {r.questionId}</strong> :&nbsp;
                {r.texteReponse || r.valeurNumerique || r.choixReponses?.join(", ") || "Aucune réponse"}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default EnqueteResponseForm;