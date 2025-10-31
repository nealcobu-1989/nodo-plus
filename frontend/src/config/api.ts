import axios from 'axios'

// Configuración de la API
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

// Configurar axios para usar la URL base si está definida (solo en producción)
if (API_BASE_URL && typeof window !== 'undefined') {
  // Solo en el navegador, configurar baseURL de axios
  axios.defaults.baseURL = API_BASE_URL;
}

export const apiConfig = {
  baseURL: API_BASE_URL,
  timeout: 10000
};
