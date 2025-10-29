
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://medtrax.me/api/",
  withCredentials: true,
  header:{
    'Content-Type': 'application/json',
  }
});


axiosInstance.interceptors.request.use((config) => {
  const csrfToken = getCookie("csrftoken"); 
  if (csrfToken) {
    config.headers["X-CSRFToken"] = csrfToken; 
  }
  return config;
});

function getCookie(name) {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : null;
}


export default axiosInstance;
