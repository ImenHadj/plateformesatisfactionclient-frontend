import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Typography, MenuItem } from '@mui/material';
import './style.css';

const Signup = () => {
  const [roles, setRoles] = useState([]);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  useEffect(() => {
    axios.get("http://localhost:8083/api/auth/roles")
    .then(response => {
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
      roles: [formData.role],
    };

    try {
      await axios.post("http://localhost:8083/api/auth/signup", dataToSend);
      alert("Inscription réussie !");
    } catch (error) {
      console.error("Erreur d'inscription", error);
      alert("Échec de l'inscription");
    }
  };

  return (
    <div className="wrapper">
      <Container maxWidth="xs" className="login-container">
        <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: 2, color: 'white' }}>
          Sign Up
        </Typography>

        <Typography variant="body2" align="center" sx={{ color: '#ddd', marginBottom: 2 }}>
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

          <TextField
            label="Confirm Password"
            type="password"
            fullWidth
            required
            margin="normal"
            name="confirmPassword"
            value={formData.confirmPassword}
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
            select
            label="Select Role"
            fullWidth
            required
            margin="normal"
            name="role"
            value={formData.role}
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
          >
            {roles.map((role, index) => (
              <MenuItem key={index} value={role} sx={{ color: 'black' }}>
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
              borderRadius: 12,
              fontWeight: 'bold',
              padding: '12px 0',
              '&:hover': {
                backgroundColor: '#e5533d'
              }
            }}
          >
            Sign Up Now
          </Button>
        </form>

        <Typography variant="body2" align="center" sx={{ marginTop: 2, color: '#eee' }}>
          Already have an account?{' '}
          <a href="/signin" style={{ textDecoration: 'underline', color: 'white' }}>
            Login here
          </a>
        </Typography>
      </Container>
    </div>
  );
};

export default Signup;
