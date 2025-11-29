import axios from 'axios';

const API_URL = 'http://localhost:7071/api';


export const sendMessageToAI = async (message, user = null) => {
  try {
    const response = await axios.post(`${API_URL}/chat`, {
      message: message,
      userId: user?.id || null,
      userName: user?.name || 'Invitado',
      timestamp: new Date().toISOString()
    });

    return {
      message: response.data.message || response.data.response,
      success: true
    };
  } catch (error) {
    console.error('Error al enviar mensaje:', error);
    
    // Manejo de errores específicos
    if (error.response) {
      // El servidor respondió con un código de estado fuera del rango 2xx
      throw new Error(error.response.data.message || 'Error en el servidor');
    } else if (error.request) {
      // La petición fue hecha pero no se recibió respuesta
      throw new Error('No se pudo conectar con el servidor');
    } else {
      // Algo sucedió al configurar la petición
      throw new Error('Error al procesar la solicitud');
    }
  }
};

/**
 * Obtiene el historial de chat (opcional)
 * @param {string} userId - ID del usuario
 * @returns {Promise} - Historial de mensajes
 */
export const getChatHistory = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/chat/history/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener historial:', error);
    throw error;
  }
};