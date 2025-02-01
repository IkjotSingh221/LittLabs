import axios from "axios";

const BASE_URL = "https://playwright-backend-m02j.onrender.com";

export const generateFlashcardsWithGemini = async (formData) => {
  try {
    console.log(formData);
    const response = await axios.post(`${BASE_URL}/flashcards`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error generating flashcards:", error);
    throw error.response
      ? error.response.data.detail
      : "Failed to generate flashcards";
  }
};
