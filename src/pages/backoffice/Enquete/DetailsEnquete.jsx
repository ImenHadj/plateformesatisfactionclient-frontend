import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import html2pdf from "html2pdf.js";
import {
  ClipboardText, TextAlignLeft, Calendar, CheckCircle,
  Hourglass, ArrowLeft, Question, ListBullets
} from "phosphor-react";
import "./DetailEnquete.css";

function DetailEnquete() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [enquete, setEnquete] = useState(null);
  const [error, setError] = useState("");
  const [remainingTime, setRemainingTime] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token || !user?.roles?.includes("ROLE_ADMIN")) {
      setError("Accès interdit. Seuls les administrateurs peuvent consulter cette page.");
      return;
    }

    axios
      .get(`http://localhost:8083/admin/enquetes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => setEnquete(res.data))
      .catch(() => setError("Erreur lors du chargement de l'enquête."));
  }, [id]);

  useEffect(() => {
    if (enquete?.statut === "PUBLIEE") {
      const interval = setInterval(() => {
        const now = new Date();
        const end = new Date(enquete.dateExpiration);
        const diff = end - now;

        if (diff <= 0) {
          setRemainingTime("⏳ Enquête expirée");
          clearInterval(interval);
        } else {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
          const minutes = Math.floor((diff / (1000 * 60)) % 60);
          setRemainingTime(`${days}j ${hours}h ${minutes}m restantes`);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [enquete]);

  const remainingTimeColor = (() => {
    const matches = remainingTime.match(/(\d+)j (\d+)h/);
    if (!matches) return "safe";
    const days = parseInt(matches[1], 10);
    const hours = parseInt(matches[2], 10);

    if (days === 0 && hours <= 6) return "urgent";
    if (days <= 1) return "warning";
    return "safe";
  })();

  const handleProlonger = async () => {
    const token = localStorage.getItem("jwt");
    const nouvelleDate = new Date();
    nouvelleDate.setDate(nouvelleDate.getDate() + 7);

    try {
      await axios.put(`http://localhost:8083/admin/enquetes/update/${id}`, {
        ...enquete,
        dateExpiration: nouvelleDate.toISOString()
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("✅ Date d'expiration prolongée !");
      window.location.reload();
    } catch (err) {
      alert("❌ Erreur lors de la prolongation.");
    }
  };

  const generatePDF = () => {
    const element = document.getElementById("pdf-content");
    html2pdf().set({
      margin: 0.4,
      filename: `enquete-${enquete.id}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" }
    }).from(element).save();
  };
   const handleDelete = async () => {
    const confirmed = window.confirm("⚠️ Êtes-vous sûr de vouloir supprimer cette enquête ?");
    if (!confirmed) return;

    const token = localStorage.getItem("jwt");

    try {
      await axios.delete(`http://localhost:8083/admin/enquetes/delete/${enquete.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("✅ Enquête supprimée !");
      navigate("/enquetes");
    } catch (err) {
      alert("❌ Erreur lors de la suppression.");
    }
  };


  if (error) return <div className="error-message">{error}</div>;
  if (!enquete) return <div className="loading">Chargement...</div>;

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
            <ClipboardText size={26} color="#1e88e5" weight="duotone" /> Détails de l’Enquête
          </h2>

          <div className="detail-section">
            <p><TextAlignLeft size={22} color="#3949ab" weight="duotone" /><strong>Titre :</strong> {enquete.titre}</p>
            <p><TextAlignLeft size={22} color="#3949ab" weight="duotone" /><strong>Description :</strong> {enquete.description}</p>

            <p className="statut-wrapper">
              <strong>Statut :</strong>
              <span className={`status-badge ${enquete.statut.toLowerCase()}`}>
                {enquete.statut === "PUBLIEE" && "✅ Publiée"}
                {enquete.statut === "BROUILLON" && "📝 Brouillon"}
                {enquete.statut === "EXPIREE" && "⏰ Expirée"}
              </span>
            </p>

            {enquete.statut === "PUBLIEE" && (
              <div className={`countdown-card ${remainingTimeColor}`}>
                <div className="countdown-header">
                  ⏳ <span>Temps restant avant expiration</span>
                </div>
                <div className="countdown-time">{remainingTime}</div>
              </div>
            )}

            <p><Calendar size={22} color="#0288d1" weight="duotone" /><strong>Créée :</strong> {new Date(enquete.dateCreation).toLocaleString()}</p>
            <p><Calendar size={22} color="#0288d1" weight="duotone" /><strong>Publication :</strong> {new Date(enquete.datePublication).toLocaleString()}</p>
            <p><Hourglass size={22} color="#f4511e" weight="duotone" /><strong>Expiration :</strong> {new Date(enquete.dateExpiration).toLocaleString()}</p>
          </div>

          <div className="question-section">
            <h3><Question size={22} color="#6a1b9a" weight="duotone" /> Questions</h3>
            {enquete.questions.length > 0 ? (
              <ul>
                {enquete.questions.map((q, i) => (
                  <li key={i}>
                    <strong>{q.texte}</strong> <span className="type-question">({q.type})</span>
                    {q.options?.length > 0 && (
                      <ul className="options-list">
                        {q.options.map((opt, idx) => (
                          <li key={idx}>
                            <ListBullets size={18} color="#78909c" /> {opt}
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p>Aucune question enregistrée.</p>
            )}
          </div>
        </div>

        <div className="actions">
          <button className="return-button" onClick={() => navigate("/enquetes")}>
            <ArrowLeft size={22} weight="bold" /> Retour
          </button>

          <button
            className="modifier-button"
            onClick={() => navigate(`/enquete/modifier/${enquete.id}`)}
          >
            ✏️ Modifier l’enquête
          </button>

          {enquete.statut === "EXPIREE" && (
            <button className="prolonger-button" onClick={handleProlonger}>
              🔄 Prolonger la date d'expiration
            </button>
          )}

          <button className="export-button" onClick={generatePDF}>
            📄 Exporter PDF
          </button>
          <button className="delete-button" onClick={handleDelete}>
            🗑️ Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}

export default DetailEnquete;
