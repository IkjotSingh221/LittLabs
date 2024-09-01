import axios from 'axios';

const BASE_URL = 'http://localhost:8000';

export const createPost = async (post) => {
    try {
        const response = await axios.post(`${BASE_URL}/post/create`, post);
        return response.data;
    } catch (error) {
        console.error("Error creating post:", error.response ? error.response.data : error.message);
        throw error;
    }
};

export const readPosts = async () => {
    const response = await axios.get(`${BASE_URL}/post/read`);
    return response.data;
};

export const like_unlike = async (post) => {
    try {
        const response = await axios.post(`${BASE_URL}/post/like-unlike`, post);
        return response.data;
    } catch (error) {
        console.error("Error creating post:", error.response ? error.response.data : error.message);
        throw error;
    }
};

export const commentUpvote = async (comment) => {
    try {
        const response = await axios.post(`${BASE_URL}/comment/upvote`, comment);
        return response.data;
    } catch (error) {
        console.error("Error creating post:", error.response ? error.response.data : error.message);
        throw error;
    }
};

export const commentDownvote = async (comment) => {
    try {
        const response = await axios.post(`${BASE_URL}/comment/downvote`, comment);
        return response.data;
    } catch (error) {
        console.error("Error creating post:", error.response ? error.response.data : error.message);
        throw error;
    }
};

export const createComment = async (comment) => {
    try {
        const response = await axios.post(`${BASE_URL}/comment/create`, comment);
        return response.data;
    } catch (error) {
        console.error("Error commenting:", error.response ? error.response.data : error.message);
        throw error;
    }
};

export const readComments = async () => {
    const response = await axios.get(`${BASE_URL}/comment/read`);
    return response.data;
};