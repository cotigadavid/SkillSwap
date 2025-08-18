import axios from 'axios';

const secureAxios = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    }
});


secureAxios.interceptors.response.use(
    response => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                await axios.post(`${process.env.REACT_APP_API_BASE_URL}token/refresh/`, null, {
                    withCredentials: true
                });

                return secureAxios(originalRequest); // Retry original request
            } catch (e) {
                console.log('Refresh token failed:', e);
                return Promise.reject(e);
            }
        }

        return Promise.reject(error);
    }
);

export default secureAxios;
