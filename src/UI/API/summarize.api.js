import axios from "axios";

const BASE_URL = "https://littlabs.onrender.com";

export const summarizeWithGemini = async (formData) => {
  try {
    console.log(formData);
    const response = await axios.post(`${BASE_URL}/summarizer`, formData, {
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
