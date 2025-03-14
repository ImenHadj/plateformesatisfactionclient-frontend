import React, { useState } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Box, Typography } from '@mui/material';
import './style.css'; // Assurez-vous d'avoir le bon fichier CSS pour le style

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !newPassword) {
      setMessage('Veuillez remplir tous les champs.');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:9090/api/auth/reset-password',
        null,
        { params: { email, newPassword } }
      );

      setMessage(response.data);  // Affiche le message de succès
    } catch (error) {
      console.error('Erreur lors de la réinitialisation du mot de passe', error);
      setMessage('Erreur lors de la réinitialisation du mot de passe.');
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
          Réinitialiser le mot de passe
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            fullWidth
            required
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ backgroundColor: 'white', borderRadius: 2 }}
          />

          <TextField
            label="Nouveau mot de passe"
            fullWidth
            required
            type="password"
            margin="normal"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            sx={{ backgroundColor: 'white', borderRadius: 2 }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              marginTop: 2,
              backgroundColor: '#FF6347',  // Utilisation d'une couleur spécifique
              color: 'white',
              borderRadius: 2,
            }}
          >
            Réinitialiser le mot de passe
          </Button>
        </form>

        {message && (
          <Typography variant="body2" align="center" sx={{ marginTop: 2, color: 'white' }}>
            {message}
          </Typography>
        )}
      </Container>
    </Box>
  );
};

export default ResetPassword;
