import React from "react";
import {
  TextField,
  Slider,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Checkbox
} from "@mui/material";

export const QuestionRenderer = ({ question, value, onChange }) => {
  switch (question.type) {
    // Réponses ouvertes
    case "OUVERT":
    case "EMAIL":
      return (
        <TextField
          fullWidth
          label="Votre réponse"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
        />
      );

    case "TEXTE_LONG":
      return (
        <TextField
          fullWidth
          multiline
          minRows={4}
          label="Votre réponse détaillée"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
        />
      );

    // Réponse numérique
    case "NUMERIQUE":
      return (
        <TextField
          fullWidth
          type="number"
          label="Votre réponse (numérique)"
          value={value || ""}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      );

    // Choix simple
    case "CHOIX_SIMPLE":
      return (
        <FormControl component="fieldset">
          <FormLabel component="legend">Choisissez une option</FormLabel>
          <RadioGroup
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
          >
            {question.options?.map((opt, i) => (
              <FormControlLabel
                key={i}
                value={opt}
                control={<Radio />}
                label={opt}
              />
            ))}
          </RadioGroup>
        </FormControl>
      );

    // Choix multiple
    case "CHOIX_MULTIPLE":
      return (
        <FormControl component="fieldset">
          <FormLabel component="legend">Sélectionnez une ou plusieurs réponses</FormLabel>
          {question.options?.map((opt, i) => (
            <FormControlLabel
              key={i}
              control={
                <Checkbox
                  checked={(value || []).includes(opt)}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    const newValue = checked
                      ? [...(value || []), opt]
                      : (value || []).filter(v => v !== opt);
                    onChange(newValue);
                  }}
                />
              }
              label={opt}
            />
          ))}
        </FormControl>
      );

    // Oui / Non
    case "OUI_NON":
      return (
        <FormControl component="fieldset">
          <FormLabel component="legend">Votre réponse</FormLabel>
          <RadioGroup
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
          >
            <FormControlLabel value="OUI" control={<Radio />} label="Oui" />
            <FormControlLabel value="NON" control={<Radio />} label="Non" />
          </RadioGroup>
        </FormControl>
      );

    // Note / Slider
    case "NOTE":
    case "SLIDER":
      return (
        <FormControl component="fieldset">
          <FormLabel component="legend">Notez de 0 à 10</FormLabel>
          <Slider
            value={typeof value === "number" ? value : 0}
            onChange={(_, val) => onChange(val)}
            min={0}
            max={10}
            valueLabelDisplay="auto"
          />
        </FormControl>
      );

    // Matrice ou classement
    case "MATRICE":
    case "CLASSEMENT":
      return (
        <TextField
          fullWidth
          multiline
          minRows={3}
          label="Réponse formatée (JSON ou texte)"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
        />
      );

    // Date et heure
    case "DATE_HEURE":
      return (
        <TextField
          type="datetime-local"
          fullWidth
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
      );

    // Anti-bot
    case "CAPTCHA":
      return (
        <TextField
          fullWidth
          label="Code de sécurité (captcha)"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
        />
      );

    default:
      return <p>Type de question non pris en charge : {question.type}</p>;
  }
};
