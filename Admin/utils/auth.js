// src/utils/auth.js
export const getAuthHeaders = () => {
    const accessToken = localStorage.getItem('token');
    // Ensure you are retrieving the correct key (token vs. accessToken)
    if (accessToken) {
        return {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        };
    }
    return {}; // Return an empty object if no token
};