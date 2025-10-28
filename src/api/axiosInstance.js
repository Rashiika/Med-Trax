import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://medtrax.me/api/", // your backend API base URL
  withCredentials: true,              // allows cookies/sessions
});

export default axiosInstance;
