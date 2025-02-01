import axios from 'axios';

const BASE_URL = 'https://playwright-backend-m02j.onrender.com'; // Replace with your FastAPI server URL

export const makeItLitt = async (note) => {
  try {
    const response = await axios.post(`${BASE_URL}/make-it-litt`, note);
    return response.data; // Assuming the response is JSON
  } catch (error) {
    console.error('Error in makeItLitt API:', error);
    throw error;
  }
};