import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ListeEnquetes.css";
import { useNavigate } from "react-router-dom";

function ListeEnquetes() {
  const [enquetes, setEnquetes] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [statutFilter, setStatutFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState("dateCreation");
  const [sortAsc, setSortAsc] = useState(false);
  const [modalId, setModalId] = useState(null);
  const rowsPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    axios
      .get("http://localhost:8083/admin/enquetes", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setEnquetes(res.data);
        setFiltered(res.data);
      });
  }, []);

  useEffect(() => {
    let data = [...enquetes];
    if (search.trim()) {
      data = data.filter(
        (e) =>
          e.titre.toLowerCase().includes(search.toLowerCase()) ||
          e.description.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (statutFilter !== "ALL") {
      data = data.filter((e) => e.statut === statutFilter);
    }
    setFiltered(data);
    setCurrentPage(1);
  }, [search, statutFilter, enquetes]);

  const sortedData = [...filtered].sort((a, b) => {
    const valA = new Date(a[sortKey]);
    const valB = new Date(b[sortKey]);
    return sortAsc ? valA - valB : valB - valA;
  });

  const paginated = sortedData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  const totalPages = Math.ceil(filtered.length / rowsPerPage);

  const getProgress = (e) => {
    if (e.statut !== "PUBLIEE") return 0;
    const total = new Date(e.dateExpiration) - new Date(e.datePublication);
    const remain = new Date(e.dateExpiration) - new Date();
    return Math.max(0, Math.min(100, Math.floor((remain / total) * 100)));
  };

  const handleSort = (key) => {
    if (key === sortKey) setSortAsc(!sortAsc);
    else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const exportCSV = () => {
    const rows = [["Titre", "Statut", "Date de création", "Expiration"]];
    filtered.forEach((e) =>
      rows.push([
        e.titre,
        e.statut,
        new Date(e.dateCreation).toLocaleDateString(),
        new Date(e.dateExpiration).toLocaleDateString(),
      ])
    );
    const content = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([content], { type: "text/csv;charset=utf-8" });
    saveAs(blob, "enquetes.csv");
  };

  const confirmDelete = (id) => {
    const token = localStorage.getItem("jwt");
    axios
      .delete(`http://localhost:8083/admin/enquetes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setEnquetes(enquetes.filter((e) => e.id !== id));
        setModalId(null);
      });
  };

  const isRecent = (dateStr) => {
    return (new Date() - new Date(dateStr)) / (1000 * 3600 * 24) < 3;
  };

  return (
    <div className="ultra-container">
      <div className="table-toolbar">
        <input
          type="text"
          placeholder="🔍 Rechercher une enquête..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select onChange={(e) => setStatutFilter(e.target.value)} value={statutFilter}>
          <option value="ALL">Tous les statuts</option>
          <option value="PUBLIEE">✅ Publiée</option>
          <option value="BROUILLON">📝 Brouillon</option>
          <option value="EXPIREE">⏰ Expirée</option>
        </select>
        <button onClick={exportCSV}>⬇️ Exporter CSV</button>
        <button onClick={() => { setSearch(""); setStatutFilter("ALL"); }}>♻️ Réinitialiser</button>
      </div>

      <table className="ultra-table">
        <thead>
          <tr>
            <th onClick={() => handleSort("titre")}>📄 Titre</th>
            <th>Statut</th>
            <th onClick={() => handleSort("dateCreation")}>📅 Créée</th>
            <th>📆 Expiration</th>
            <th>% Restant</th>
          </tr>
        </thead>
        <tbody>
          {paginated.length > 0 ? (
            paginated.map((e) => (
              <tr key={e.id} onClick={() => navigate(`/enquetes/${e.id}`)}>
                <td title={e.titre}>
                  {e.titre}
                  {isRecent(e.dateCreation) && <span className="new-badge">🆕</span>}
                </td>
                <td>
                  <span className={`badge ${e.statut.toLowerCase()}`}>
                    {e.statut === "PUBLIEE" && "✅ Publiée"}
                    {e.statut === "BROUILLON" && "📝 Brouillon"}
                    {e.statut === "EXPIREE" && "⏰ Expirée"}
                  </span>
                </td>
                <td>{new Date(e.dateCreation).toLocaleDateString()}</td>
                <td>{new Date(e.dateExpiration).toLocaleDateString()}</td>
                <td>
                  <div className="circle">
                    <svg viewBox="0 0 36 36">
                      <path className="bg" d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831" />
                      <path
                        className={`progress ${getProgress(e) > 60 ? 'green' : getProgress(e) > 30 ? 'orange' : 'red'}`}
                        strokeDasharray={`${getProgress(e)}, 100`}
                        d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <text x="18" y="20.35" className="percentage">
                        {getProgress(e)}%
                      </text>
                    </svg>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="no-results">
                😕 Aucun résultat trouvé.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={currentPage === i + 1 ? "active" : ""}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <button className="back-to-top" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
        ⬆️
      </button>

      {modalId && (
        <div className="modal">
          <div className="modal-box">
            <h3>⚠️ Confirmation</h3>
            <p>Supprimer cette enquête ?</p>
            <div className="modal-actions">
              <button onClick={() => confirmDelete(modalId)}>✅ Confirmer</button>
              <button onClick={() => setModalId(null)}>❌ Annuler</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ListeEnquetes;
