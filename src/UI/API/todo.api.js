// api.js
import axios from 'axios';

const BASE_URL = 'https://playwright-backend-m02j.onrender.com'; // Change to your actual API URL

// Create a new Todo
export const createTodo = async (todo) => {
    try {
        const response = await axios.post(`${BASE_URL}/todo/create`, todo);
        return response.data;
    } catch (error) {
        console.error("Error creating task:", error.response ? error.response.data : error.message);
        throw error;
    }
};

// Read Todos for a specific user
export const readTodos = async (username) => {
    const response = await axios.get(`${BASE_URL}/todo/read`, {
        params: { username }, // Pass username as a query parameter
    });
    return response.data;
};

export const completeTodo = async (todo) => {
    return await axios.put(`${BASE_URL}/todo/complete`, todo);
}

// Delete a Todo for a specific user
export const deleteTodo = async (todo) => {
    return await axios.delete(`${BASE_URL}/todo/delete`,{
        data: todo
    });
};


export const readTaskType = async (username) => {
    const response = await axios.get(`${BASE_URL}/taskType/read`, {
        params: { username },
    });
    return response.data;
};

export const createNewTaskType = async (tasktype) => {
    const response = await axios.post(`${BASE_URL}/taskType/create`, tasktype);
    return response.data
};

export const deleteTaskTypeList = async (taskType) => {
    return await axios.delete(`${BASE_URL}/taskType/delete`,{
        data: taskType
    });
};