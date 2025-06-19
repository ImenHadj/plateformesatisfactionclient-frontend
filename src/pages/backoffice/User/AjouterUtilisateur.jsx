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
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = (e) => {
  e.preventDefault();
  console.log("Données envoyées:", form);
  axios.post("http://localhost:8083/api/auth/users", form)
    .then(() => navigate("/utilisateurs"))
    .catch(() => setError("Erreur lors de la création de l'utilisateur."));
};


  return (
    <div className="detail-container">
      <div className="detail-card">
        <h2 className="detail-title">➕ Ajouter un Utilisateur</h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="form-style">
          <label>
            Nom d'utilisateur
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Entrez le nom..."
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
              placeholder="example@mail.com"
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

          <button type="submit" className="modifier-button">Créer l'utilisateur</button>
          <button type="button" className="return-button" onClick={() => navigate("/utilisateurs")}>
  Retour à la liste
</button>


        </form>
      </div>
    </div>
  );
}

export default AjouterUtilisateur;
