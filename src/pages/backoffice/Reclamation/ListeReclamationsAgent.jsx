import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { saveAs } from "file-saver";
import "./ListeReclamations.css";

function ListeReclamations() {
  const [reclamations, setReclamations] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [statutFilter, setStatutFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    axios
      .get("http://localhost:8083/api/reclamations", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setReclamations(res.data);
        setFiltered(res.data);
      });
  }, []);

  useEffect(() => {
    let data = [...reclamations];
    if (search.trim()) {
      data = data.filter((r) =>
        r.contenu.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (statutFilter !== "ALL") {
      data = data.filter((r) => r.statut === statutFilter);
    }
    setFiltered(data);
    setCurrentPage(1);
  }, [search, statutFilter, reclamations]);

  const paginated = filtered.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const totalPages = Math.ceil(filtered.length / rowsPerPage);

  const getProgress = (statut) => {
    if (statut === "RESOLUE") return 100;
    if (statut === "EN_ATTENTE") return 30;
    return 60;
  };

  const exportCSV = () => {
    const rows = [["Contenu", "Statut", "Soumise le"]];
    filtered.forEach((r) =>
      rows.push([
        r.contenu,
        r.statut,
        new Date(r.dateSoumission).toLocaleDateString(),
      ])
    );
    const content = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([content], { type: "text/csv;charset=utf-8" });
    saveAs(blob, "reclamations.csv");
  };

  return (
    <div className="ultra-container">
      <div className="table-toolbar">
        <input
          type="text"
          placeholder="🔍 Rechercher une réclamation..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select onChange={(e) => setStatutFilter(e.target.value)} value={statutFilter}>
          <option value="ALL">Tous les statuts</option>
          <option value="EN_ATTENTE">🕓 En attente</option>
          <option value="TRAITEE">🔧 Traitée</option>
          <option value="RESOLUE">✅ Résolue</option>
        </select>
        <button onClick={exportCSV}>⬇️ Exporter CSV</button>
        <button onClick={() => { setSearch(""); setStatutFilter("ALL"); }}>♻️ Réinitialiser</button>
      </div>

      <table className="ultra-table">
        <thead>
          <tr>
            <th>📝 Contenu</th>
            <th>📌 Statut</th>
            <th>📅 Soumise le</th>
            <th>% Avancement</th>
            <th>⚙️ Action</th>
          </tr>
        </thead>
        <tbody>
          {paginated.length > 0 ? (
            paginated.map((r) => (
              <tr key={r.id}>
                <td title={r.contenu}>{r.contenu}</td>
                <td>
                  <span className={`badge ${r.statut.toLowerCase()}`}>
                    {r.statut === "EN_ATTENTE" && "🕓 En attente"}
                    {r.statut === "TRAITEE" && "🔧 Traitée"}
                    {r.statut === "RESOLUE" && "✅ Résolue"}
                  </span>
                </td>
                <td>{new Date(r.dateSoumission).toLocaleDateString()}</td>
                <td>
                  <div className="circle">
                    <svg viewBox="0 0 36 36">
                      <path className="bg" d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                      <path
                        className={`progress ${getProgress(r.statut) > 60 ? "green" : getProgress(r.statut) > 30 ? "orange" : "red"}`}
                        strokeDasharray={`${getProgress(r.statut)}, 100`}
                        d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <text x="18" y="20.35" className="percentage">
                        {getProgress(r.statut)}%
                      </text>
                    </svg>
                  </div>
                </td>
                <td>
                  <button
                    className="action-button"
                    onClick={() => navigate(`/reclamations/${r.id}`)}
                  >
                    🔍 Détails
                  </button>
                  <button
                    className="action-button modifier"
                    onClick={() => navigate(`/reclamations/modifier/${r.id}`)}
                  >
                    ✏️ Modifier
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="no-results">😕 Aucun résultat trouvé.</td>
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
    </div>
  );
}

export default ListeReclamations;
