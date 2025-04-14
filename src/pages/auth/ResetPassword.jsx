import React, { useState } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Typography } from '@mui/material';
import './style.css';

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
      setMessage(response.data);
    } catch (error) {
      console.error('Erreur lors de la réinitialisation du mot de passe', error);
      setMessage('Erreur lors de la réinitialisation du mot de passe.');
    }
  };

  return (
    <div className="wrapper">
      <Container maxWidth="xs" className="login-container">
        <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: 2, color: 'white' }}>
          Réinitialiser le mot de passe
        </Typography>

        <Typography variant="body2" align="center" sx={{ color: '#ddd', marginBottom: 2 }}>
          Entrez votre email et nouveau mot de passe
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            fullWidth
            required
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              style: {
                color: 'white',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: 12,
              },
            }}
            slotProps={{
              inputLabel: {
                style: {
                  color: 'white',
                  fontWeight: 'bold',
                },
              },
            }}
          />

          <TextField
            label="Nouveau mot de passe"
            type="password"
            fullWidth
            required
            margin="normal"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            InputProps={{
              style: {
                color: 'white',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: 12,
              },
            }}
            slotProps={{
              inputLabel: {
                style: {
                  color: 'white',
                  fontWeight: 'bold',
                },
              },
            }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              marginTop: 2,
              backgroundColor: '#FF6347',
              color: 'white',
              borderRadius: 12,
              fontWeight: 'bold',
              padding: '12px 0',
              '&:hover': {
                backgroundColor: '#e5533d'
              }
            }}
          >
            Réinitialiser
          </Button>
        </form>

        {message && (
          <Typography variant="body2" align="center" sx={{ marginTop: 2, color: '#eee' }}>
            {message}
          </Typography>
        )}
      </Container>
    </div>
  );
};

export default ResetPassword;
