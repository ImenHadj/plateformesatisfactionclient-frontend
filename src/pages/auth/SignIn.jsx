import React, { useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { Container, TextField, Button, Box, Typography, Divider } from '@mui/material';
import './style.css'; // Assurez-vous d'importer votre fichier CSS

const CLIENT_ID = '678352302593-efqco2fe19sb705grc97nni2q8k8q49p.apps.googleusercontent.com';

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:9090/api/auth/signin", {
        username: formData.email,
        password: formData.password,
      });

      if (response.data && response.data.accessToken) {
        sessionStorage.setItem('authToken', response.data.accessToken);
        alert("Connexion réussie !");
      } else {
        alert("Échec de la connexion, aucun token reçu.");
      }
    } catch (error) {
      console.error("Erreur lors de la connexion", error);
      alert("Erreur de connexion. Vérifiez vos informations.");
    }
  };

  const handleGoogleSuccess = async (response) => {
    const idToken = response.credential;
    console.log("Google ID Token reçu :", idToken);

    try {
      const res = await fetch('http://localhost:9090/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      });

      const data = await res.text();

      if (res.ok) {
        console.log("Connexion Google réussie :", data);
        sessionStorage.setItem('authToken', data);
        alert("Connexion Google réussie !");
      } else {
        console.error("Échec de l'authentification :", data);
        alert("Échec de la connexion Google.");
      }
    } catch (error) {
      console.error("Erreur lors de la connexion Google :", error);
      alert("Erreur lors de la connexion avec Google.");
    }
  };

  const handleGoogleError = () => {
    console.error("Erreur de connexion avec Google.");
    alert("Échec de la connexion avec Google.");
  };

  return (
    <Box
          sx={{
            minHeight: '100vh',
            bgcolor: 'background.default',
            position: 'relative' // Assurez-vous que Box est en position relative
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
        <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: 2, color: 'white' }}>
          Sign In
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Email"
            fullWidth
            required
            margin="normal"
            name="email"
            value={formData.email}
            onChange={handleChange}
            sx={{ backgroundColor: 'white', borderRadius: 2 }}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            required
            margin="normal"
            name="password"
            value={formData.password}
            onChange={handleChange}
            sx={{ backgroundColor: 'white', borderRadius: 2 }}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ marginTop: 2, backgroundColor: '#FF6347', color: 'white', borderRadius: 2 }}
          >
            Sign In
          </Button>
        </form>
        <Divider sx={{ marginY: 2, backgroundColor: 'white' }}>OU</Divider>
        <GoogleOAuthProvider clientId={CLIENT_ID}>
          <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} />
        </GoogleOAuthProvider>
        <Typography variant="body2" sx={{ marginTop: 2, color: 'white' }}>
          Don't have an account?{' '}
          <a href="/signup" style={{ textDecoration: 'none', color: 'white' }}>
            Sign up here
          </a>
        </Typography>
      </Container>
    </Box>
  );
};

export default SignIn;
