import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./FormUtilisateur.css";

function ModifierUtilisateur() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [error, setError] = useState("");

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
    axios.put(`http://localhost:8083/api/auth/users/${id}`, form)
      .then(() => navigate("/utilisateurs"))
      .catch(() => setError("Erreur lors de la modification"));
  };

  if (!form) return <div className="loading">Chargement...</div>;

  return (
    <div className="detail-container">
      <div className="detail-card">
        <h2 className="detail-title">✏️ Modifier l'utilisateur</h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="form-style">
          <label>
            Nom d'utilisateur
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Email
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Rôle
            <select name="role" value={form.role} onChange={handleChange}>
              <option value="ROLE_Client">Client</option>
              <option value="ROLE_AgentBancaire">Agent bancaire</option>
              <option value="ROLE_ADMIN">Administrateur</option>
            </select>
          </label>

          <label className="checkbox-wrapper">
            <input
              type="checkbox"
              name="active"
              checked={form.active}
              onChange={handleChange}
            />
            Actif
          </label>

          <button type="submit" className="modifier-button">Enregistrer</button>
          <button type="button" className="return-button" onClick={() => navigate("/utilisateurs")}>
  Retour à la liste
</button>

        </form>
      </div>
    </div>
  );
}

export default ModifierUtilisateur;
