import axios from 'axios';

const BASE_URL = 'http://localhost:8000';

export const generateFlashcardsWithGemini = async (PDF) => {
    try {
      const response = await axios.post(`${BASE_URL}/flashcards`, PDF, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error("Error creating flashcards:", error.response ? error.response.data : error.message);
      throw error;
    }
  };
  