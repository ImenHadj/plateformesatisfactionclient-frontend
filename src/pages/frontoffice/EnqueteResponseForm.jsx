import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Checkbox,
  ListItemText,
  Slider,
} from "@mui/material";
import { TypeQuestion } from "../backoffice/Enquete/TypeQuestion";
import { useParams, useLocation } from "react-router-dom";
import { QuestionTypeMapper } from "./QuestionTypeMapper";

const EnqueteResponseForm = () => {
  const { enqueteId } = useParams();
  const location = useLocation();
  const [enquete, setEnquete] = useState(null);
  const [reponses, setReponses] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const userIdFromUrl = params.get("userId");

    if (userIdFromUrl) {
      setUserId(userIdFromUrl);
    } else {
      setError("L'ID de l'utilisateur est manquant.");
      setIsLoading(false);
      return;
    }

    if (enqueteId) {
      axios.get(`http://localhost:9090/enquete/respond/${enqueteId}`)
        .then((response) => {
          if (response.data?.questions) {
            const questionsWithIds = response.data.questions.map((q, index) => ({
              ...q,
              id: q.id || `temp-${index}`
            }));
            setEnquete({ ...response.data, questions: questionsWithIds });
          }
        })
        .catch((err) => {
          setError(`Erreur: ${err.response?.data?.message || err.message}`);
        })
        .finally(() => setIsLoading(false));
    }
  }, [enqueteId, location]);

  const handleChange = (event, questionId) => {
    const { value, type, checked } = event.target;

    setReponses(prev => ({
      ...prev,
      [questionId]: type === 'checkbox' 
        ? (checked 
          ? [...(prev[questionId] || []), value] 
          : (prev[questionId] || []).filter(v => v !== value))
        : value
    }));
  };

  const handleSliderChange = (questionId, newValue) => {
    setReponses(prev => ({
      ...prev,
      [questionId]: newValue
    }));
  };


const handleSubmit = async (e) => {
  e.preventDefault();

  const reponsesDTO = enquete.questions
    .filter(question => question.id && reponses[question.id] !== undefined)
    .map(question => {
      const responseValue = reponses[question.id];
      const backendType = QuestionTypeMapper[question.type] || "TEXTE";
      
      const responseDTO = {
        questionId: Number(question.id),
        typeReponse: backendType, // Utilisation du type backend
      };

      switch (backendType) {
        case "TEXTE":
          responseDTO.texteReponse = String(responseValue || "");
          responseDTO.choixReponse = null;
          break;
      
        case "CHOIX_SIMPLE": // Cas pour OUI/NON
        if (question.type === TypeQuestion.OUI_NON) {
          responseDTO.typeReponse = "CHOIX_SIMPLE";
          responseDTO.texteReponse = null;
          responseDTO.choixReponse = responseValue ? [responseValue] : ["NON"];
        }
          break;

        case "NUMERIQUE":
          responseDTO.texteReponse = String(responseValue || 0);
          responseDTO.choixReponse = null;
          break;

        case "CHOIX_MULTIPLE":
          responseDTO.texteReponse = null;
          responseDTO.choixReponse = Array.isArray(responseValue) 
            ? responseValue 
            : responseValue ? [responseValue] : [];
          break;

        case "DATE_HEURE":
          responseDTO.texteReponse = responseValue || new Date().toISOString();
          responseDTO.choixReponse = null;
          break;

        default:
          responseDTO.texteReponse = String(responseValue || "");
          responseDTO.choixReponse = null;
      }

      return responseDTO;
    });

  try {
    const response = await axios.post(
      `http://localhost:9090/enquete/respond/${enqueteId}?userId=${userId}`,
      reponsesDTO,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
    alert("Réponses enregistrées avec succès !");
  } catch (error) {
    console.error("Erreur complète:", {
      config: error.config,
      response: error.response?.data,
      status: error.response?.status
    });
    alert(`Erreur: ${error.response?.data?.message || error.message}`);
  }
};
  if (isLoading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;
  if (!enquete?.questions?.length) return <div>Aucune question disponible</div>;

  return (
    <div>
      <h2>{enquete.titre}</h2>
      <p>{enquete.description}</p>

      <form onSubmit={handleSubmit}>
        {enquete.questions.map((question) => (
          <div key={`q-${question.id}`} style={{ marginBottom: '20px' }}>
            <h4>{question.texte}</h4>

            {/* Question ouverte */}
            {question.type === TypeQuestion.OUVERT && (
              <TextField
                fullWidth
                value={reponses[question.id] || ""}
                onChange={(e) => handleChange(e, question.id)}
                label="Votre réponse"
              />
            )}

            {/* Choix simple */}
            {question.type === TypeQuestion.CHOIX_SIMPLE && (
              <FormControl fullWidth>
                <InputLabel>Option</InputLabel>
                <Select
                  value={reponses[question.id] || ""}
                  onChange={(e) => handleChange(e, question.id)}
                >
                  {question.options?.map((opt, i) => (
                    <MenuItem key={`opt-${question.id}-${i}`} value={opt}>
                      {opt}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            {/* Choix multiple */}
            {question.type === TypeQuestion.CHOIX_MULTIPLE && (
              <FormControl fullWidth>
                <InputLabel>Options</InputLabel>
                <Select
                  multiple
                  value={reponses[question.id] || []}
                  onChange={(e) => handleChange(e, question.id)}
                  renderValue={(selected) => selected.join(', ')}
                >
                  {question.options?.map((opt, i) => (
                    <MenuItem key={`opt-${question.id}-${i}`} value={opt}>
                      <Checkbox checked={(reponses[question.id] || []).includes(opt)} />
                      <ListItemText primary={opt} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            {/* Slider */}
            {question.type === TypeQuestion.SLIDER && (
              <div>
                <Slider
                  value={reponses[question.id] || 0}
                  onChange={(_, val) => handleSliderChange(question.id, val)}
                  min={0}
                  max={10}
                  step={1}
                  valueLabelDisplay="auto"
                />
                <TextField
                  type="number"
                  value={reponses[question.id] || 0}
                  onChange={(e) => handleSliderChange(question.id, e.target.value)}
                  inputProps={{ min: 0, max: 10 }}
                />
              </div>
            )}

            {/* Oui/Non */}
            {question.type === TypeQuestion.OUI_NON && (
              <FormControl fullWidth>
                <InputLabel>Réponse</InputLabel>
                <Select
                  value={reponses[question.id] || ""}
                  onChange={(e) => handleChange(e, question.id)}
                >
                  <MenuItem value="OUI">Oui</MenuItem>
                  <MenuItem value="NON">Non</MenuItem>
                </Select>
              </FormControl>
            )}

            {/* Date */}
            {question.type === TypeQuestion.DATE && (
              <TextField
                type="date"
                fullWidth
                value={reponses[question.id] || ""}
                onChange={(e) => handleChange(e, question.id)}
                InputLabelProps={{ shrink: true }}
              />
            )}
          </div>
        ))}

        <Button type="submit" variant="contained" color="primary">
          Soumettre
        </Button>
      </form>
    </div>
  );
};

export default EnqueteResponseForm;