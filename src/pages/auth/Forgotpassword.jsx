import React, { useState } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Box, Typography } from '@mui/material';
import './style.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState(""); // Utilisation de 'email' pour l'état
  const [message, setMessage] = useState(""); // État pour afficher les messages

  const handleChange = (e) => {
    setEmail(e.target.value); // Met à jour l'email
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Vérifier si l'email est bien rempli
    if (!email) {
      setMessage("Veuillez entrer une adresse email valide.");
      return;
    }

    console.log("Email envoyé au backend:", email);  // Vérifier que l'email est correctement récupéré

    try {
      // Modifier ici pour envoyer l'email comme paramètre de requête
      const response = await axios.post(
        `http://localhost:9090/api/auth/forgot-password`, // L'URL reste la même
        null,  // Pas de corps de requête
        {
          params: { email }, // Envoi de l'email comme paramètre de requête
          headers: { "Content-Type": "application/json" }, // Indique que le contenu est du JSON
        }
      );

      console.log("Réponse:", response.data); // Log de la réponse du backend
      setMessage("Un email de réinitialisation a été envoyé !");
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'email", error);
      setMessage("Erreur lors de l'envoi de l'email");
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        position: 'relative',
      }}
    >
      <Container
              maxWidth="xs"
              className="login-container"
              sx={{
                background: 'linear-gradient(45deg, #FF7F50, #FF6347)',
                borderRadius: 4,
                padding: 4,
                boxShadow: 3,
              }}
            >
        <Typography variant="h5" align="center" sx={{ marginBottom: 2, color: 'white' }}>
          Forgot Password
        </Typography>
        <Typography variant="body2" align="center" sx={{ color: 'white', marginBottom: 2 }}>
          Entrez votre email pour réinitialiser votre mot de passe
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            fullWidth
            required
            margin="normal"
            value={email}
            onChange={handleChange} // Gestion du changement de l'email
            sx={{ backgroundColor: 'white', borderRadius: 2 }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              marginTop: 2,
              backgroundColor: '#FF6347',
              color: 'white',
              borderRadius: 2,
            }}
          >
            Send Reset Link
          </Button>
        </form>

        {message && (
          <Typography variant="body2" align="center" sx={{ marginTop: 2, color: 'white' }}>
            {message} {/* Affichage du message dynamique */}
          </Typography>
        )}
      </Container>
    </Box>
  );
};

export default ForgotPassword;
