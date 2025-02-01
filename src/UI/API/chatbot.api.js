import axios from "axios";

const BASE_URL = "https://playwright-backend-m02j.onrender.com";

export const chatWithGemini = async (query) => {
  try {
    console.log(query);
    const response = await axios.post(`${BASE_URL}/chat`, query);
    console.log(response);
    return response;
  } catch (error) {
    console.error("Server Error:", error);
    throw error;
  }
};