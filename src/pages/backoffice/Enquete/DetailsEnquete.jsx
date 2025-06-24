import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import html2pdf from "html2pdf.js";
import {
  ClipboardText, TextAlignLeft, Calendar, CheckCircle,
  Hourglass, ArrowLeft, Question, ListBullets,
  Clock, Export, Trash, Pencil, ArrowCounterClockwise
} from "phosphor-react";
import "./DetailEnquete.css";

function DetailEnquete() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [enquete, setEnquete] = useState(null);
  const [error, setError] = useState("");
  const [remainingTime, setRemainingTime] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isExtending, setIsExtending] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const fetchEnquete = async () => {
      try {
        const token = localStorage.getItem("jwt");
        const user = JSON.parse(localStorage.getItem("user"));

        if (!token || !user?.roles?.includes("ROLE_ADMIN")) {
          throw new Error("Accès réservé aux administrateurs");
        }

        const response = await axios.get(`http://localhost:8083/admin/enquetes/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setEnquete(response.data);
      } catch (err) {
        setError(err.message || "Erreur lors du chargement de l'enquête");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEnquete();
  }, [id]);

  useEffect(() => {
    if (enquete?.statut === "PUBLIEE") {
      const calculateRemainingTime = () => {
        const now = new Date();
        const end = new Date(enquete.dateExpiration);
        const diff = end - now;

        if (diff <= 0) {
          setRemainingTime("⌛ Expirée");
        } else {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
          const minutes = Math.floor((diff / (1000 * 60)) % 60);
          setRemainingTime(`${days}j ${hours}h ${minutes}m`);
        }
      };

      calculateRemainingTime();
      const interval = setInterval(calculateRemainingTime, 60000);

      return () => clearInterval(interval);
    }
  }, [enquete]);

  const timeStatus = (() => {
    if (!remainingTime.includes("j")) return "expired";
    
    const days = parseInt(remainingTime.split("j")[0]);
    const hours = parseInt(remainingTime.split("j")[1].split("h")[0]);
    
    if (days === 0 && hours <= 6) return "critical";
    if (days <= 1) return "warning";
    return "normal";
  })();

  const handleExtend = async () => {
    if (!window.confirm("🔃 Prolonger cette enquête de 7 jours supplémentaires ?")) return;
    
    setIsExtending(true);
    try {
      const token = localStorage.getItem("jwt");
      const newDate = new Date(enquete.dateExpiration);
      newDate.setDate(newDate.getDate() + 7);

      await axios.put(`http://localhost:8083/admin/enquetes/update/${id}`, {
        ...enquete,
        dateExpiration: newDate.toISOString()
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("✅ Enquête prolongée avec succès !");
      window.location.reload();
    } catch (err) {
      alert("❌ Échec de la prolongation");
    } finally {
      setIsExtending(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("🗑️ Supprimer définitivement cette enquête ?")) return;
    
    setIsDeleting(true);
    try {
      const token = localStorage.getItem("jwt");
      await axios.delete(`http://localhost:8083/admin/enquetes/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      alert("✅ Enquête supprimée !");
      navigate("/enquetes");
    } catch (err) {
      alert("❌ Échec de la suppression");
    } finally {
      setIsDeleting(false);
    }
  };

  const generatePDF = async () => {
    setIsExporting(true);
    try {
      const element = document.getElementById("pdf-content");
      const opt = {
        margin: 10,
        filename: `enquete-${enquete.id}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
      };

      await html2pdf().set(opt).from(element).save();
    } catch (err) {
      alert("❌ Échec de l'export PDF");
    } finally {
      setIsExporting(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="spinner-container">
          <div className="spinner"></div>
          <div className="spinner-text">Chargement en cours...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-screen">
        <div className="error-content">
          <div className="error-icon">⚠️</div>
          <h3>Erreur de chargement</h3>
          <p className="error-message">{error}</p>
          <button 
            onClick={() => navigate("/enquetes")} 
            className="action-btn back-btn"
          >
            <ArrowLeft weight="bold" /> 
            <span>Retour aux enquêtes</span>
          </button>
        </div>
      </div>
    );
  }

  if (!enquete) return null;

  return (
    <div className="enquete-container">
      <div className="enquete-card glassmorphism">
        <div id="pdf-content">
          {/* En-tête PDF */}
          <div className="pdf-header">
            <div className="pdf-logo-container">
              <img src="/images/logo1.png" alt="Logo" className="pdf-logo" />
              <div className="pdf-titles">
                <h2>Détails de l'enquête</h2>
                <p className="pdf-subtitle">Rapport détaillé</p>
              </div>
            </div>
            <div className="pdf-meta">
              <p><strong>Exporté le :</strong> {new Date().toLocaleString("fr-FR")}</p>
              <p><strong>Référence :</strong> ENQ-{enquete.id}</p>
            </div>
          </div>

          {/* Contenu principal */}
          <div className="enquete-content">
            <div className="enquete-header">
              <div className="title-container">
                <ClipboardText size={32} className="header-icon" />
                <h1>{enquete.titre}</h1>
              </div>
              <span className={`status-badge ${enquete.statut.toLowerCase()}`}>
                {enquete.statut === "PUBLIEE" && "📢 Publiée"}
                {enquete.statut === "BROUILLON" && "📝 Brouillon"}
                {enquete.statut === "EXPIREE" && "⌛ Expirée"}
              </span>
            </div>

            <div className="info-section">
              <div className="info-card glassmorphism">
                <TextAlignLeft size={24} className="info-icon" />
                <div className="info-text">
                  <h3>Description</h3>
                  <p>{enquete.description || "Aucune description fournie"}</p>
                </div>
              </div>

              <div className="info-grid">
                <div className="info-item glassmorphism">
                  <div className="info-icon-container">
                    <Calendar size={24} />
                    <span>Création</span>
                  </div>
                  <strong>{formatDate(enquete.dateCreation)}</strong>
                </div>

                <div className="info-item glassmorphism">
                  <div className="info-icon-container">
                    <CheckCircle size={24} />
                    <span>Publication</span>
                  </div>
                  <strong>{formatDate(enquete.datePublication)}</strong>
                </div>

                <div className="info-item glassmorphism">
                  <div className="info-icon-container">
                    <Hourglass size={24} />
                    <span>Expiration</span>
                  </div>
                  <strong>{formatDate(enquete.dateExpiration)}</strong>
                </div>
              </div>

              {enquete.statut === "PUBLIEE" && (
                <div className={`time-remaining ${timeStatus} glassmorphism`}>
                  <Clock size={24} weight="duotone" />
                  <div className="time-text">
                    <h3>Temps restant</h3>
                    <p>{remainingTime}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Section questions */}
            <div className="questions-section">
              <h2 className="section-title">
                <Question size={28} weight="duotone" className="section-icon" />
                <span>Questions ({enquete.questions.length})</span>
              </h2>

              {enquete.questions.length > 0 ? (
                <div className="questions-list">
                  {enquete.questions.map((q, i) => (
                    <div key={i} className="question-card glassmorphism">
                      <div className="question-header">
                        <span className="question-number">#{i + 1}</span>
                        <span className="question-type">{q.type}</span>
                      </div>
                      <h4>{q.texte}</h4>
                      
                      {q.options?.length > 0 && (
                        <ul className="options-list">
                          {q.options.map((opt, idx) => (
                            <li key={idx}>
                              <ListBullets size={16} weight="fill" className="option-icon" />
                              <span>{opt}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-questions glassmorphism">
                  <p>Aucune question dans cette enquête</p>
                </div>
              )}
            </div>
          </div>

          {/* Pied de page PDF */}
          <div className="pdf-footer">
            <p>Généré par le système de gestion d'enquêtes - {new Date().getFullYear()}</p>
            <p>Page 1/1</p>
          </div>
        </div>

        {/* Actions */}
        <div className="action-buttons">
          <button 
            onClick={() => navigate("/enquetes")} 
            className="action-btn back-btn hover-effect"
          >
            <ArrowLeft weight="bold" /> 
            <span>Retour</span>
          </button>

          <button 
            onClick={() => navigate(`/enquete/modifier/${enquete.id}`)} 
            className="action-btn edit-btn hover-effect"
          >
            <Pencil weight="bold" />
            <span>Modifier</span>
          </button>

          {enquete.statut === "EXPIREE" && (
            <button 
              onClick={handleExtend} 
              className={`action-btn extend-btn hover-effect ${isExtending ? "loading" : ""}`}
              disabled={isExtending}
            >
              {isExtending ? (
                <span className="loader"></span>
              ) : (
                <>
                  <ArrowCounterClockwise weight="bold" />
                  <span>Prolonger</span>
                </>
              )}
            </button>
          )}

          <button 
            onClick={generatePDF} 
            className={`action-btn export-btn hover-effect ${isExporting ? "loading" : ""}`}
            disabled={isExporting}
          >
            {isExporting ? (
              <span className="loader"></span>
            ) : (
              <>
                <Export weight="bold" />
                <span>Exporter</span>
              </>
            )}
          </button>

          <button 
            onClick={handleDelete} 
            className={`action-btn delete-btn hover-effect ${isDeleting ? "loading" : ""}`}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <span className="loader"></span>
            ) : (
              <>
                <Trash weight="bold" />
                <span>Supprimer</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DetailEnquete;