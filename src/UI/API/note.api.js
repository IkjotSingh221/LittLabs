import axios from 'axios';

const BASE_URL = 'https://littlabs.onrender.com'; // Change to your actual API URL

export const createNote = async (note) => {
  try {
    const response = await axios.post(`${BASE_URL}/notes/create`, note);
    return response.data;
  } catch (error) {
    console.error('Error creating note:', error);
    throw error;
  }
};

export const readNotes = async (username) => {
  try {
    const response = await axios.get(`${BASE_URL}/notes/read`, {
      params: { username },
    });
    return response.data;
  } catch (error) {
    console.error('Error reading notes:', error);
    throw error;
  }
};

export const deleteNoteByKey = async (note) => {
  try {
    const response = await axios.delete(`${BASE_URL}/notes/delete`, {
      data: note
    });
    console.log('Note deleted:', response.data);
  } catch (error) {
    console.error('Error deleting note:', error);
  }
};

export const updateNote = async (noteData) => {
  try {
    const response = await axios.put(`${BASE_URL}/notes/update`, noteData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.detail || "Failed to update note");
    } else {
      throw new Error("Failed to update note");
    }
  }
};