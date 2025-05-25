import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';  // Importation correcte
import SignIn from './pages/auth/SignIn';  // Importation de SignIn
import SignUp from './pages/auth/SignUp';  // Importation de SignUp
import ForgotPassword from './pages/auth/Forgotpassword'; // Importation de ForgotPassword
import ResetPassword from './pages/auth/ResetPassword'; // Importation de ResetPassword
import Dashboard from './pages/backoffice/Dashboard';
import CreateEnqueteForm from './pages/backoffice/Enquete/createenquete';
import EnqueteResponseForm from './pages/frontoffice/EnqueteResponseForm';
import LandingPage from './pages/auth/landingpage';
import { ThemeProvider } from './components/ThemeContext';
import Layout from "./components/Layout"; // maintenant c’est valide
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

          {/* Pages avec Layout (dashboard, backoffice...) */}
          <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
          <Route path="/create-enquete" element={<Layout><CreateEnqueteForm /></Layout>} />
          <Route path="/enquetes" element={<Layout><ListeEnquetes /></Layout>} />
<Route path="/utilisateurs" element={<Layout><ListeUtilisateursUltraTable /></Layout>} />
<Route path="/utilisateurs/ajouter" element={<Layout><AjouterUtilisateur /></Layout>} />
<Route path="/utilisateurs/modifier/:id" element={<Layout><ModifierUtilisateur /></Layout>} />
<Route path="/reclamations" element={<Layout><ListeReclamations /></Layout>} />
<Route path="/reclamations/:id" element={<Layout><DetailReclamation /></Layout>} />
<Route path="/reclamations/modifier/:id" element={<Layout><ModifierStatutReclamation /></Layout>} />


          {/* Front-office (tu choisis si avec ou sans layout) */}
          <Route path="/enquete/respond/:enqueteId" element={<EnqueteResponseForm />} />
<Route path="/enquetes/:id" element={<Layout><DetailEnquete /></Layout>} />
<Route path="/enquete/modifier/:id" element={<Layout><ModifierEnquete /></Layout>} />
<Route path="/utilisateurs/:id" element={<Layout><DetailUtilisateur /></Layout>} />

        </Routes>
      </Router>
    </ThemeProvider>
  );
}
export default App;