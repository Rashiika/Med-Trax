import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://medtrax.me/api/",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, 
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        console.log("Attempting to refresh token...");
        const refreshResponse = await axios.post(
          "https://medtrax.me/api/refresh-token/",
          {},
          { withCredentials: true }
        );
        console.log("Refresh successful!", refreshResponse.status); // Log success
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token FAILED:", refreshError.response || refreshError); // Log the refresh error
        // Don't automatically redirect here - let ProtectedRoute handle it
        console.log("⚠️ Token refresh failed, but letting ProtectedRoute handle auth redirect");
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;