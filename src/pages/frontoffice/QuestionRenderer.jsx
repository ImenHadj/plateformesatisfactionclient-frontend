import React from "react";
import {
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Checkbox,
  Slider,
  ListItemText,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  Button
} from "@mui/material";

export const QuestionRenderer = ({ question, value, onChange }) => {
  switch (question.type) {
    case "OUVERT":
    case "TEXTE_LONG":
    case "EMAIL":
    case "URL":
    case "TELEPHONE":
    case "CODE_PIN":
    case "CAPTCHA":
    case "QR_CODE":
    case "COULEUR":
    case "LOCALISATION":
      return (
        <TextField
          fullWidth
          label="Votre réponse"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
        />
      );

    case "CHOIX_COULEUR":
      return (
        <input
          type="color"
          value={value || "#000000"}
          onChange={(e) => onChange(e.target.value)}
          style={{ width: "100px", height: "40px", border: "none" }}
        />
      );

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

    case "CHOIX_MULTIPLE":
      return (
        <div>
          {question.options?.map((opt, i) => (
            <div key={i}>
              <label>
                <input
                  type="checkbox"
                  value={opt}
                  checked={(value || []).includes(opt)}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    const newValue = checked
                      ? [...(value || []), opt]
                      : (value || []).filter(v => v !== opt);
                    onChange(newValue);
                  }}
                />
                {opt}
              </label>
            </div>
          ))}
        </div>
      );

    case "NUMERIQUE":
    case "NOTE":
    case "POURCENTAGE":
    case "DEVISE":
      return (
        <TextField
          type="number"
          fullWidth
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
        />
      );

    case "SLIDER":
      return (
        <Slider
          value={typeof value === "number" ? value : 0}
          onChange={(_, val) => onChange(val)}
          min={0}
          max={10}
          valueLabelDisplay="auto"
        />
      );

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

    case "FICHIER":
    case "IMAGE":
      return (
        <div>
          <input
            type="file"
            accept={question.type === "IMAGE" ? "image/*" : "*"}
            onChange={(e) => {
              const file = e.target.files[0];
              onChange(file); // Peut être File ou URL.createObjectURL(file) selon besoin
            }}
          />
          {value && typeof value === "object" && (
            <p>Fichier sélectionné : {value.name}</p>
          )}
        </div>
      );

    case "SIGNATURE":
      return (
        <TextField
          fullWidth
          label="Lien de la signature (ou base64)"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
        />
        // Possibilité : intégrer un canvas plus tard pour signer à la souris
      );

    case "DESSIN":
      return (
        <TextField
          fullWidth
          label="Lien vers dessin ou base64"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
        />
        // Alternativement, vous pouvez intégrer une zone de dessin plus tard
      );

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

    default:
      return <p>Type de question non pris en charge : {question.type}</p>;
  }
};
