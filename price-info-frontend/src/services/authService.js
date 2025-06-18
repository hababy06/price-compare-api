import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth';

// 全域攔截器：遇到 401/403 自動登出
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

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
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            if (user && user.token) {
                await axios.post(`${API_URL}/logout`, {}, {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
            }
        } catch (e) {
            // 忽略錯誤，確保一定會清除 localStorage
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

// 檢查 URL 是否有 token
const checkGoogleLogin = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');
  
  if (token) {
    // 儲存 token
    localStorage.setItem('token', token);
    // 清除 URL 中的 token
    window.history.replaceState({}, document.title, window.location.pathname);
    // 重新載入頁面
    window.location.reload();
  }
};

// 在頁面載入時檢查
checkGoogleLogin(); 