import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ShieldCheck, UserRound, Building2, ArrowLeft } from "lucide-react";
import "./DetailUtilisateur.css";

function DetailUtilisateur() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [utilisateur, setUtilisateur] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    axios.get(`http://localhost:8083/api/auth/users/${id}`)
      .then(res => setUtilisateur(res.data))
      .catch(err => setError("Impossible de charger les informations de l'utilisateur."));
  }, [id]);

  const supprimerUtilisateur = () => {
    if (window.confirm("Confirmer la suppression de cet utilisateur ?")) {
      axios.delete(`http://localhost:8083/api/auth/users/${id}`)
        .then(() => navigate("/utilisateurs"));
    }
  };

  if (error) return <div className="error-message">{error}</div>;
  if (!utilisateur) return <div className="loading">Chargement...</div>;

  const getBadge = (role) => {
    switch (role) {
      case "ROLE_ADMIN": return <span className="status-badge publiee"><ShieldCheck size={16} /> Admin</span>;
      case "ROLE_CLIENT": return <span className="status-badge expiree"><UserRound size={16} /> Client</span>;
      case "ROLE_AGENTBANCAIRE": return <span className="status-badge brouillon"><Building2 size={16} /> Agent bancaire</span>;
      default: return <span className="status-badge">{role}</span>;
    }
  };

  return (
    <div className="detail-container">
      <div className="detail-card">
        <h2 className="detail-title">
          👤 Détail de l'utilisateur
        </h2>

        <div className="detail-section">
          <p><strong>Nom d'utilisateur :</strong> {utilisateur.username}</p>
          <p><strong>Email :</strong> {utilisateur.email}</p>
          <p className="statut-wrapper"><strong>Rôle :</strong> {getBadge(utilisateur.role)}</p>
          <p className="statut-wrapper">
            <strong>Statut :</strong>
            <span className={`status-badge ${utilisateur.active ? "publiee" : "expiree"}`}>
              {utilisateur.active ? "Actif" : "Inactif"}
            </span>
          </p>
        </div>

        <div style={{ marginTop: "2rem" }}>
          <button className="return-button" onClick={() => navigate("/utilisateurs")}> <ArrowLeft size={18} /> Retour</button>
          <button className="modifier-button" onClick={() => navigate(`/utilisateurs/modifier/${utilisateur.id}`)}>Modifier</button>
          <button className="delete-button" onClick={supprimerUtilisateur}>Supprimer</button>
        </div>
      </div>
    </div>
  );
}

export default DetailUtilisateur;
