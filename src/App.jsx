import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';  
import { useEffect } from "react";

import SignIn from './pages/auth/SignIn';  
import SignUp from './pages/auth/SignUp';  
import ForgotPassword from './pages/auth/Forgotpassword'; 
import ResetPassword from './pages/auth/ResetPassword';
import LandingPage from './pages/auth/landingpage';

import Dashboard from './pages/backoffice/Dashboard';
import CreateEnqueteForm from './pages/backoffice/Enquete/createenquete';
import ListeEnquetes from './pages/backoffice/Enquete/ListeEnquetes';
import DetailEnquete from './pages/backoffice/Enquete/DetailsEnquete';
import ModifierEnquete from './pages/backoffice/Enquete/ModifierEnquete';

import ListeUtilisateursUltraTable from './pages/backoffice/User/ListeUtilisateursUltraTable';
import AjouterUtilisateur from './pages/backoffice/User/AjouterUtilisateur';
import ModifierUtilisateur from './pages/backoffice/User/ModifierUtilisateur';
import DetailUtilisateur from './pages/backoffice/User/DetailUtilisateur';

import ListeReclamations from './pages/backoffice/Reclamation/ListeReclamationsAgent';
import DetailReclamation from './pages/backoffice/Reclamation/DetailsReclamation';
import ModifierStatutReclamation from './pages/backoffice/Reclamation/ModifierStatutReclamation';

import EnqueteResponseForm from './pages/frontoffice/EnqueteResponseForm';
import AccueilClient from './pages/frontoffice/AccueilClient';
import CreerReclamation from './pages/frontoffice/CreerReclamation';

import { ThemeProvider } from './components/ThemeContext';
import Layout from "./components/Layout"; 
import LayoutClient from './components/LayoutClient';
import CustomerSatisfactionReport from './pages/backoffice/CustomerSatisfactionReport';


// 🔓 Composant Logout (vide localStorage et redirige)
const NavigateToLogout = () => {
  useEffect(() => {
    localStorage.clear(); // Ou removeItem('token') / removeItem('user') si tu veux cibler
  }, []);
  return <Navigate to="/signin" replace />;
};

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>

          {/* Pages sans sidebar (auth, landing...) */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/landingpage" element={<LandingPage />} />

          {/* Page logout */}
          <Route path="/logout" element={<NavigateToLogout />} />

          {/* Backoffice (avec Layout) */}
          <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
          <Route path="/create-enquete" element={<Layout><CreateEnqueteForm /></Layout>} />
          <Route path="/enquetes" element={<Layout><ListeEnquetes /></Layout>} />
          <Route path="/enquetes/:id" element={<Layout><DetailEnquete /></Layout>} />
          <Route path="/enquete/modifier/:id" element={<Layout><ModifierEnquete /></Layout>} />
          <Route path="/rapports" element={<Layout><CustomerSatisfactionReport /></Layout>} />


          <Route path="/utilisateurs" element={<Layout><ListeUtilisateursUltraTable /></Layout>} />
          <Route path="/utilisateurs/ajouter" element={<Layout><AjouterUtilisateur /></Layout>} />
          <Route path="/utilisateurs/modifier/:id" element={<Layout><ModifierUtilisateur /></Layout>} />
          <Route path="/utilisateurs/:id" element={<Layout><DetailUtilisateur /></Layout>} />

          <Route path="/reclamations" element={<Layout><ListeReclamations /></Layout>} />
          <Route path="/reclamations/:id" element={<Layout><DetailReclamation /></Layout>} />
          <Route path="/reclamations/modifier/:id" element={<Layout><ModifierStatutReclamation /></Layout>} />

          {/* Front-office (sans layout ou à personnaliser) */}
          <Route path="/enquete/respond/:enqueteId" element={<EnqueteResponseForm />} />
          <Route path="/accueil-client" element={<AccueilClient />} />
          <Route path="/creer-reclamation" element={<CreerReclamation />} />

        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
