import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Eye, PencilLine, Trash2, Power, ShieldCheck, UserRound, Building2,
  ArrowUpCircle, Download, RefreshCw
} from "lucide-react";
import "./ListeUtilisateursUltraTable.css";

function ListeUtilisateursUltraTable() {
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [recherche, setRecherche] = useState("");
  const [filtreRole, setFiltreRole] = useState("ALL");
  const [filtreStatut, setFiltreStatut] = useState("ALL");
  const [page, setPage] = useState(1);
  const [utilisateurASupprimer, setUtilisateurASupprimer] = useState(null);
  const navigate = useNavigate();
  const utilisateursParPage = 5;

  useEffect(() => {
    chargerUtilisateurs();
  }, []);

  const chargerUtilisateurs = () => {
    axios.get("http://localhost:8083/api/auth/users")
      .then(res => setUtilisateurs(res.data))
      .catch(err => console.error(err));
  };

  const confirmerSuppression = () => {
    if (!utilisateurASupprimer) return;
    axios.delete(`http://localhost:8083/api/auth/users/${utilisateurASupprimer}`)
      .then(() => {
        setUtilisateurASupprimer(null);
        chargerUtilisateurs();
      });
  };

  const toggleActif = (id) => {
    axios.put(`http://localhost:8083/api/auth/users/${id}/toggle-active`)
      .then(() => chargerUtilisateurs());
  };

  const resetFiltres = () => {
    setRecherche("");
    setFiltreRole("ALL");
    setFiltreStatut("ALL");
  };

  const exportCSV = () => {
    const headers = ["Nom", "Email", "Rôle", "Statut"];
    const rows = utilisateursFiltres.map(u => [u.username, u.email, u.role, u.active ? "Actif" : "Inactif"]);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "utilisateurs.csv");
    link.click();
  };

  const utilisateursFiltres = utilisateurs
    .filter(u =>
      (u.username?.toLowerCase().includes(recherche.toLowerCase()) ||
        u.email?.toLowerCase().includes(recherche.toLowerCase()))
    )
    .filter(u =>
      filtreRole === "ALL" || u.role === filtreRole
    )
    .filter(u =>
      filtreStatut === "ALL" || (filtreStatut === "ACTIF" ? u.active : !u.active)
    );

  const totalPages = Math.ceil(utilisateursFiltres.length / utilisateursParPage);
  const utilisateursPage = utilisateursFiltres.slice((page - 1) * utilisateursParPage, page * utilisateursParPage);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="ultra-container">
      <div className="table-toolbar">
        <input
          type="text"
          placeholder="Recherche par nom ou email..."
          value={recherche}
          onChange={e => setRecherche(e.target.value)}
        />
        <select onChange={e => setFiltreRole(e.target.value)} value={filtreRole}>
          <option value="ALL">Tous les rôles</option>
          <option value="ROLE_ADMIN">Administrateurs</option>
          <option value="ROLE_CLIENT">Clients</option>
          <option value="ROLE_AGENTBANCAIRE">Agents bancaires</option>
        </select>
        <select onChange={e => setFiltreStatut(e.target.value)} value={filtreStatut}>
          <option value="ALL">Tous les statuts</option>
          <option value="ACTIF">Actifs</option>
          <option value="INACTIF">Inactifs</option>
        </select>
        <button onClick={() => navigate("/utilisateurs/ajouter")}>➕ Ajouter</button>
        <button onClick={resetFiltres} title="Réinitialiser les filtres"><RefreshCw size={18} color="#555" /></button>
        <button onClick={exportCSV} title="Exporter en CSV"><Download size={18} color="#0d9488" /></button>
      </div>

      <div style={{ marginBottom: "10px" }}><strong>Total :</strong> {utilisateursFiltres.length} utilisateurs</div>

      <table className="ultra-table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Email</th>
            <th>Rôle</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {utilisateursPage.map((user, index) => (
            <motion.tr
              key={user.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.01 }}
            >
              <td>{user.username || "N/A"}</td>
              <td>{user.email || "N/A"}</td>
              <td>
                {(() => {
                  const role = user.role;
                  if (!role) return <span className="badge">N/A</span>;
                  if (role === "ROLE_ADMIN") return <span className="badge publiee" title="Admin"><ShieldCheck color="#2563eb" size={18} /> Admin</span>;
                  if (role === "ROLE_AGENTBANCAIRE") return <span className="badge brouillon" title="Agent bancaire"><Building2 color="#f59e0b" size={18} /> Agent</span>;
                  if (role === "ROLE_CLIENT") return <span className="badge expiree" title="Client"><UserRound color="#10b981" size={18} /> Client</span>;
                  return <span className="badge">{role.replace("ROLE_", "")}</span>;
                })()}
              </td>
              <td>
                <span
                  className={`badge ${user.active ? "publiee" : "expiree"}`}
                  title={user.active ? "Actif" : "Inactif"}
                >
                  {user.active ? "Actif" : "Inactif"}
                </span>
              </td>
              <td>
                <button onClick={() => navigate(`/utilisateurs/${user.id}`)} title="Voir"><Eye color="#3b82f6" size={18} /></button>
                <button onClick={() => navigate(`/utilisateurs/modifier/${user.id}`)} title="Modifier"><PencilLine color="#6366f1" size={18} /></button>
                <button onClick={() => toggleActif(user.id)} title="Activer/Désactiver"><Power color="#facc15" size={18} /></button>
                <button onClick={() => setUtilisateurASupprimer(user.id)} title="Supprimer"><Trash2 color="#ef4444" size={18} /></button>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>

      {utilisateursFiltres.length === 0 && (
        <div className="no-results">Aucun utilisateur ne correspond à la recherche.</div>
      )}

      <div className="pagination">
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i + 1}
            className={page === i + 1 ? "active" : ""}
            onClick={() => setPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {utilisateurASupprimer !== null && (
        <div className="modal">
          <div className="modal-box">
            <h3>Confirmer la suppression ?</h3>
            <div className="modal-actions">
              <button onClick={confirmerSuppression}>Oui</button>
              <button onClick={() => setUtilisateurASupprimer(null)}>Annuler</button>
            </div>
          </div>
        </div>
      )}

      <button className="back-to-top" onClick={scrollToTop} title="Retour en haut">
        <ArrowUpCircle size={20} color="#1f2937" />
      </button>
    </div>
  );
}

export default ListeUtilisateursUltraTable;
