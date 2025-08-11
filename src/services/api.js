import axios from "axios";
import router from '@/router/index';


axios.defaults.headers.post["Content-Type"] = "application/json";

const defaultAxios = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1',
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token") || ""}`,
    }
});

// Axios interceptr to push users to login route if 401 error comes

defaultAxios.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401) {
            // Redirect to login page if 401 Unauthorized error occurs
            router.push({ name: 'Login' }); // Adjust the route name according to your routes configuration
        }
        return Promise.reject(error);
    }
);

export {
    defaultAxios,
};