import React, { useEffect, useState } from 'react';
import './landing.css';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleJoinUs = () => {
    navigate('/signup');
  };

  const handleReadMore = () => {
    const section = document.getElementById('attijari-description');
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 80,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in-visible');
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.3 }
    );

    const target = document.querySelector('.attijari-section');
    if (target) observer.observe(target);
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const images = [
    '/images/satisfait1.jpg',
    '/images/satisfait2.jpg',
    '/images/satisfaction.jpg'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="landing-abstract">
      <div className="overlay"></div>

      {/* Navbar */}
      <header className="abstract-navbar">
        <div className="logo">
          <img src="/images/logo1.png" alt="Logo" className="logo-img animated-logo" />
        </div>
        <nav className="nav-links">
          <a href="#home">Home</a>
          <a href="#profile" className="active">Profile</a>
          <a href="#gallery">Gallery</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      {/* Hero section modern layout */}
      <main className="abstract-hero">
        <div className="hero-grid">
          <div className="hero-text fade-in">
            <h1>À PROPOS D'ATTIJARI BANK</h1>
            <div className="button-group">
              <button className="read-btn" onClick={handleReadMore}>READ MORE</button>
              <button className="join-btn" onClick={handleJoinUs}>JOIN US</button>
            </div>
          </div>

          <div className="hero-image">
            <img src={images[currentIndex]} alt="Slider" className="slider-image" />
          </div>
        </div>
      </main>

      {/* Descriptif complet sur le côté */}
      <section id="attijari-description" className="attijari-section side-panel fade-in">
        <div className="attijari-content">
          <h2>À propos d'Attijari Bank</h2>
          <p>
            Attijari bank est une banque universelle, filiale du groupe Attijariwafa bank, premier groupe bancaire et financier au Maghreb. 
            Présente en Tunisie depuis plusieurs décennies, elle offre une large gamme de services bancaires aux particuliers, professionnels et entreprises. 
            Forte de ses valeurs de proximité, d'innovation et de responsabilité, elle accompagne ses clients dans leurs projets quotidiens comme professionnels.
          </p>
          <p>
            Avec un réseau étendu d'agences et une plateforme digitale performante, Attijari bank s'engage pour une finance inclusive, responsable 
            et tournée vers l’avenir. Son engagement citoyen se manifeste aussi à travers diverses actions sociales, culturelles et éducatives menées en Tunisie.
          </p>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
