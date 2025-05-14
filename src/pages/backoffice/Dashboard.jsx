import React from "react";
import "./Dashboard.css";

const Dashboard = () => {
  return (
    <div className="dashboard-bg">
      <nav className="navbar">
        <div className="navbar-left">
          <img src="/images/logo attijari.jpg" alt="Logo" className="navbar-logo" />
          <h2>MySolar Project</h2>
        </div>
        <div className="nav-links">
          <a href="#">Inventory</a>
          <a href="#">Events</a>
          <a href="#">Documents</a>
          <a href="#" className="active">Photos</a>
          <a href="#">Reports</a>
        </div>
      </nav>

      <div className="glass-card">
        <h3>Photos</h3>
        <div className="photo-grid">
          <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=500&q=60" alt="img1" />
          <img src="https://images.unsplash.com/photo-1508921912186-1d1a45ebb3c1?auto=format&fit=crop&w=500&q=60" alt="img2" />
          <img src="https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=500&q=60" alt="img3" />
          <img src="https://images.unsplash.com/photo-1610878180933-34f06c7f2433?auto=format&fit=crop&w=500&q=60" alt="img4" />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
