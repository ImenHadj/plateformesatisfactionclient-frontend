import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function DetailEnquete() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [enquete, setEnquete] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    // Vérification plus robuste de l'ID
    if (!id || id === "null" || id === "undefined") {
      setError("❌ ID de l'enquête invalide ou manquant.");
      return;
    }

    const token = localStorage.getItem("jwt");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token || !user || !user.roles?.includes("ROLE_ADMIN")) {
      setError("❌ Accès refusé. Vous devez être un administrateur connecté.");
      return;
    }

    axios
      .get(`http://localhost:9090/admin/enquetes/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        // Vérification basique des données reçues
        if (!res.data || !res.data.id) {
          throw new Error("Données de l'enquête invalides");
        }
        setEnquete(res.data);
      })
      .catch((err) => {
        console.error("Erreur chargement enquête:", err);
        setError(err.response?.data?.message || 
                err.message || 
                "Erreur lors du chargement de l'enquête.");
      });
  }, [id]);

  if (error) return <p style={{ color: "red", margin: "20px" }}>{error}</p>;
  if (!enquete) return <p>⏳ Chargement en cours...</p>;

  return (
    <div className="container mt-4">
      <h2>📋 Détails de l'Enquête</h2>
      <p><strong>Titre :</strong> {enquete.titre}</p>
      <p><strong>Description :</strong> {enquete.description}</p>
      <p><strong>Statut :</strong> {enquete.statut}</p>
      <p><strong>Date de création :</strong> {new Date(enquete.dateCreation).toLocaleString()}</p>
      <p><strong>Date de publication :</strong> {new Date(enquete.datePublication).toLocaleString()}</p>
      <p><strong>Date d'expiration :</strong> {new Date(enquete.dateExpiration).toLocaleString()}</p>

      <h4>📑 Questions :</h4>
      {enquete.questions?.length > 0 ? (
        <ul>
          {enquete.questions.map((q, i) => (
            <li key={`question-${enquete.id}-${q.id || `index-${i}`}`}>
              {q.texte} ({q.type})
              {q.options?.length > 0 && (
                <ul>
                  {q.options.map((opt, idx) => (
                    <li key={`option-${q.id || `q-${i}`}-${idx}`}>{opt}</li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>Aucune question dans cette enquête</p>
      )}

      <button 
        onClick={() => navigate("/admin/enquetes")} 
        className="btn btn-primary mt-3"
      >
        ⬅️ Retour à la liste
      </button>
    </div>
  );
}

export default DetailEnquete;