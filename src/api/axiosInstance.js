import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://medtrax.me/api/",
  headers: { "Content-Type": "application/json" },
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
          "https://medtrax.me/api/auth/refresh-token/",
          {},
          { withCredentials: true }
        );

        console.log("Refresh successful!", refreshResponse.status);
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error(
          "Refresh token FAILED:",
          refreshError.response?.data || refreshError
        );

        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;