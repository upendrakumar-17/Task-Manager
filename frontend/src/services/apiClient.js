import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
  withCredentials: true, // remove if not using cookies/auth
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;