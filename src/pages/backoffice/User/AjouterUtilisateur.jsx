import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./FormUtilisateur.css";

function AjouterUtilisateur() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    role: "ROLE_Client",
    active: true,
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    
    axios.post("http://localhost:8083/api/auth/users", form)
      .then(() => {
        navigate("/utilisateurs");
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Erreur lors de la création de l'utilisateur");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <h2 className="form-title">👤 Ajouter un Utilisateur</h2>
        
        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="user-form">
          <div className="form-group">
            <label>
              <span className="input-label">👔 Nom d'utilisateur</span>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Entrez le nom complet..."
                required
                className="form-input"
              />
            </label>
          </div>

          <div className="form-group">
            <label>
              <span className="input-label">✉️ Email</span>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="exemple@domaine.com"
                required
                className="form-input"
              />
            </label>
          </div>

          <div className="form-group">
            <label>
              <span className="input-label">🎭 Rôle</span>
              <select 
                name="role" 
                value={form.role} 
                onChange={handleChange}
                className="form-select"
              >
                <option value="ROLE_Client">👤 Client</option>
                <option value="ROLE_AgentBancaire">🏦 Agent bancaire</option>
                <option value="ROLE_ADMIN">👑 Administrateur</option>
              </select>
            </label>
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="active"
                checked={form.active}
                onChange={handleChange}
                className="checkbox-input"
              />
              <span className="checkbox-custom"></span>
              <span className="checkbox-text">{form.active ? "✅ Actif" : "❌ Inactif"}</span>
            </label>
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? "⏳ Création..." : "✨ Créer l'utilisateur"}
            </button>
            
            <button 
              type="button" 
              className="cancel-button" 
              onClick={() => navigate("/utilisateurs")}
            >
              ↩️ Retour à la liste
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AjouterUtilisateur;