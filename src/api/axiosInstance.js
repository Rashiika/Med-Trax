import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://medtrax.me/api/",
  withCredentials: true,
  header:{
    'Content-Type': 'application/json',
  }
});

export default axiosInstance;
