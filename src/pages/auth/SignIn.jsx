import React, { useState } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './style.css';

const SignIn = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:9090/api/auth/signin', {
        username: formData.email,
        password: formData.password,
      }, { withCredentials: true });

      if (response.data && response.data.jwt && response.data.user) {
        const { jwt, user } = response.data;
        localStorage.setItem("jwt", jwt);
        localStorage.setItem("user", JSON.stringify(user));
        alert("Connexion réussie !");
        navigate("/dashboard");
      } else {
        alert("Échec de la connexion, aucun token reçu.");
      }
    } catch (error) {
      console.error("Erreur lors de la connexion", error);
      alert("Erreur de connexion. Vérifiez vos informations.");
    }
  };

  return (
    <div className="wrapper">
      <Container maxWidth="xs" className="login-container">
        <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: 2, color: 'white' }}>
          Sign In
        </Typography>

        <Typography variant="body2" align="center" sx={{ color: '#ddd', marginBottom: 2 }}>
          Welcome back! Please login
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
            label="Password"
            type="password"
            fullWidth
            required
            margin="normal"
            name="password"
            value={formData.password}
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

          {/* Forgot Password Link */}
          <Typography
            variant="body2"
            align="right"
            sx={{ color: '#eee', marginTop: 1, marginBottom: 1 }}
          >
            <a href="/forgot-password" style={{ color: 'white', textDecoration: 'underline' }}>
              Forgot password?
            </a>
          </Typography>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              marginTop: 1,
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
            Sign In
          </Button>
        </form>

        <Typography variant="body2" align="center" sx={{ marginTop: 2, color: '#eee' }}>
          Don't have an account?{' '}
          <a href="/signup" style={{ textDecoration: 'underline', color: 'white' }}>
            Sign up here
          </a>
        </Typography>
      </Container>
    </div>
  );
};

export default SignIn;
