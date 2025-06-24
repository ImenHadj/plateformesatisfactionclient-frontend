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
  Divider,
  Paper,
  Container,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
  Grid,
  Card,
  CardContent,
  Slide
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaPlusCircle, 
  FaSave, 
  FaRobot, 
  FaCheck, 
  FaTimes, 
  FaMagic,
  FaPalette,
  FaEye,
  FaTrash,
  FaLightbulb,
  FaChartPie,
  FaCalendarAlt
} from "react-icons/fa";
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
  const [colorPalette, setColorPalette] = useState("#6366f1");
  const [isHovering, setIsHovering] = useState(false);

  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  const colors = [
    "#6366f1", // Indigo
    "#ec4899", // Pink
    "#10b981", // Emerald
    "#f59e0b", // Amber
    "#3b82f6", // Blue
    "#8b5cf6"  // Violet
  ];
const getNextColor = (offset = 1) => {
    const currentIndex = colors.indexOf(colorPalette);
    return colors[(currentIndex + offset) % colors.length];
  };
const getGradient = (offset = 1) => {
  const currentIndex = colors.indexOf(colorPalette);
  const nextColor = colors[(currentIndex + offset) % colors.length];
  return `linear-gradient(135deg, ${colorPalette}, ${nextColor})`;
};
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

  const removeQuestion = (index) => {
    if (questions.length > 1) {
      setQuestions(prev => prev.filter((_, i) => i !== index));
    } else {
      toast.warning("Vous devez garder au moins une question");
    }
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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <Grid container spacing={4}>
          {/* Left Side - Form */}
          <Grid item xs={12} md={8}>
            <motion.div
              whileHover={{ scale: 1.005 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Paper elevation={0} sx={{ 
                p: 4, 
                borderRadius: 4,
                background: 'linear-gradient(145deg, #ffffff, #f8f9fa)',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.5)',
                backdropFilter: 'blur(8px)',
                overflow: 'hidden',
                position: 'relative',
                '&:before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: `linear-gradient(90deg, ${colorPalette}, ${colorPalette}80)`,
                }
              }}>
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      fontWeight: 800,
                      background: `linear-gradient(135deg, ${colorPalette}, ${colors[(colors.indexOf(colorPalette) + 2) % colors.length]})`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      mb: 1,
                      letterSpacing: '-0.5px'
                    }}
                  >
                    Créer une Nouvelle Enquête
                  </Typography>
                  <Typography variant="subtitle1" sx={{ color: '#6b7280', fontSize: '1.1rem' }}>
                    Concevez une expérience client exceptionnelle
                  </Typography>
                </Box>

                <form onSubmit={handleSubmit}>
                  {/* Informations Section */}
                  <Box sx={{ mb: 6 }}>
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        mb: 3,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        color: '#111827',
                        fontWeight: 600
                      }}
                    >
                      <FaLightbulb style={{ color: colorPalette }} />
                      Informations de Base
                    </Typography>

                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <TextField
                          label="Titre de l'enquête"
                          name="titre"
                          value={formData.titre}
                          onChange={handleFormChange}
                          fullWidth
                          required
                          InputProps={{
                            sx: {
                              borderRadius: 2,
                              backgroundColor: '#f9fafb',
                              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                              '&:hover': {
                                backgroundColor: '#f3f4f6',
                              },
                              '&.Mui-focused': {
                                backgroundColor: '#fff',
                                boxShadow: `0 0 0 3px ${colorPalette}20`
                              }
                            }
                          }}
                          InputLabelProps={{
                            sx: { 
                              color: '#6b7280',
                              '&.Mui-focused': {
                                color: colorPalette
                              }
                            }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          label="Description"
                          name="description"
                          value={formData.description}
                          onChange={handleFormChange}
                          fullWidth
                          multiline
                          rows={4}
                          required
                          InputProps={{
                            sx: {
                              borderRadius: 2,
                              backgroundColor: '#f9fafb',
                              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                              '&:hover': {
                                backgroundColor: '#f3f4f6',
                              },
                              '&.Mui-focused': {
                                backgroundColor: '#fff',
                                boxShadow: `0 0 0 3px ${colorPalette}20`
                              }
                            }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          label="Date de publication"
                          type="datetime-local"
                          name="datePublication"
                          value={formData.datePublication}
                          onChange={handleFormChange}
                          fullWidth
                          required
                          InputLabelProps={{ shrink: true }}
                          InputProps={{
                            sx: {
                              borderRadius: 2,
                              backgroundColor: '#f9fafb',
                              '&:hover': {
                                backgroundColor: '#f3f4f6',
                              }
                            }
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          label="Date d'expiration"
                          type="datetime-local"
                          name="dateExpiration"
                          value={formData.dateExpiration}
                          onChange={handleFormChange}
                          fullWidth
                          required
                          InputLabelProps={{ shrink: true }}
                          InputProps={{
                            sx: {
                              borderRadius: 2,
                              backgroundColor: '#f9fafb',
                              '&:hover': {
                                backgroundColor: '#f3f4f6',
                              }
                            }
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Box>

                  {/* Questions Section */}
                  <Box sx={{ mb: 4 }}>
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      mb: 3,
                      flexWrap: 'wrap',
                      gap: 2
                    }}>
                      <Typography 
                        variant="h5" 
                        sx={{ 
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          color: '#111827',
                          fontWeight: 600
                        }}
                      >
                        <FaChartPie style={{ color: colorPalette }} />
                        Questions
                      </Typography>

                      <Box sx={{ display: 'flex', gap: 2 }}>
                        {isAdmin && (
                          <Button
                            variant="outlined"
                            startIcon={<FaRobot />}
                            onClick={generateQuestions}
                            disabled={isGenerating}
                            sx={{
                              borderColor: colorPalette,
                              color: colorPalette,
                              '&:hover': {
                                backgroundColor: `${colorPalette}08`,
                                borderColor: colorPalette,
                                boxShadow: `0 4px 12px ${colorPalette}20`
                              },
                              borderRadius: 2,
                              textTransform: 'none',
                              px: 3,
                              py: 1
                            }}
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
                        <Button
                          variant="outlined"
                          startIcon={<FaEye />}
                          onClick={() => setShowPreview(true)}
                          sx={{
                            borderColor: '#8b5cf6',
                            color: '#8b5cf6',
                            '&:hover': {
                              backgroundColor: '#8b5cf608',
                              borderColor: '#8b5cf6',
                              boxShadow: '0 4px 12px #8b5cf620'
                            },
                            borderRadius: 2,
                            textTransform: 'none',
                            px: 3,
                            py: 1
                          }}
                        >
                          Prévisualiser
                        </Button>
                      </Box>
                    </Box>

                    <AnimatePresence>
                      {questions.map((question, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.3, type: "spring" }}
                        >
                          <Paper
                            elevation={0}
                            sx={{
                              p: 3,
                              mb: 3,
                              border: '1px solid #e5e7eb',
                              borderRadius: 3,
                              background: 'linear-gradient(to bottom right, #ffffff, #f9fafb)',
                              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                              '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.05)',
                                borderColor: `${colorPalette}80`
                              }
                            }}
                          >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                              <Typography variant="subtitle2" sx={{ color: '#4b5563', fontWeight: 600 }}>
                                Question {index + 1}
                              </Typography>
                              <Tooltip title="Supprimer cette question">
                                <IconButton 
                                  onClick={() => removeQuestion(index)}
                                  size="small"
                                  sx={{ 
                                    color: '#ef4444',
                                    '&:hover': {
                                      backgroundColor: '#fee2e2'
                                    }
                                  }}
                                >
                                  <FaTrash size={14} />
                                </IconButton>
                              </Tooltip>
                            </Box>

                            <TextField
                              label="Texte de la question"
                              value={question.texte}
                              onChange={(e) => handleQuestionChange(index, "texte", e.target.value)}
                              fullWidth
                              required
                              sx={{ mb: 2 }}
                              InputProps={{
                                sx: {
                                  borderRadius: 1.5,
                                  backgroundColor: '#ffffff',
                                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                  '&:hover': {
                                    backgroundColor: '#f9fafb',
                                  },
                                  '&.Mui-focused': {
                                    backgroundColor: '#fff',
                                    boxShadow: `0 0 0 3px ${colorPalette}20`
                                  }
                                }
                              }}
                            />

                            <FormControl fullWidth sx={{ mb: 2 }}>
                              <InputLabel>Type de question</InputLabel>
                              <Select
                                value={question.type}
                                onChange={(e) => handleQuestionChange(index, "type", e.target.value)}
                                label="Type de question"
                                sx={{
                                  borderRadius: 1.5,
                                  backgroundColor: '#ffffff',
                                  '&:hover': {
                                    backgroundColor: '#f9fafb',
                                    '& fieldset': {
                                      borderColor: `${colorPalette}80 !important`
                                    }
                                  },
                                  '&.Mui-focused': {
                                    backgroundColor: '#fff',
                                    boxShadow: `0 0 0 3px ${colorPalette}20`,
                                    '& fieldset': {
                                      borderColor: `${colorPalette} !important`
                                    }
                                  }
                                }}
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
                                helperText="Exemple: Option 1, Option 2, Option 3"
                                InputProps={{
                                  sx: {
                                    borderRadius: 1.5,
                                    backgroundColor: '#ffffff',
                                    '&:hover': {
                                      backgroundColor: '#f9fafb',
                                    }
                                  }
                                }}
                              />
                            )}
                          </Paper>
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <Button
                        variant="contained"
                        startIcon={<FaPlusCircle />}
                        onClick={addQuestion}
                        sx={{
                          background: `linear-gradient(135deg, ${colorPalette}, ${colors[(colors.indexOf(colorPalette) + 1) % colors.length]})`,
                          borderRadius: 2,
                          py: 1.5,
                          px: 4,
                          textTransform: 'none',
                          fontWeight: 600,
                          boxShadow: `0 4px 14px ${colorPalette}40`,
                          '&:hover': {
                            boxShadow: `0 6px 20px ${colorPalette}60`,
                            transform: 'translateY(-1px)'
                          },
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                        }}
                      >
                        Ajouter une question
                      </Button>
                    </motion.div>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 6 }}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        type="submit"
                        variant="contained"
                        startIcon={<FaSave />}
                        disabled={isSubmitting}
                        sx={{
background: `linear-gradient(135deg, ${colorPalette}, ${colors[(colors.indexOf(colorPalette) + 2) % colors.length]})`,                          borderRadius: 2,
                          py: 1.5,
                          px: 6,
                          textTransform: 'none',
                          fontWeight: 600,
                          fontSize: '1rem',
                          boxShadow: `0 4px 14px ${colorPalette}40`,
                          '&:hover': {
                            boxShadow: `0 8px 24px ${colorPalette}60`,
                            transform: 'translateY(-2px)'
                          },
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          minWidth: 200
                        }}
                      >
                        {isSubmitting ? (
                          <CircularProgress size={24} sx={{ color: 'white' }} />
                        ) : (
                          "Créer l'enquête"
                        )}
                      </Button>
                    </motion.div>
                  </Box>
                </form>
              </Paper>
            </motion.div>
          </Grid>

          {/* Right Side - Tips & Color Palette */}
          <Grid item xs={12} md={4}>
            <Box position="sticky" top={20}>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <Card sx={{ 
                  borderRadius: 3,
                  background: 'linear-gradient(145deg, #ffffff, #f8f9fa)',
                  boxShadow: '0 20px 50px rgba(0, 0, 0, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.5)',
                  mb: 3
                }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ 
                      mb: 2, 
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      color: '#111827'
                    }}>
                      <FaPalette style={{ color: colorPalette }} />
                      Palette de Couleurs
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                      {colors.map((color) => (
                        <Tooltip key={color} title="Changer la couleur du thème" placement="top">
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Avatar
                              sx={{
                                bgcolor: color,
                                width: 32,
                                height: 32,
                                cursor: 'pointer',
                                boxShadow: color === colorPalette ? `0 0 0 3px ${color}80` : 'none',
                                transition: 'all 0.3s ease'
                              }}
                              onClick={() => setColorPalette(color)}
                            >
                              {color === colorPalette && <FaPalette size={16} />}
                            </Avatar>
                          </motion.div>
                        </Tooltip>
                      ))}
                    </Box>
                    <Typography variant="body2" sx={{ color: '#6b7280', fontStyle: 'italic' }}>
                      Choisissez une couleur pour personnaliser votre formulaire
                    </Typography>
                  </CardContent>
                </Card>

                <Card sx={{ 
                  borderRadius: 3,
                  background: 'linear-gradient(145deg, #ffffff, #f8f9fa)',
                  boxShadow: '0 20px 50px rgba(0, 0, 0, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.5)'
                }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ 
                      mb: 2, 
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      color: '#111827'
                    }}>
                      <FaCalendarAlt style={{ color: colorPalette }} />
                      Conseils de Création
                    </Typography>
                    <List dense sx={{ py: 0 }}>
                      <ListItem sx={{ alignItems: 'flex-start', py: 1 }}>
                        <Avatar sx={{ 
                          bgcolor: `${colorPalette}10`, 
                          color: colorPalette, 
                          width: 24, 
                          height: 24, 
                          mr: 2,
                          fontSize: '0.75rem'
                        }}>
                          1
                        </Avatar>
                        <ListItemText 
                          primary="Soyez concis" 
                          secondary="Des questions courtes obtiennent de meilleurs taux de réponse" 
                          secondaryTypographyProps={{ sx: { color: '#6b7280' } }}
                        />
                      </ListItem>
                      <Divider variant="inset" component="li" sx={{ borderColor: '#f3f4f6' }} />
                      <ListItem sx={{ alignItems: 'flex-start', py: 1 }}>
                        <Avatar sx={{ 
                          bgcolor: `${colorPalette}10`, 
                          color: colorPalette, 
                          width: 24, 
                          height: 24, 
                          mr: 2,
                          fontSize: '0.75rem'
                        }}>
                          2
                        </Avatar>
                        <ListItemText 
                          primary="Variez les types" 
                          secondary="Mélangez questions ouvertes et à choix multiples" 
                          secondaryTypographyProps={{ sx: { color: '#6b7280' } }}
                        />
                      </ListItem>
                      <Divider variant="inset" component="li" sx={{ borderColor: '#f3f4f6' }} />
                      <ListItem sx={{ alignItems: 'flex-start', py: 1 }}>
                        <Avatar sx={{ 
                          bgcolor: `${colorPalette}10`, 
                          color: colorPalette, 
                          width: 24, 
                          height: 24, 
                          mr: 2,
                          fontSize: '0.75rem'
                        }}>
                          3
                        </Avatar>
                        <ListItemText 
                          primary="Limitez le nombre" 
                          secondary="5-10 questions max pour éviter l'abandon" 
                          secondaryTypographyProps={{ sx: { color: '#6b7280' } }}
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </motion.div>
            </Box>
          </Grid>
        </Grid>
      </motion.div>

      {/* Prévisualisation des questions IA */}
      <Dialog
        open={showPreview}
        onClose={() => setShowPreview(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: "hidden",
            background: 'linear-gradient(145deg, #ffffff, #f8f9fa)',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)'
          }
        }}
        TransitionComponent={Slide}
        transitionDuration={400}
      >
        <DialogTitle
          sx={{
background: `linear-gradient(135deg, ${colorPalette}, ${colors[(colors.indexOf(colorPalette) + 1) % colors.length]})`,            color: "white",
            py: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}
        >
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <FaRobot size={28} />
          </motion.div>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Questions générées par l'IA
          </Typography>
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
                        <Box component="span" sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                          <Chip 
                            label={q.type
                              .replace(/_/g, " ")
                              .toLowerCase()
                              .replace(/\b\w/g, (l) => l.toUpperCase())}
                            size="small"
                            sx={{ 
                              mr: 1,
                              backgroundColor: `${colorPalette}10`,
                              color: colorPalette,
                              fontWeight: 500
                            }}
                          />
                          {q.options.length > 0 && (
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              component="span"
                            >
                              Options : {q.options.join(", ")}
                            </Typography>
                          )}
                        </Box>
                      }
                      sx={{ my: 0 }}
                    />
                  </ListItem>
                  {i < generatedQuestions.length - 1 && (
                    <Divider variant="middle" component="li" sx={{ borderColor: '#f0f0f0' }} />
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
            bgcolor: 'background.default',
            borderTop: '1px solid #f0f0f0'
          }}
        >
          <Button
            startIcon={<FaTimes />}
            onClick={() => setShowPreview(false)}
            color="error"
            variant="outlined"
            sx={{ 
              mr: "auto",
              borderRadius: 2,
              px: 3,
              '&:hover': {
                backgroundColor: '#fee2e2'
              }
            }}
          >
            Annuler
          </Button>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              startIcon={<FaCheck />}
              onClick={() => applyGeneratedQuestions("add")}
              variant="outlined"
              sx={{ 
                mx: 1,
                borderRadius: 2,
                borderColor: colorPalette,
                color: colorPalette,
                px: 3,
                '&:hover': {
                  backgroundColor: `${colorPalette}08`,
                  borderColor: colorPalette
                }
              }}
            >
              Ajouter
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              startIcon={<FaCheck />}
              onClick={() => applyGeneratedQuestions("replace")}
              variant="contained"
              sx={{
  borderRadius: 2,
  background: `linear-gradient(135deg, ${colorPalette}, ${colors[(colors.indexOf(colorPalette) + 1) % colors.length]})`,
  px: 3,
  '&:hover': {
    boxShadow: `0 6px 16px ${colorPalette}40`
  }
}}
            >
              Remplacer
            </Button>
          </motion.div>
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
            borderRadius: 3,
            maxWidth: 400,
            background: 'linear-gradient(145deg, #ffffff, #f8f9fa)',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle
  sx={{
    background: `linear-gradient(135deg, ${colorPalette}, ${getNextColor(1)})`,
    color: "white",
    py: 2,
    textAlign: 'center'
  }}
