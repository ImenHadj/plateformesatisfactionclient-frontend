import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./FormUtilisateur.css";

function ModifierUtilisateur() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    axios.get(`http://localhost:8083/api/auth/users/${id}`)
      .then(res => setForm(res.data))
      .catch(() => setError("Utilisateur introuvable"));
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    
    axios.put(`http://localhost:8083/api/auth/users/${id}`, form)
      .then(() => navigate("/utilisateurs"))
      .catch((err) => {
        setError(err.response?.data?.message || "Erreur lors de la modification");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  if (!form) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Chargement de l'utilisateur...</p>
      </div>
    );
  }

  return (
    <div className="form-container">
      <div className="form-card">
        <h2 className="form-title">✏️ Modifier l'Utilisateur</h2>
        
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
              {isSubmitting ? "⏳ Enregistrement..." : "💾 Enregistrer"}
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

export default ModifierUtilisateur;