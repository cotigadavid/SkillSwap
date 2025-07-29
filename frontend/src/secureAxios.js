import axios from 'axios';

const secureAxios = axios.create({
    baseURL: 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
    }
});

secureAxios.interceptors.request.use(
    async (config) => {
        const token = localStorage.getItem('access');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

secureAxios.interceptors.response.use(
    response => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const refresh = localStorage.getItem('refresh');
            try {
                const res = await axios.post('http://localhost:8000/api/token/refresh/', {
                    refresh,
                });
                
                const newAccess = res.data.access;
                localStorage.setItem('access', newAccess);
                originalRequest.headers.Authorization = `Bearer ${newAccess}`;
                return secureAxios(originalRequest); 
            } catch (e) {
                console.log('Refresh token request failed:', e);
                return Promise.reject(e);
            }
        }
        return Promise.reject(error);
    }
);

export default secureAxios;