>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Succès</Typography>
        </DialogTitle>

        <DialogContent sx={{ py: 4 }}>
          <Box display="flex" justifyContent="center" mb={3}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ 
                scale: [0, 1.1, 1],
                rotate: [0, 360]
              }}
              transition={{ duration: 0.8, type: "spring" }}
            >
              <Box sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: `linear-gradient(135deg, ${colorPalette}20, ${colorPalette}10)`,
                boxShadow: `0 0 0 8px ${colorPalette}20`
              }}>
                <FaCheck style={{ 
                  fontSize: 48, 
                  color: colorPalette,
                }} />
              </Box>
            </motion.div>
          </Box>
          <DialogContentText align="center" sx={{ mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#111827' }}>
              Enquête créée avec succès!
            </Typography>
          </DialogContentText>
          <DialogContentText align="center" sx={{ color: '#6b7280' }}>
            Vous serez redirigé vers le dashboard...
          </DialogContentText>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => {
                setShowSuccess(false);
                navigate("/dashboard");
              }}
              variant="contained"
              sx={{
  px: 4,
  borderRadius: 2,
  background: getGradient(1),
  '&:hover': {
    boxShadow: `0 6px 16px ${colorPalette}40`
  }
}}
            >
              OK
            </Button>
          </motion.div>
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
        toastStyle={{
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
          borderLeft: `4px solid ${colorPalette}`
        }}
      />
    </Container>
  );
};

export default CreateEnqueteForm;