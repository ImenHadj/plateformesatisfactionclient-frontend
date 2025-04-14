import React, { useState } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Typography } from '@mui/material';
import './style.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setMessage("Veuillez entrer une adresse email valide.");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:9090/api/auth/forgot-password`,
        null,
        {
          params: { email },
          headers: { "Content-Type": "application/json" },
        }
      );

      setMessage("Un email de réinitialisation a été envoyé !");
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'email", error);
      setMessage("Erreur lors de l'envoi de l'email");
    }
  };

  return (
    <div className="wrapper">
      <Container maxWidth="xs" className="login-container">
        <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: 2, color: 'white' }}>
          Forgot Password
        </Typography>

        <Typography variant="body2" align="center" sx={{ color: '#ddd', marginBottom: 2 }}>
          Entrez votre email pour réinitialiser votre mot de passe
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            fullWidth
            required
            margin="normal"
            value={email}
            onChange={handleChange}
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
            Send Reset Link
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

export default ForgotPassword;
