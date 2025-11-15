import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://medtrax.me/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: true, 
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        console.log("Attempting to refresh token...");
        
        const refreshResponse = await axios.post(
          "https://medtrax.me/api/auth/refresh-token/",
          {},
          { withCredentials: true }
        );

        console.log("Refresh successful via cookies!");
        if (refreshResponse.data.access) {
          localStorage.setItem('access', refreshResponse.data.access);
          originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.access}`;
        }
        
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token FAILED:", refreshError.response?.data || refreshError);
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;