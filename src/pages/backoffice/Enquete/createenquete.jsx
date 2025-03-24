import React, { useState, useEffect } from "react";
import { Button, TextField, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import { motion } from "framer-motion";
import Layout from "../../../components/Layout";
import { FaPlusCircle, FaSave } from "react-icons/fa";
import { TypeQuestion } from "./TypeQuestion";
import axios from "axios";
import './CreateEnqueteForm.css';

const CreateEnqueteForm = () => {
  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [dateExpiration, setDateExpiration] = useState("");
  const [datePublication, setDatePublication] = useState("");  // Date de publication ajoutée
  const [questions, setQuestions] = useState([{ texte: "", type: "OUVERT", options: [] }]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminId, setAdminId] = useState(null);

  useEffect(() => {
    // Vérifier si les informations de l'utilisateur sont présentes dans localStorage
    const userInfo = localStorage.getItem("user");  // Récupérer les données de l'utilisateur
    const jwtToken = localStorage.getItem("jwt");  // Récupérer le token JWT

    if (userInfo && jwtToken) {
      const user = JSON.parse(userInfo);  // Convertir les données JSON en objet JavaScript
      console.log("User info from localStorage:", user); // Débogage: Afficher les données utilisateur

      setAdminId(user.id);
      setIsAdmin(user.roles && user.roles.includes("ROLE_ADMIN"));
      console.log("Admin ID:", user.id); // Vérification de l'ID de l'admin
      console.log("Is Admin:", user.roles.includes("ROLE_ADMIN")); // Vérification si l'utilisateur est admin
    } else {
      console.log("No user info or JWT token found in localStorage");
    }
  }, []);  // useEffect sans dépendances pour s'exécuter une seule fois au montage du composant

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const updatedQuestions = [...questions];
    updatedQuestions[index][name] = value;
    setQuestions(updatedQuestions);
  };

  const addQuestion = () => {
    setQuestions([...questions, { texte: "", type: "OUVERT", options: [] }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Vérifier si l'utilisateur est un admin
    if (!isAdmin) {
      alert("Vous devez être un administrateur pour créer une enquête.");
      return;
    }

    if (!adminId) {
      alert("Admin non trouvé. Veuillez vous reconnecter.");
      return;
    }

    // Données à envoyer pour la création de l'enquête
    const enqueteData = {
      titre,
      description,
      dateExpiration,
      datePublication, // Inclure la date de publication
      admin: { id: adminId },
      questions,
    };

    // Vérification du token JWT
    const token = localStorage.getItem("jwt");
    if (!token) {
      alert("Token JWT non trouvé. Vous devez vous reconnecter.");
      return;
    }

    try {
      // Envoi de la requête avec le token dans l'en-tête Authorization
      const response = await axios.post("http://localhost:9090/admin/enquetes/create", enqueteData, {
        headers: {
          Authorization: `Bearer ${token}`, // Ajouter le token JWT dans l'en-tête Authorization
        },
        withCredentials: true, // Assurez-vous que cette option est activée si vous utilisez les cookies
      });

      if (response.status === 201) {
        alert("Enquête créée avec succès !");
      }
    } catch (error) {
      console.error("Erreur lors de la création de l'enquête", error);
      alert("Une erreur est survenue lors de la création de l'enquête");
    }
  };

  return (
    <Layout>
      <motion.div
        className="create-enquete-form"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <motion.h2
          className="form-title"
          animate={{
            x: ["-100%", "100%"], // Glissement à gauche et à droite
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            repeatType: "loop",
            ease: "linear",
          }}
        >
          Créer une Enquête
        </motion.h2>

        <form onSubmit={handleSubmit} className="enquete-form">
          <TextField
            label="Titre de l'Enquête"
            variant="outlined"
            fullWidth
            margin="normal"
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
            required
            className="form-field"
            InputProps={{
              startAdornment: <FaPlusCircle style={{ marginRight: 10 }} />,
            }}
          />
          <TextField
            label="Description"
            variant="outlined"
            fullWidth
            margin="normal"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="form-field"
            InputProps={{
              startAdornment: <FaPlusCircle style={{ marginRight: 10 }} />,
            }}
          />
          <TextField
            label="Date d'Expiration"
            variant="outlined"
            type="datetime-local"
            fullWidth
            margin="normal"
            value={dateExpiration}
            onChange={(e) => setDateExpiration(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            required
            className="form-field"
          />

          {/* Nouveau champ pour la date de publication */}
          <TextField
            label="Date de Publication"
            variant="outlined"
            type="datetime-local"
            fullWidth
            margin="normal"
            value={datePublication}
            onChange={(e) => setDatePublication(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            required
            className="form-field"
          />

          {questions.map((question, index) => (
            <div key={index} className="question-form">
              <TextField
                label="Texte de la question"
                variant="outlined"
                fullWidth
                margin="normal"
                name="texte"
                value={question.texte}
                onChange={(e) => handleChange(e, index)}
                required
                className="form-field"
              />
              <FormControl fullWidth margin="normal" required className="form-field">
                <InputLabel>Type de Question</InputLabel>
                <Select
                  name="type"
                  value={question.type}
                  onChange={(e) => handleChange(e, index)}
                  label="Type de Question"
                >
                  {Object.keys(TypeQuestion).map((key) => (
                    <MenuItem key={key} value={TypeQuestion[key]}>
                      {TypeQuestion[key]}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {question.type === "CHOIX_SIMPLE" || question.type === "CHOIX_MULTIPLE" ? (
                <TextField
                  label="Options (séparées par une virgule)"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  name="options"
                  value={question.options.join(", ")}
                  onChange={(e) => {
                    const options = e.target.value.split(",").map((option) => option.trim());
                    handleChange({ target: { name: "options", value: options } }, index);
                  }}
                />
              ) : null}

              {question.type === "SLIDER" ? (
                <TextField
                  label="Valeur Min/Max"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  name="slider"
                  value={question.slider || ""}
                  onChange={(e) => handleChange(e, index)}
                />
              ) : null}

              {question.type === "DATE" ? (
                <TextField
                  label="Sélectionner une date"
                  type="date"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  name="date"
                  value={question.date || ""}
                  onChange={(e) => handleChange(e, index)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              ) : null}
            </div>
          ))}

          <Button
            variant="contained"
            color="primary"
            onClick={addQuestion}
            startIcon={<FaPlusCircle />}
            className="add-question-button"
          >
            Ajouter une Question
          </Button>

          <Button
            variant="contained"
            color="secondary"
            type="submit"
            startIcon={<FaSave />}
            className="submit-button"
          >
            Créer l'Enquête
          </Button>
        </form>
      </motion.div>
    </Layout>
  );
};

export default CreateEnqueteForm;
