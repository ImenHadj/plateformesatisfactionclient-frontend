import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Box, Typography, MenuItem } from '@mui/material';
import './style.css'; // Assurez-vous d'importer votre fichier CSS ici

const Signup = () => {
  const [roles, setRoles] = useState([]);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "", // Le rôle est une chaîne, mais il sera envoyé dans un tableau
  });

  useEffect(() => {
    // Récupération des rôles depuis l'API
    axios.get("http://localhost:9090/api/auth/roles")
      .then(response => {
        // Assurez-vous que response.data est un tableau
        setRoles(response.data);
      })
      .catch(error => {
        console.error("Erreur lors de la récupération des rôles", error);
      });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Les mots de passe ne correspondent pas !");
      return;
    }

    const dataToSend = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      roles: [formData.role],  // Envoyer le rôle comme un tableau
    };

    try {
      await axios.post("http://localhost:9090/api/auth/signup", dataToSend);
      alert("Inscription réussie !");
    } catch (error) {
      console.error("Erreur d'inscription", error);
      alert("Échec de l'inscription");
    }
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
        <Typography variant="h5" align="center" sx={{ marginBottom: 2, color: 'white' }}>
          Sign Up
        </Typography>
        <Typography variant="body2" align="center" sx={{ color: 'white', marginBottom: 2 }}>
          Create your account
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Username"
            fullWidth
            required
            margin="normal"
            name="username"
            value={formData.username}
            onChange={handleChange}
            sx={{ backgroundColor: 'white', borderRadius: 2 }}
          />
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
          <TextField
            label="Confirm Password"
            type="password"
            fullWidth
            required
            margin="normal"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            sx={{ backgroundColor: 'white', borderRadius: 2 }}
          />

          {/* Champ de sélection du rôle */}
          <TextField
            select
            label="Select Role"
            fullWidth
            required
            margin="normal"
            name="role"
            value={formData.role}
            onChange={handleChange}
            sx={{ backgroundColor: 'white', borderRadius: 2 }}
          >
            {roles.map((role, index) => (
              <MenuItem key={index} value={role}>
                {role}
              </MenuItem>
            ))}
          </TextField>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              marginTop: 2,
              backgroundColor: '#FF6347',
              color: 'white',
              borderRadius: 2
            }}
          >
            Sign Up Now
          </Button>
        </form>

        <Typography variant="body2" align="center" sx={{ marginTop: 2 }}>
          Already have an account?{' '}
          <a href="/signin" style={{ textDecoration: 'none', color: 'white' }}>
            Login here
          </a>
        </Typography>
      </Container>
    </Box>
  );
};

export default Signup;
