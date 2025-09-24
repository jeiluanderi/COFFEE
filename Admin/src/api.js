// src/api.js
import axios from 'axios';
import { getAuthHeaders, setTokens, getRefreshToken, clearTokens } from '../utils/auth';

const API_BASE_URL = 'http://localhost:3001/api';

// Create a custom Axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
});

// Request Interceptor: Attach the access token to every outgoing request
api.interceptors.request.use((config) => {
    const headers = getAuthHeaders();
    if (Object.keys(headers).length > 0) {
        config.headers = { ...config.headers, ...headers };
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Response Interceptor: Handle 401 Unauthorized errors
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If the error is 401 and we haven't already retried the request
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = getRefreshToken();

            if (refreshToken) {
                try {
                    // Call the refresh token endpoint
                    const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, { refreshToken });
                    const { accessToken } = response.data;
                    
                    // Store the new access token
                    setTokens(accessToken, refreshToken); 

                    // Retry the original failed request with the new access token
                    originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
                    return api(originalRequest);
                } catch (refreshError) {
                    console.error('Unable to refresh token. Logging out...', refreshError);
                    clearTokens();
                    window.location.href = '/login'; // Redirect to login page
                    return Promise.reject(refreshError);
                }
            } else {
                // If there's no refresh token, log out the user
                clearTokens();
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;