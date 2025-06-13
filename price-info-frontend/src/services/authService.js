import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth';

export const authService = {
    login: async (username, password) => {
        const response = await axios.post(`${API_URL}/login`, {
            username,
            password
        });
        if (response.data.token) {
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    },

    logout: async () => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.token) {
            await axios.post(`${API_URL}/logout`, {}, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
        }
        localStorage.removeItem('user');
    },

    register: async (username, email, password) => {
        const response = await axios.post(`${API_URL}/register`, {
            username,
            email,
            password
        });
        return response.data;
    },

    forgotPassword: async (email) => {
        const response = await axios.post(`${API_URL}/forgot-password`, {
            email
        });
        return response.data;
    },

    resetPassword: async (token, newPassword, confirmPassword) => {
        const response = await axios.post(`${API_URL}/reset-password`, {
            token,
            newPassword,
            confirmPassword
        });
        return response.data;
    },

    getCurrentUser: () => {
        return JSON.parse(localStorage.getItem('user'));
    }
}; 