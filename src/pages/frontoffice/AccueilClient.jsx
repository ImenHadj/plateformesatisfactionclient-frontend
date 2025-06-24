import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import "./AccueilClient.css";
import Navbar from "../../components/Navbar";
import TemoignageForm from "./TemoignageForm";
import axios from "axios";

const Particle = ({ size, x, y, duration, delay }) => {
  return (
    <motion.div
      className="particle"
      initial={{ opacity: 0 }}
      animate={{
        x: [x, x + 100],
        y: [y, y - 200],
        opacity: [0, 1, 0],
        scale: [0.5, 1.2, 0.3]
      }}
      transition={{
        duration: duration,
        delay: delay,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut"
      }}
      style={{
        width: size,
        height: size,
        background: `rgba(255, 107, 53, ${Math.random() * 0.5 + 0.1})`,
        borderRadius: "50%",
        position: "absolute"
      }}
    />
  );
};

const AccueilClient = () => {
  const controls = useAnimation();
  const sectionRef = useRef();
  const [hoveredCard, setHoveredCard] = useState(null);
  const [temoignages, setTemoignages] = useState([]);

  // Génération de particules
  const particles = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    size: `${Math.random() * 10 + 5}px`,
    x: `${Math.random() * 100}vw`,
    y: `${Math.random() * 100}vh`,
    duration: Math.random() * 10 + 10,
    delay: Math.random() * 5
  }));

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          controls.start("visible");
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [controls]);

  const stats = [
    { value: "97%", label: "Satisfaction clients", icon: "😊", color: "#FF6B35" },
    { value: "48h", label: "Temps moyen de réponse", icon: "⚡", color: "#FF9E1B" },
    { value: "5★", label: "Expérience utilisateur", icon: "🌟", color: "#FF8C5A" }
  ];

  useEffect(() => {
    const fetchTemoignages = async () => {
      try {
        const response = await axios.get("http://localhost:8083/api/temoignages", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`
          }
        });
        setTemoignages(response.data);
      } catch (error) {
        console.error("Erreur lors du chargement des témoignages:", error);
      }
    };

    fetchTemoignages();
  }, []);

  return (
    <div className="client-app">
      {/* Animated Background Elements */}
      <div className="bg-elements">
        <div className="bg-circle bg-circle-1"></div>
        <div className="bg-circle bg-circle-2"></div>
        <div className="bg-circle bg-circle-3"></div>
        <div className="bg-grid"></div>
        
        <div className="particles">
          {particles.map((particle) => (
            <Particle key={particle.id} {...particle} />
          ))}
        </div>
      </div>

      <Navbar />

      {/* Hero Section */}
      <section className="hero-section" ref={sectionRef}>
        <div className="hero-container">
          <motion.div 
            className="hero-content"
            initial="hidden"
            animate={controls}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.2 }
              }
            }}
          >
            <motion.div
              variants={{
                hidden: { y: 40, opacity: 0 },
                visible: { 
                  y: 0, 
                  opacity: 1,
                  transition: { 
                    type: "spring", 
                    stiffness: 100,
                    damping: 10
                  }
                }
              }}
            >
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <motion.span
                  initial={{ x: -50 }}
                  animate={{ x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Banque digitale
                </motion.span>
                <motion.span 
                  className="text-highlight"
                  initial={{ x: 50 }}
                  animate={{ x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  {" "}moderne
                </motion.span>
              </motion.h1>
              
              <motion.p 
                className="hero-subtitle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Une relation client repensée pour une expérience bancaire
                <strong> fluide, transparente et humaine</strong>
              </motion.p>
            </motion.div>

            <motion.div 
              className="hero-actions"
              variants={{
                hidden: { y: 30, opacity: 0 },
                visible: { 
                  y: 0, 
                  opacity: 1,
                  transition: { delay: 0.6 }
                }
              }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  to="/creer-reclamation" 
                  className="btn btn-primary"
                >
                  <span className="btn-icon">✍️</span>
                  Soumettre une réclamation
                </Link>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link 
                  to="/client/enquetes" 
                  className="btn btn-secondary"
                >
                  <span className="btn-icon">📊</span>
                  Participer à une enquête
                </Link>
              </motion.div>
            </motion.div>

            <motion.div 
              className="hero-stats"
              variants={{
                hidden: { y: 30, opacity: 0 },
                visible: { 
                  y: 0, 
                  opacity: 1,
                  transition: { delay: 0.8 }
                }
              }}
            >
              {stats.map((stat, index) => (
                <motion.div 
                  key={index}
                  className="stat-item"
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="stat-value" style={{ color: stat.color }}>
                    {stat.value}
                  </div>
                  <div className="stat-label">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div 
            className="hero-visual"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.8, type: "spring", stiffness: 60 }}
          >
            <div className="floating-cards">
              <motion.div 
                className="card card-primary card-3d"
                animate={{
                  y: [0, -15, 0],
                  rotateZ: [0, 2, 0]
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 25px 50px rgba(255, 107, 53, 0.4)"
                }}
              >
                <div className="card-badge">Nouveau</div>
                <h3>Interface 3.0</h3>
                <p>Plus intuitive que jamais</p>
              </motion.div>
              
              <motion.div 
                className="card card-secondary card-3d"
                animate={{
                  y: [0, -20, 0],
                  rotateZ: [0, -2, 0]
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 25px 50px rgba(255, 158, 27, 0.4)"
                }}
              >
                <div className="card-badge">Rapide</div>
                <h3>85%</h3>
                <p>Réclamations traitées en 48h</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-container">
          <div className="features-grid">
            <motion.div 
              className="features-intro"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <h2>
                Une expérience client <span className="text-gradient">révolutionnaire</span>
              </h2>
              <p>
                Notre plateforme allie technologie de pointe et simplicité
                d'utilisation pour transformer votre relation bancaire.
              </p>
            </motion.div>

            <div className="features-list">
              {[
                {
                  icon: "🚀",
                  title: "Rapidité",
                  description: "Traitement accéléré de vos demandes",
                  color: "#FF6B35"
                },
                {
                  icon: "🔒",
                  title: "Sécurité",
                  description: "Protection maximale de vos données",
                  color: "#FF9E1B"
                },
                {
                  icon: "💎",
                  title: "Exclusivité",
                  description: "Services réservés à nos clients",
                  color: "#FF8C5A"
                },
                {
                  icon: "📱",
                  title: "Mobile First",
                  description: "Accès depuis tous vos appareils",
                  color: "#D35F24"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="feature-card"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  viewport={{ once: true, margin: "-100px" }}
                  whileHover={{ 
                    y: -10,
                    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)"
                  }}
                  onHoverStart={() => setHoveredCard(index)}
                  onHoverEnd={() => setHoveredCard(null)}
                  style={{ borderTopColor: feature.color }}
                >
                  <AnimatePresence>
                    {hoveredCard === index && (
                      <motion.div
                        className="feature-hover-effect"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        style={{
                          background: `radial-gradient(600px at ${feature.color}, rgba(255,255,255,0.3), transparent 80%)`,
                        }}
                      />
                    )}
                  </AnimatePresence>
                  
                  <motion.div 
                    className="feature-icon"
                    animate={{
                      rotate: hoveredCard === index ? [0, 10, -10, 0] : 0
                    }}
                    transition={{ duration: 0.6 }}
                    style={{ color: feature.color }}
                  >
                    {feature.icon}
                  </motion.div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="section-container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2>
              Témoignages <span className="text-highlight">clients</span>
            </h2>
            <p>Découvrez ce que nos clients disent de leur expérience</p>
          </motion.div>

          <div className="temoignage-form-wrapper">
            <TemoignageForm />
          </div>

          <div className="testimonials-grid">
            {temoignages.length === 0 ? (
              <p>Aucun témoignage pour l'instant.</p>
            ) : (
              temoignages.map((t) => (
                <motion.div
                  key={t.id}
                  className="testimonial-card"
                  initial={{ y: 30, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true, margin: "-100px" }}
                  whileHover={{
                    y: -5,
                    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)"
                  }}
                >
                  <div className="testimonial-rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span 
                        key={star}
                        style={{
                          color: star <= (t.note || 0) ? '#ffd700' : '#e0e0e0',
                          fontSize: '24px',
                          margin: '0 2px'
                        }}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="testimonial-text">{t.commentaire}</p>
                  <div className="testimonial-author">
                    <img
                      src="/assets/frontoffice/avatar-placeholder.jpg"
                      alt="Client"
                    />
                    <div>
                      <h4>Client</h4>
                      <p>{new Date(t.dateSoumission).toLocaleDateString("fr-FR")}</p>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="section-container">
          <motion.div
            className="cta-content"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.h2
              animate={{
                scale: [1, 1.02, 1],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              Prêt à vivre une nouvelle expérience bancaire ?
            </motion.h2>
            <p>Rejoignez notre communauté de clients satisfaits dès aujourd'hui</p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                to="/creer-reclamation" 
                className="btn btn-primary btn-large"
              >
                Commencer maintenant
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AccueilClient;