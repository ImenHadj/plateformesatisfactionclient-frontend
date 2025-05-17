import React from "react";
import { FaPlusCircle, FaListAlt, FaChartPie } from "react-icons/fa";
import "./Dashboard.css";

const Dashboard = () => {
  return (
    <div className="dashboard-page">
      <h2>Bienvenue sur votre BackOffice</h2>
      <div className="dashboard-cards">
        <div className="card" onClick={() => window.location.href = "/create-enquete"}>
          <FaPlusCircle />
          <h3>Créer Enquête</h3>
          <p>Lancer une nouvelle enquête et collecter des retours.</p>
        </div>
        <div className="card" onClick={() => window.location.href = "/enquetes"}>
          <FaListAlt />
          <h3>Voir Enquêtes</h3>
          <p>Gérer et suivre toutes vos enquêtes existantes.</p>
        </div>
        <div className="card" onClick={() => window.location.href = "/rapports"}>
          <FaChartPie />
          <h3>Rapports & Stats</h3>
          <p>Analyser vos résultats en un clic.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
