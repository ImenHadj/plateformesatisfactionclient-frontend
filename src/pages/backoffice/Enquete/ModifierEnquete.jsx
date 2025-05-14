import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, TextField, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import { motion } from "framer-motion";
import { FaPlusCircle, FaSave, FaTrash } from "react-icons/fa";
import { TypeQuestion } from "./TypeQuestion";
import "./CreateEnqueteForm.css";

function ModifierEnquete() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [dateExpiration, setDateExpiration] = useState("");
  const [datePublication, setDatePublication] = useState("");
  const [statut, setStatut] = useState("BROUILLON");
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("jwt");

    axios.get(`http://localhost:9090/admin/enquetes/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      const data = res.data;
      setTitre(data.titre);
      setDescription(data.description);
      setDateExpiration(data.dateExpiration);
      setDatePublication(data.datePublication);
      setStatut(data.statut);
      setQuestions(data.questions);
    })
    .catch(err => {
      console.error("Erreur chargement enquête:", err);
      alert("Erreur lors du chargement de l’enquête.");
    });
  }, [id]);

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const updated = [...questions];
    updated[index][name] = value;
    setQuestions(updated);
  };

  const handleOptionChange = (value, index) => {
    const updated = [...questions];
    updated[index].options = value.split(",").map((opt) => opt.trim());
    setQuestions(updated);
  };

  const addQuestion = () => {
    setQuestions([...questions, { texte: "", type: "OUVERT", options: [] }]);
  };

  const removeQuestion = (index) => {
    const updated = [...questions];
    updated.splice(index, 1);
    setQuestions(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedEnquete = {
      titre,
      description,
      dateExpiration,
      datePublication,
      statut,
      questions
    };

    const token = localStorage.getItem("jwt");

    try {
      await axios.put(`http://localhost:9090/admin/enquetes/${id}`, updatedEnquete, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Enquête modifiée avec succès !");
      navigate("/enquetes");
    } catch (error) {
      console.error("Erreur modification:", error);
      alert("Échec de la modification.");
    }
  };

  return (
    <motion.div
      className="create-enquete-form"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <nav className="navbar">
        <h2>Modifier Enquête</h2>
        <div className="nav-links">
          <a href="/dashboard">Dashboard</a>
          <a href="/enquetes" className="active">Mes Enquêtes</a>
        </div>
      </nav>

      <form onSubmit={handleSubmit} className="enquete-form">
        <TextField
          label="Titre"
          value={titre}
          onChange={(e) => setTitre(e.target.value)}
          fullWidth
          margin="normal"
          required
        />

        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          margin="normal"
          required
        />

        <TextField
          label="Date d'expiration"
          type="datetime-local"
          value={dateExpiration}
          onChange={(e) => setDateExpiration(e.target.value)}
          InputLabelProps={{ shrink: true }}
          fullWidth
          margin="normal"
        />

        <TextField
          label="Date de publication"
          type="datetime-local"
          value={datePublication}
          onChange={(e) => setDatePublication(e.target.value)}
          InputLabelProps={{ shrink: true }}
          fullWidth
          margin="normal"
        />

        <FormControl fullWidth margin="normal">
          <InputLabel>Statut</InputLabel>
          <Select
            value={statut}
            onChange={(e) => setStatut(e.target.value)}
            label="Statut"
          >
            <MenuItem value="BROUILLON">BROUILLON</MenuItem>
            <MenuItem value="PUBLIEE">PUBLIEE</MenuItem>
            <MenuItem value="FERMEE">FERMEE</MenuItem>
          </Select>
        </FormControl>

        {questions.map((q, index) => (
          <div className="question-form" key={index}>
            <TextField
              label="Texte de la question"
              name="texte"
              value={q.texte}
              onChange={(e) => handleChange(e, index)}
              fullWidth
              margin="normal"
              required
            />

            <FormControl fullWidth margin="normal">
              <InputLabel>Type de question</InputLabel>
              <Select
                name="type"
                value={q.type}
                onChange={(e) => handleChange(e, index)}
                label="Type de question"
              >
                {Object.keys(TypeQuestion).map((key) => (
                  <MenuItem key={key} value={TypeQuestion[key]}>
                    {TypeQuestion[key]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {(q.type === "CHOIX_SIMPLE" || q.type === "CHOIX_MULTIPLE") && (
              <TextField
                label="Options (séparées par des virgules)"
                value={q.options.join(", ")}
                onChange={(e) => handleOptionChange(e.target.value, index)}
                fullWidth
                margin="normal"
              />
            )}

            <Button
              color="error"
              variant="outlined"
              startIcon={<FaTrash />}
              onClick={() => removeQuestion(index)}
              style={{ marginTop: "10px" }}
            >
              Supprimer la question
            </Button>
          </div>
        ))}

        <Button
          variant="contained"
          color="primary"
          startIcon={<FaPlusCircle />}
          onClick={addQuestion}
        >
          Ajouter une question
        </Button>

        <Button
          variant="contained"
          color="secondary"
          type="submit"
          startIcon={<FaSave />}
          style={{ marginLeft: "15px" }}
        >
          Enregistrer les modifications
        </Button>
      </form>
    </motion.div>
  );
}

export default ModifierEnquete;
