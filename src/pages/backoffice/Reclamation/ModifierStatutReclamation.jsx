import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./DetailReclamation.css"; // utilise le même CSS que les détails

function ModifierStatutReclamation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reclamation, setReclamation] = useState(null);
  const [nouveauStatut, setNouveauStatut] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    axios
      .get(`http://localhost:8083/api/reclamations/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setReclamation(res.data);
        setNouveauStatut(res.data.statut);
      })
      .catch(() => setError("❌ Impossible de charger la réclamation."));
  }, [id]);

  const handleUpdate = async () => {
    const token = localStorage.getItem("jwt");
    try {
      await axios.put(
        `http://localhost:8083/api/reclamations/${id}/statut`,
        null,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { statut: nouveauStatut },
        }
      );
      alert("✅ Statut mis à jour !");
      navigate("/reclamations");
    } catch {
      alert("❌ Erreur lors de la mise à jour du statut.");
    }
  };

  if (error) return <div className="error-message">{error}</div>;
  if (!reclamation) return <div className="loading">Chargement...</div>;

  return (
    <div className="detail-container">
      <div className="detail-card">
        <h2 className="detail-title">🛠️ Modifier le statut</h2>

        <div className="detail-section">
          <p><strong>Contenu :</strong> {reclamation.contenu}</p>
          <p><strong>Date de soumission :</strong> {new Date(reclamation.dateSoumission).toLocaleString()}</p>
          <p>
            <strong>Statut actuel :</strong>
            <span className={`status-badge ${reclamation.statut.toLowerCase()}`}>
              {reclamation.statut}
            </span>
          </p>

          <label style={{ marginTop: "1.5rem" }}>
            <strong>🌀 Nouveau statut :</strong>
            <select
              value={nouveauStatut}
              onChange={(e) => setNouveauStatut(e.target.value)}
              style={{
                marginLeft: "1rem",
                padding: "8px 12px",
                fontSize: "1rem",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            >
              <option value="EN_ATTENTE">🕓 EN_ATTENTE</option>
              <option value="TRAITEE">🔧 TRAITEE</option>
              <option value="RESOLUE">✅ RESOLUE</option>
            </select>
          </label>
        </div>

        <div className="actions" style={{ marginTop: "2rem" }}>
          <button className="modifier-button" onClick={handleUpdate}>
            💾 Enregistrer
          </button>
          <button className="return-button" onClick={() => navigate("/reclamations")}>
            🔙 Retour
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModifierStatutReclamation;
