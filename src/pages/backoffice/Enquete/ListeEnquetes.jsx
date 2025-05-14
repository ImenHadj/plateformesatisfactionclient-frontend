import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ListeEnquetes.css";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

function ListeEnquetes() {
  const [enquetes, setEnquetes] = useState([]);
  const [selectedEnquete, setSelectedEnquete] = useState(null);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = localStorage.getItem("user");
    const token = localStorage.getItem("jwt");

    if (!userInfo || !token) {
      setError("Vous devez être connecté.");
      return;
    }

    const user = JSON.parse(userInfo);
    const isAdminRole = user.roles?.includes("ROLE_ADMIN");
    setIsAdmin(isAdminRole);

    if (isAdminRole) {
      axios
        .get("http://localhost:8083/admin/enquetes", {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        })
        .then((res) => setEnquetes(res.data))
        .catch((err) => {
          console.error("Erreur Axios :", err);
          setError(err.response?.data || err.message);
        });
    } else {
      setError("Accès refusé. Vous n'êtes pas administrateur.");
    }
  }, []);

  const handleDelete = async (id) => {
    const confirm = window.confirm("Voulez-vous vraiment supprimer cette enquête ?");
    if (!confirm) return;

    const token = localStorage.getItem("jwt");
    try {
      await axios.delete(`http://localhost:8083/admin/enquetes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEnquetes(enquetes.filter((e) => e.id !== id));
      alert("Enquête supprimée !");
    } catch (err) {
      console.error("Erreur suppression :", err);
      alert("Erreur lors de la suppression.");
    }
  };

  if (error) return <div className="error-message">{error}</div>;

  return (
    <motion.div
      className="create-enquete-form"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <nav className="navbar">
        <h2>Plateforme Satisfaction</h2>
        <div className="nav-links">
          <a href="/dashboard">Dashboard</a>
          <a href="/enquetes" className="active">Mes Enquêtes</a>
        </div>
      </nav>

      <div className="liste-enquetes-container">
        <h2>📋 Liste des Enquêtes</h2>

        {enquetes.length === 0 ? (
          <p className="text-center">Aucune enquête trouvée.</p>
        ) : (
          <div className="enquetes-cards-container">
            {enquetes.map((e, i) => (
              <motion.div
                className="enquete-card"
                key={e.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <div className="card-header">
                  <h4>{e.titre}</h4>
                  <span className={`badge ${e.statut === 'PUBLIÉE' ? 'bg-success' : e.statut === 'FERMÉE' ? 'bg-danger' : 'bg-secondary'}`}>
                    {e.statut}
                  </span>
                </div>
                <p className="description">{e.description}</p>
                <div className="card-dates">
                  <p><strong>Création :</strong> {new Date(e.dateCreation).toLocaleString()}</p>
                  <p><strong>Expiration :</strong> {new Date(e.dateExpiration).toLocaleString()}</p>
                  <p><strong>Publication :</strong> {new Date(e.datePublication).toLocaleString()}</p>
                </div>
                <div className="card-actions">
                  <Button onClick={() => navigate(`/enquetes/${e.id}`)} variant="contained" color="primary" size="small" startIcon={<FaEye />}>Voir</Button>
                  <Button onClick={() => navigate(`/enquete/modifier/${e.id}`)} variant="contained" color="secondary" size="small" startIcon={<FaEdit />}>Modifier</Button>
                  <Button onClick={() => handleDelete(e.id)} variant="contained" color="error" size="small" startIcon={<FaTrash />}>Supprimer</Button>
                  <Button variant="text" size="small" onClick={() => setSelectedEnquete(e)}>+ Détails rapides</Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {selectedEnquete && (
          <div className="selected-enquete-detail">
            <h4>📌 Détails de l'enquête :</h4>
            <p><strong>Titre :</strong> {selectedEnquete.titre}</p>
            <p><strong>Description :</strong> {selectedEnquete.description}</p>
            <p><strong>Statut :</strong> {selectedEnquete.statut}</p>
            <p><strong>Date de création :</strong> {new Date(selectedEnquete.dateCreation).toLocaleString()}</p>
            <p><strong>Date de publication :</strong> {new Date(selectedEnquete.datePublication).toLocaleString()}</p>
            <p><strong>Date d’expiration :</strong> {new Date(selectedEnquete.dateExpiration).toLocaleString()}</p>

            <h5>📑 Questions :</h5>
            <ul className="ms-3">
              {selectedEnquete.questions.map((q, idx) => (
                <li key={idx}>
                  <strong>{q.texte}</strong> ({q.type})
                  {q.options?.length > 0 && (
                    <ul>
                      {q.options.map((opt, i) => (
                        <li key={i}>{opt}</li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default ListeEnquetes;
