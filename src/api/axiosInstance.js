import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://medtrax.me/api/",
  headers: {
    "Content-Type": "application/json",
  },
});


axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
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
      
      const refreshToken = localStorage.getItem("refreshToken");
      
      if (refreshToken) {
        try {
        
          const response = await axios.post("https://medtrax.me/api/refresh-token/", {
            refresh: refreshToken
          });
          
          const newAccessToken = response.data.access;
          localStorage.setItem("accessToken", newAccessToken);
        
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          window.location.href = "/login";
          return Promise.reject(refreshError);
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
