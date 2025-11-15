import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://medtrax.me/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // important because backend sends refresh token as HttpOnly cookie
});

// Prevent multiple refresh calls
let isRefreshing = false;
let failedQueue = [];

// Process all queued API calls
const processQueue = (error, token = null) => {
  failedQueue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve(token);
  });
  failedQueue = [];
};

// Add access token before every request
axiosInstance.interceptors.request.use(
  (config) => {
    const access = localStorage.getItem("access");
    if (access) {
      config.headers.Authorization = `Bearer ${access}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle auto-refresh logic
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Ignore if there's no response
    if (!error.response) {
      return Promise.reject(error);
    }

    // Only refresh when token expired (401) and we have a refresh token
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Check if we even have tokens to refresh
      const hasRefreshToken = document.cookie.includes('refresh') || localStorage.getItem('refresh');
      if (!hasRefreshToken) {
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        window.location.href = '/login';
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // 👇 Queue failed calls until refresh is done
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token) => {
              originalRequest.headers.Authorization = "Bearer " + token;
              resolve(axiosInstance(originalRequest));
            },
            reject: (err) => reject(err),
          });
        });
      }

      isRefreshing = true;

      try {
        // Request new access token using refresh cookie
        const refreshResponse = await axios.post(
          "https://medtrax.me/api/auth/refresh-token/",
          {},
          { withCredentials: true }
        );

        const newAccess = refreshResponse.data?.access;

        if (!newAccess) throw new Error("No access token returned");

        // Store new access token
        localStorage.setItem("access", newAccess);

        // Update header on original request
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;

        // Resolve all queued requests
        processQueue(null, newAccess);

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("❌ Refresh FAILED", refreshError.response?.data);

        processQueue(refreshError, null);

        // Clear tokens
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");

        // Only redirect to login if we're not already on login/landing pages
        if (!window.location.pathname.includes('/login') && 
            !window.location.pathname.includes('/') && 
            !window.location.pathname.includes('/signup') &&
            !window.location.pathname.includes('/select-role')) {
          window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
