// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';  // Importation correcte
import SignIn from './pages/auth/SignIn';  // Importation de SignIn
import SignUp from './pages/auth/SignUp';  // Importation de SignUp
import ForgotPassword from './pages/auth/Forgotpassword'; // Importation de ForgotPassword
import ResetPassword from './pages/auth/ResetPassword'; // Importation de ResetPassword
import Dashboard from './pages/backoffice/Dashboard';
import CreateEnqueteForm from './pages/backoffice/Enquete/createenquete';
import EnqueteResponseForm from './pages/frontoffice/EnqueteResponseForm';


function App() {
  return (
    <Router>
      <Routes>  {/* Utilisation de Routes au lieu de Switch */}
        <Route path="/signin" element={<SignIn />} />  {/* Utilisation de 'element' pour rendre SignIn */}
        <Route path="/signup" element={<SignUp />} />  {/* Utilisation de 'element' pour rendre SignUp */}
        <Route path="/forgot-password" element={<ForgotPassword />} />  {/* Route pour la page "Mot de passe oublié" */}
        <Route path="/reset-password" element={<ResetPassword />} />  {/* Route pour la page "Réinitialiser le mot de passe" */}
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/create-enquete" element={<CreateEnqueteForm />} />  {/* Ajout de la route pour la création d'enquête */}
        <Route path="/enquete/respond/:enqueteId" element={<EnqueteResponseForm />} />



      </Routes>
    </Router>
  );
}

export default App;
