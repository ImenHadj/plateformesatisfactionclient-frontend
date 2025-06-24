import React, { useEffect } from "react";
import "./Dashboard.css";

const Dashboard = () => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Effet particules pour l'arrière-plan
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js';
      script.onload = () => {
        window.particlesJS('particles-js', {
          particles: {
            number: { value: 60, density: { enable: true, value_area: 800 } },
            color: { value: "#FF6B35" },
            shape: { type: "circle" },
            opacity: { value: 0.4, random: true },
            size: { value: 4, random: true },
            line_linked: { 
              enable: true, 
              distance: 150, 
              color: "#FFD166", 
              opacity: 0.3, 
              width: 1 
            },
            move: { 
              enable: true, 
              speed: 1.5, 
              direction: "none", 
              random: true, 
              straight: false, 
              out_mode: "out" 
            }
          }
        });
      };
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div className="dashboard-page">
      <div className="particles-container" id="particles-js"></div>
      <div className="luxury-overlay"></div>
      
      <div className="dashboard-header">
        <div className="bank-logo">
          <span className="logo-icon">💎</span>
          <span className="logo-text">WEALTH<span>BANK</span></span>
        </div>
        <h1>
          <span className="welcome-text">Executive Dashboard</span>
          <span className="bank-subtitle">Private Client Management</span>
        </h1>
      </div>
      
      <div className="dashboard-cards">
        {/* Carte 1 */}
        <div className="card creer" onClick={() => (window.location.href = "/create-enquete")}>
          <div className="card-inner">
            <div className="card-icon-container">
              <span className="emoji">📊</span>
              <div className="icon-halo"></div>
            </div>
            <h3>New Survey</h3>
            <p>Create customized client questionnaires</p>
            <div className="card-footer">
              <span>Access</span>
              <span className="emoji">🚀</span>
            </div>
          </div>
          <div className="card-glow"></div>
          <div className="card-shine"></div>
        </div>
        
        {/* Carte 2 */}
        <div className="card lister" onClick={() => (window.location.href = "/enquetes")}>
          <div className="card-inner">
            <div className="card-icon-container">
              <span className="emoji">🔍</span>
              <div className="icon-halo"></div>
            </div>
            <h3>Data Insights</h3>
            <p>Analyze client feedback trends</p>
            <div className="card-footer">
              <span>Explore</span>
              <span className="emoji">📈</span>
            </div>
          </div>
          <div className="card-glow"></div>
          <div className="card-shine"></div>
        </div>
        
        {/* Carte 3 */}
        <div className="card stats" onClick={() => (window.location.href = "/rapports")}>
          <div className="card-inner">
            <div className="card-icon-container">
              <span className="emoji">📉</span>
              <div className="icon-halo"></div>
            </div>
            <h3>Analytics</h3>
            <p>Interactive data visualization</p>
            <div className="card-footer">
              <span>Visualize</span>
              <span className="emoji">🎯</span>
            </div>
          </div>
          <div className="card-glow"></div>
          <div className="card-shine"></div>
        </div>
        
        {/* Carte 4 */}
        <div className="card users" onClick={() => (window.location.href = "/utilisateurs")}>
          <div className="card-inner">
            <div className="card-icon-container">
              <span className="emoji">🔐</span>
              <div className="icon-halo"></div>
            </div>
            <h3>Security</h3>
            <p>Access control & permissions</p>
            <div className="card-footer">
              <span>Configure</span>
              <span className="emoji">⚙️</span>
            </div>
          </div>
          <div className="card-glow"></div>
          <div className="card-shine"></div>
        </div>
      </div>
      
      <div className="dashboard-footer">
        <p>Enterprise-grade security • <span>Platinum Edition</span> • Strictly confidential</p>
        <div className="footer-emojis">💳 🏦 🛡️ 💼</div>
      </div>
    </div>
  );
};

export default Dashboard;