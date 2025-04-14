import React, { useState, useEffect } from "react";
import { Button, TextField, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import { motion } from "framer-motion";
import { FaPlusCircle, FaSave } from "react-icons/fa";
import { TypeQuestion } from "./TypeQuestion";
import axios from "axios";
import './CreateEnqueteForm.css';

const CreateEnqueteForm = () => {
  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [dateExpiration, setDateExpiration] = useState("");
  const [datePublication, setDatePublication] = useState("");
  const [questions, setQuestions] = useState([{ texte: "", type: "OUVERT", options: [] }]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminId, setAdminId] = useState(null);

  useEffect(() => {
    const userInfo = localStorage.getItem("user");
    const jwtToken = localStorage.getItem("jwt");

    if (userInfo && jwtToken) {
      const user = JSON.parse(userInfo);
      setAdminId(user.id);
      setIsAdmin(user.roles && user.roles.includes("ROLE_ADMIN"));
    }
  }, []);

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

    if (!isAdmin || !adminId) {
      alert("Vous devez être un administrateur connecté.");
      return;
    }

    const enqueteData = {
      titre,
      description,
      dateExpiration,
      datePublication,
      admin: { id: adminId },
      questions,
    };

    const token = localStorage.getItem("jwt");

    if (!token) {
      alert("Token JWT non trouvé.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:9090/admin/enquetes/create", enqueteData, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      if (response.status === 201) {
        alert("Enquête créée avec succès !");
      }
    } catch (error) {
      console.error("Erreur lors de la création de l'enquête", error);
      alert("Une erreur est survenue.");
    }
  };

  return (
    <motion.div
      className="create-enquete-form"
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      <motion.h2
        className="form-title"
        animate={{
          x: ["-100%", "100%"],
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
          InputLabelProps={{ shrink: true }}
          required
          className="form-field"
        />

        <TextField
          label="Date de Publication"
          variant="outlined"
          type="datetime-local"
          fullWidth
          margin="normal"
          value={datePublication}
          onChange={(e) => setDatePublication(e.target.value)}
          InputLabelProps={{ shrink: true }}
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

            {(question.type === "CHOIX_SIMPLE" || question.type === "CHOIX_MULTIPLE") && (
              <div className="options-container">
                <TextField
                  label="Options (séparées par une virgule)"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={question.options.join(", ")}
                  onChange={(e) => {
                    const options = e.target.value.split(",").map((option) => option.trim());
                    handleChange({ target: { name: "options", value: options } }, index);
                  }}
                />
                <div className="options-list">
                  {question.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="option-item">
                      <span>{option}</span>
                      <Button
                        onClick={() => {
                          const updatedOptions = [...question.options];
                          updatedOptions.splice(optionIndex, 1);
                          handleChange({ target: { name: "options", value: updatedOptions } }, index);
                        }}
                        color="secondary"
                        variant="outlined"
                        size="small"
                      >
                        Supprimer
                      </Button>
                    </div>
                  ))}
                </div>
                <Button
                  onClick={() => {
                    const updatedOptions = [...question.options, ""];
                    handleChange({ target: { name: "options", value: updatedOptions } }, index);
                  }}
                  variant="contained"
                  color="primary"
                  size="small"
                >
                  Ajouter une option
                </Button>
              </div>
            )}

            {question.type === "SLIDER" && (
              <TextField
                label="Valeur Min/Max"
                variant="outlined"
                fullWidth
                margin="normal"
                name="slider"
                value={question.slider || ""}
                onChange={(e) => handleChange(e, index)}
              />
            )}

            {question.type === "DATE" && (
              <TextField
                label="Sélectionner une date"
                type="date"
                variant="outlined"
                fullWidth
                margin="normal"
                name="date"
                value={question.date || ""}
                onChange={(e) => handleChange(e, index)}
                InputLabelProps={{ shrink: true }}
              />
            )}
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
  );
};

export default CreateEnqueteForm;
