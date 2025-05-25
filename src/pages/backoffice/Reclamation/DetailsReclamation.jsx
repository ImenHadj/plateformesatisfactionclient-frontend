import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import html2pdf from "html2pdf.js";
import {
  ClipboardText, TextAlignLeft, Calendar, Hourglass, ArrowLeft, ListBullets
} from "phosphor-react";
import "./DetailReclamation.css";

function DetailReclamation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reclamation, setReclamation] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    axios.get(`http://localhost:8083/api/reclamations/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => setReclamation(res.data))
      .catch(() => setError("❌ Erreur lors du chargement de la réclamation."));
  }, [id]);

  const generatePDF = () => {
    const element = document.getElementById("pdf-content");
    html2pdf().set({
      margin: 0.4,
      filename: `reclamation-${reclamation.id}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" }
    }).from(element).save();
  };

  if (error) return <div className="error-message">{error}</div>;
  if (!reclamation) return <div className="loading">Chargement...</div>;

  const today = new Date().toLocaleDateString();

  return (
    <div className="detail-container">
      <div className="detail-card">
        <div id="pdf-content">
          <div className="pdf-header">
            <img src="/images/logo1.png" alt="Logo" className="pdf-logo" />
            <div className="pdf-info">
              <p>Date d’export : {today}</p>
              <div className="pdf-footer">
                <p>🕒 Exporté le : {new Date().toLocaleString()}</p>
              </div>
            </div>
          </div>

          <h2 className="detail-title">
            <ClipboardText size={26} color="#1e88e5" weight="duotone" /> Détails de la Réclamation
          </h2>

          <div className="detail-section">
            <p><TextAlignLeft size={22} color="#3949ab" /><strong>Contenu :</strong> {reclamation.contenu}</p>

            <p className="statut-wrapper">
              <strong>Statut :</strong>
              <span className={`status-badge ${reclamation.statut.toLowerCase()}`}>
                {reclamation.statut === "EN_ATTENTE" && "🕓 En attente"}
                {reclamation.statut === "TRAITEE" && "🔧 Traitée"}
                {reclamation.statut === "RESOLUE" && "✅ Résolue"}
              </span>
            </p>

            <p><Calendar size={22} color="#0288d1" /><strong>Date de soumission :</strong> {new Date(reclamation.dateSoumission).toLocaleString()}</p>
            <p><Hourglass size={22} color="#0288d1" /><strong>ID Utilisateur :</strong> {reclamation.userId}</p>
          </div>

          <div className="question-section">
            <h3><ListBullets size={22} color="#6a1b9a" weight="duotone" /> Historique des Statuts</h3>
            {reclamation.historique?.length > 0 ? (
              <ul>
                {reclamation.historique.map((h, i) => (
                  <li key={i}>
                    <strong>{new Date(h.dateModification).toLocaleString()}</strong> :
                    {` ${h.ancienStatut || "N/A"} → ${h.nouveauStatut}`}
                  </li>
                ))}
              </ul>
            ) : (
              <p>Aucun historique enregistré.</p>
            )}
          </div>
        </div>

        <div className="actions">
          <button className="return-button" onClick={() => navigate("/reclamations")}>
            <ArrowLeft size={22} weight="bold" /> Retour
          </button>
          <button className="export-button" onClick={generatePDF}>
            📄 Exporter PDF
          </button>
        </div>
      </div>
    </div>
  );
}

export default DetailReclamation;
