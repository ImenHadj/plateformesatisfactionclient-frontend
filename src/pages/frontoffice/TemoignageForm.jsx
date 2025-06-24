import React, { useState } from "react";
import axios from "axios";

// Définition du composant StarRating
const StarRating = ({ value, onChange }) => {
  return (
    <div style={{ fontSize: '30px', color: '#ffd700', lineHeight: '1' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          style={{ 
            cursor: 'pointer',
            color: star <= value ? '#ffd700' : '#ddd',
            transition: 'color 0.2s'
          }}
          onClick={() => onChange(star)}
        >
          ★
        </span>
      ))}
    </div>
  );
};

// Composant principal TemoignageForm
const TemoignageForm = () => {
  const [commentaire, setCommentaire] = useState("");
  const [note, setNote] = useState(0);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8083/api/temoignages/submit", 
        { commentaire, note },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`
          }
        }
      );
      setCommentaire("");
      setNote(0);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error("Erreur lors de l'envoi du témoignage :", error);
    }
  };

  return (
    <div style={{
      background: 'white',
      padding: '25px',
      borderRadius: '10px',
      boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
      maxWidth: '500px',
      margin: '0 auto'
    }}>
      <h3 style={{ marginTop: 0, color: '#333' }}>Donner votre avis</h3>
      
      <textarea
        value={commentaire}
        onChange={(e) => setCommentaire(e.target.value)}
        placeholder="Votre commentaire..."
        required
        style={{
          width: '100%',
          minHeight: '120px',
          padding: '12px',
          border: '1px solid #ddd',
          borderRadius: '6px',
          fontSize: '16px',
          marginBottom: '20px'
        }}
      />
      
      <div style={{ 
        margin: '25px 0',
        textAlign: 'center'
      }}>
        <StarRating value={note} onChange={setNote} />
        <div style={{ 
          marginTop: '8px',
          fontSize: '14px',
          color: '#666'
        }}>
          {note > 0 ? `Vous avez donné ${note} étoile(s)` : 'Sélectionnez une note'}
        </div>
      </div>
      
      <button
        type="submit"
        onClick={handleSubmit}
        style={{
          background: '#FF6B35',
          color: 'white',
          border: 'none',
          padding: '12px 25px',
          borderRadius: '6px',
          fontSize: '16px',
          cursor: 'pointer',
          width: '100%',
          transition: 'background 0.3s'
        }}
      >
        Envoyer le témoignage
      </button>
      
      {success && (
        <div style={{
          color: 'green',
          marginTop: '15px',
          textAlign: 'center',
          fontWeight: 'bold'
        }}>
          ✓ Merci pour votre avis !
        </div>
      )}
    </div>
  );
};

export default TemoignageForm;