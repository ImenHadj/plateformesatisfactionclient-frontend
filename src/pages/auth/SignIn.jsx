import React, { useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { Container, TextField, Button, Box, Typography, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './style.css';

const CLIENT_ID = '678352302593-efqco2fe19sb705grc97nni2q8k8q49p.apps.googleusercontent.com';

const SignIn = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState(""); // Etat pour gérer l'erreur

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post('http://localhost:9090/api/auth/signin', {
            username: formData.email,
            password: formData.password,
        }, {
            withCredentials: true,  // Assurez-vous que cette option est activée pour inclure le cookie
        });

        console.log("Réponse du backend :", response.data);

        // Vérifier si le token et les informations de l'utilisateur sont bien reçus
        if (response.data && response.data.jwt && response.data.user) {
            const { jwt, user } = response.data;

            // Stocker le token et les informations dans le stockage local
            localStorage.setItem("jwt", jwt);
            localStorage.setItem("user", JSON.stringify(user));

            alert("Connexion réussie !");
            navigate("/dashboard");  // Redirection après connexion réussie
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
      const res = await fetch("http://localhost:9090/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();  // Récupérer les données de la réponse (JWT et informations utilisateur)
        console.log("Réponse du serveur Google :", data);

        if (data.jwt && data.user) {
            const { jwt, user } = data;

            // Stocker le token et les informations utilisateur dans localStorage
            localStorage.setItem("jwt", jwt);
            localStorage.setItem("user", JSON.stringify(user));

            alert("Connexion Google réussie !");
            navigate("/dashboard");
        } else {
            console.error("Échec de la connexion Google");
            setErrorMessage("Échec de la connexion Google.");
        }
      } else {
        console.error("Échec de l'authentification Google");
        setErrorMessage("Échec de la connexion Google.");
      }
    } catch (error) {
      console.error("Erreur lors de la connexion avec Google :", error);
      setErrorMessage("Erreur lors de la connexion avec Google.");
    }
  };

  const handleGoogleError = () => {
    console.error("Erreur de connexion avec Google.");
    setErrorMessage("Échec de la connexion avec Google.");
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', position: 'relative' }}>
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
        {errorMessage && (
          <Typography variant="body2" sx={{ color: 'red', marginBottom: 2 }}>
            {errorMessage}
          </Typography>
        )}
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
