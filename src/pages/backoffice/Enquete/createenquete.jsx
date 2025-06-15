import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider
} from "@mui/material";
import { motion } from "framer-motion";
import { FaPlusCircle, FaSave, FaRobot, FaCheck, FaTimes } from "react-icons/fa";
import { TypeQuestion } from "./TypeQuestion";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const CreateEnqueteForm = () => {
  const [formData, setFormData] = useState({
    titre: "",
    description: "",
    datePublication: "",
    dateExpiration: ""
  });

  const [questions, setQuestions] = useState([
    {
      texte: "",
      type: "OUVERT",
      options: []
    }
  ]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    try {
      const user = userData ? JSON.parse(userData) : {};
      setIsAdmin(user.roles?.includes("ROLE_ADMIN") ?? false);
    } catch (error) {
      console.error("Error parsing user data:", error);
      setIsAdmin(false);
    }
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleQuestionChange = (index, field, value) => {
    setQuestions((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        texte: "",
        type: "OUVERT",
        options: []
      }
    ]);
  };

  const generateQuestions = async () => {
    if (!formData.titre || !formData.description) {
      toast.warning("Veuillez remplir le titre et la description");
      return;
    }

    setIsGenerating(true);
    try {
      const token = localStorage.getItem("jwt");
      if (!token) {
        toast.error("Authentification requise");
        return;
      }

      const response = await axios.post(
        "http://localhost:8083/admin/enquetes/create-ia",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (response.data?.questions?.length > 0) {
        const formattedQuestions = response.data.questions.map((q) => {
          const type = (q.type || "OUVERT").toUpperCase().replace(/\s+/g, "_");
          return {
            texte: q.texte || q.question || "Question non générée",
            type,
            options:
              (type === "CHOIX_SIMPLE" || type === "CHOIX_MULTIPLE") && Array.isArray(q.options)
                ? q.options
                : []
          };
        });

        setGeneratedQuestions(formattedQuestions);
        setShowPreview(true);
      } else {
        toast.info("L'IA n'a généré aucune question");
      }
    } catch (error) {
      console.error("Erreur génération IA:", error);
      toast.error(`Échec de la génération par IA: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const applyGeneratedQuestions = (action) => {
    setQuestions((prev) =>
      action === "replace" ? [...generatedQuestions] : [...prev, ...generatedQuestions]
    );
    setGeneratedQuestions([]);
    setShowPreview(false);
    toast.success("Questions appliquées avec succès");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAdmin) {
      toast.error("Action réservée aux administrateurs");
      return;
    }

    if (questions.some((q) => !q.texte.trim())) {
      toast.warning("Veuillez compléter toutes les questions");
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("jwt");
      if (!token) {
        toast.error("Authentification requise");
        return;
      }

      await axios.post(
        "http://localhost:8083/admin/enquetes/create",
        { ...formData, questions },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      setShowSuccess(true);
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (error) {
      console.error("Erreur création enquête:", error);
      toast.error(`Échec de la création: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="enquete-form-container"
    >
      <header className="form-header">
        <Typography variant="h4">Création d'enquête</Typography>
      </header>

      <form onSubmit={handleSubmit}>
        <section className="form-section">
          <Typography variant="h6" gutterBottom>
            Informations générales
          </Typography>

          <TextField
            label="Titre de l'enquête"
            name="titre"
            value={formData.titre}
            onChange={handleFormChange}
            fullWidth
            required
            margin="normal"
            inputProps={{ maxLength: 100 }}
          />

          <TextField
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleFormChange}
            fullWidth
            multiline
            rows={3}
            required
            margin="normal"
            inputProps={{ maxLength: 500 }}
          />

          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <TextField
              label="Date de publication"
              type="datetime-local"
              name="datePublication"
              value={formData.datePublication}
              onChange={handleFormChange}
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
              margin="normal"
            />

            <TextField
              label="Date d'expiration"
              type="datetime-local"
              name="dateExpiration"
              value={formData.dateExpiration}
              onChange={handleFormChange}
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
              margin="normal"
            />
          </Box>
        </section>

        <section className="form-section">
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2
            }}
          >
            <Typography variant="h6" gutterBottom>
              Questions
            </Typography>

            {isAdmin && (
              <Button
                variant="outlined"
                startIcon={<FaRobot />}
                onClick={generateQuestions}
                disabled={isGenerating}
                sx={{ ml: { xs: 0, sm: 2 } }}
              >
                {isGenerating ? (
                  <>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    Génération...
                  </>
                ) : (
                  "Générer avec IA"
                )}
              </Button>
            )}
          </Box>

          {questions.map((question, index) => (
            <Box
              key={index}
              sx={{
                mb: 3,
                p: 2,
                border: "1px solid #eee",
                borderRadius: 1,
                backgroundColor: "background.paper"
              }}
            >
              <TextField
                label="Texte de la question"
                value={question.texte}
                onChange={(e) => handleQuestionChange(index, "texte", e.target.value)}
                fullWidth
                required
                margin="normal"
                inputProps={{ maxLength: 200 }}
              />

              <FormControl fullWidth margin="normal" required>
                <InputLabel>Type de question</InputLabel>
                <Select
                  value={question.type}
                  onChange={(e) => handleQuestionChange(index, "type", e.target.value)}
                  label="Type de question"
                >
                  {Object.entries(TypeQuestion).map(([key, value]) => (
                    <MenuItem key={key} value={value}>
                      {value}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {(question.type === "CHOIX_SIMPLE" || question.type === "CHOIX_MULTIPLE") && (
                <TextField
                  label="Options (séparées par des virgules)"
                  value={question.options.join(", ")}
                  onChange={(e) => {
                    const options = e.target.value
                      .split(",")
                      .map((o) => o.trim())
                      .filter((o) => o.length > 0);
                    handleQuestionChange(index, "options", options);
                  }}
                  fullWidth
                  margin="normal"
                  helperText="Exemple: Option 1, Option 2, Option 3"
                />
              )}
            </Box>
          ))}

          <Button
            variant="contained"
            startIcon={<FaPlusCircle />}
            onClick={addQuestion}
            sx={{ mr: 2, mb: 2 }}
          >
            Ajouter une question
          </Button>
        </section>

        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3, gap: 2 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            startIcon={<FaSave />}
            disabled={isSubmitting}
            sx={{ minWidth: 150 }}
          >
            {isSubmitting ? <CircularProgress size={24} /> : "Créer l'enquête"}
          </Button>
        </Box>
      </form>

      {/* Prévisualisation des questions IA */}
      <Dialog
        open={showPreview}
        onClose={() => setShowPreview(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            overflow: "hidden"
          }
        }}
      >
        <DialogTitle
          sx={{
            bgcolor: "primary.main",
            color: "primary.contrastText",
            py: 2
          }}
        >
          <Box display="flex" alignItems="center">
            <FaRobot style={{ marginRight: 10 }} />
            <Typography variant="h6">Questions générées par l'IA</Typography>
          </Box>
        </DialogTitle>

        <DialogContent dividers sx={{ py: 2 }}>
          {generatedQuestions.length > 0 ? (
            <List sx={{ py: 0 }}>
              {generatedQuestions.map((q, i) => (
                <React.Fragment key={i}>
                  <ListItem sx={{ py: 2 }}>
                    <ListItemText
                      primary={
                        <Typography variant="body1" fontWeight="medium">
                          {`${i + 1}. ${q.texte}`}
                        </Typography>
                      }
                      secondary={
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          component="span"
                        >
                          Type :{" "}
                          {q.type
                            .replace(/_/g, " ")
                            .toLowerCase()
                            .replace(/\b\w/g, (l) => l.toUpperCase())}
                          {q.options.length > 0 && (
                            <> | Options : {q.options.join(", ")}</>
                          )}
                        </Typography>
                      }
                      sx={{ my: 0 }}
                    />
                  </ListItem>
                  {i < generatedQuestions.length - 1 && (
                    <Divider variant="middle" component="li" />
                  )}
                </React.Fragment>
              ))}
            </List>
          ) : (
            <Typography variant="body1" align="center" sx={{ py: 3 }}>
              Aucune question générée
            </Typography>
          )}
        </DialogContent>

        <DialogActions
          sx={{
            px: 3,
            py: 2,
            bgcolor: "background.default"
          }}
        >
          <Button
            startIcon={<FaTimes />}
            onClick={() => setShowPreview(false)}
            color="error"
            variant="outlined"
            sx={{ mr: "auto" }}
          >
            Annuler
          </Button>

          <Button
            startIcon={<FaCheck />}
            onClick={() => applyGeneratedQuestions("add")}
            color="primary"
            variant="outlined"
            sx={{ mx: 1 }}
          >
            Ajouter
          </Button>

          <Button
            startIcon={<FaCheck />}
            onClick={() => applyGeneratedQuestions("replace")}
            color="primary"
            variant="contained"
          >
            Remplacer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Message succès */}
      <Dialog
        open={showSuccess}
        onClose={() => {
          setShowSuccess(false);
          navigate("/dashboard");
        }}
        PaperProps={{
          sx: {
            borderRadius: 2,
            maxWidth: 400
          }
        }}
      >
        <DialogTitle
          sx={{
            bgcolor: "success.main",
            color: "success.contrastText",
            py: 2
          }}
        >
          <Typography variant="h6">Succès</Typography>
        </DialogTitle>

        <DialogContent sx={{ py: 3 }}>
          <Box display="flex" justifyContent="center" mb={2}>
            <FaCheck style={{ fontSize: 48, color: "#4caf50" }} />
          </Box>
          <DialogContentText align="center">
            L'enquête a été créée avec succès.
          </DialogContentText>
          <DialogContentText align="center">
            Vous serez redirigé vers le dashboard...
          </DialogContentText>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
          <Button
            onClick={() => {
              setShowSuccess(false);
              navigate("/dashboard");
            }}
            color="primary"
            variant="contained"
            sx={{ px: 4 }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>

      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </motion.div>
  );
};

export default CreateEnqueteForm;
