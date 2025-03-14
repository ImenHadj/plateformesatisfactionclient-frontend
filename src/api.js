import axios from "axios";

const API_URL = "http://localhost:9090/api/auth"; // Modifie selon ton URL backend

export const registerUser = async (userData) => {
  return axios.post(`${API_URL}/signup`, userData);
};

export const loginUser = async (credentials) => {
  return axios.post(`${API_URL}/signin`, credentials);
};
