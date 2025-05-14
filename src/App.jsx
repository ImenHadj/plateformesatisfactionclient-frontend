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

          {/* Front-office (tu choisis si avec ou sans layout) */}
          <Route path="/enquete/respond/:enqueteId" element={<EnqueteResponseForm />} />

        </Routes>
      </Router>
    </ThemeProvider>
  );
}
export default App;