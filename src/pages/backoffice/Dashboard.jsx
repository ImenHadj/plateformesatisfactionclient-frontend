import React from "react";
import {
  PlusCircle,
  ListChecks,
  PieChart,
  Users,
} from "lucide-react";
import "./Dashboard.css";

const Dashboard = () => {
  return (
    <div className="dashboard-page">
      <h2>Bienvenue sur votre BackOffice</h2>
      <div className="dashboard-cards">
        <div
          className="card creer"
          onClick={() => (window.location.href = "/create-enquete")}
          tabIndex={0}
          role="button"
          aria-label="Créer Enquête"
        >
          <PlusCircle className="icon" />
          <h3>Créer Enquête</h3>
          <p>Lancer une nouvelle enquête et collecter des retours.</p>
        </div>
        <div
          className="card lister"
          onClick={() => (window.location.href = "/enquetes")}
          tabIndex={0}
          role="button"
          aria-label="Voir Enquêtes"
        >
          <ListChecks className="icon" />
          <h3>Voir Enquêtes</h3>
          <p>Gérer et suivre toutes vos enquêtes existantes.</p>
        </div>
        <div
          className="card stats"
          onClick={() => (window.location.href = "/rapports")}
          tabIndex={0}
          role="button"
          aria-label="Rapports & Stats"
        >
          <PieChart className="icon" />
          <h3>Rapports & Stats</h3>
          <p>Analyser vos résultats en un clic.</p>
        </div>
        <div
          className="card users"
          onClick={() => (window.location.href = "/utilisateurs")}
          tabIndex={0}
          role="button"
          aria-label="Gestion Utilisateurs"
        >
          <Users className="icon" />
          <h3>Gestion Utilisateurs</h3>
          <p>Ajouter, modifier ou désactiver des comptes utilisateurs.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
