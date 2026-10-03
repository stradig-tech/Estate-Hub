import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/';

const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor to inject JWT token
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor to handle token refresh
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        
        // Never attempt to refresh token on auth endpoints (login, register, refresh)
        const isAuthRequest = originalRequest?.url && (
            originalRequest.url.includes('auth/login') ||
            originalRequest.url.includes('auth/register') ||
            originalRequest.url.includes('auth/refresh')
        );
        
        if (
            error.response && 
            error.response.status === 401 && 
            !originalRequest._retry && 
            !isAuthRequest
        ) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem('refresh_token');
                if (!refreshToken) {
                    return Promise.reject(error);
                }
                const response = await axios.post(`${BASE_URL}auth/refresh/`, {
                    refresh: refreshToken
                });
                
                const { access } = response.data;
                localStorage.setItem('access_token', access);
                
                originalRequest.headers.Authorization = `Bearer ${access}`;
                return axios(originalRequest);
            } catch (refreshError) {
                // If refresh fails, log out
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;
