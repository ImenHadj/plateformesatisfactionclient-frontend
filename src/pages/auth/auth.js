import axios from 'axios';

export const logout = async (navigate) => {
  try {
    // Appelle le backend pour "logout"
    await axios.post('http://localhost:8083/api/auth/logout', {}, { withCredentials: true });

    // Supprimer les données locales
    localStorage.removeItem('jwt');
    localStorage.removeItem('user');

    // Rediriger vers la page de connexion
    navigate('/signin');
  } catch (error) {
    console.error("Erreur lors de la déconnexion", error);
  }
};
