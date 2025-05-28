import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "./AccueilClient.css";
import Navbar from "../../components/Navbar";

const AccueilClient = () => {
  return (
    <>
      <Navbar />

      <div className="hero-section">
        <motion.div
          className="hero-content"
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h1>Create A Happy And Safe Life</h1>
          <p>
            Discover a better way to share feedback and make your voice heard.
            Our platform makes it easy to submit and track your claims.
          </p>
          <div className="hero-buttons">
            <Link to="/creer-reclamation" className="btn-orange">Submit a Claim</Link>
            <Link to="/enquete/respond/1" className="btn-transparent">Take a Survey</Link>
          </div>
        </motion.div>
      </div>

      <div className="highlight-section">
        <div className="highlight-box">
          <h2>97%</h2>
          <p>Satisfied Users</p>
        </div>
        <div className="highlight-box">
          <h2>5 Years</h2>
          <p>Experience</p>
        </div>
        <div className="highlight-box">
          <h2>+250</h2>
          <p>Surveys & Claims Processed</p>
        </div>
      </div>

      <div className="section-content">
        <div className="text-content">
          <h2>Take Control Of Your Satisfaction</h2>
          <p>
            We believe your opinion matters. Our platform was created to empower clients to
            speak up and receive responses that matter.
          </p>
          <Link to="/creer-reclamation" className="btn-orange">Get Started</Link>
        </div>
        <div className="image-content">
          <img src="/assets/frontoffice/client-writing.png" alt="Client writing feedback" />
        </div>
      </div>
    </>
  );
};

export default AccueilClient;
