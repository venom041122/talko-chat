import axios from "axios";

axiosInstance.post(url, data, {
  maxContentLength: 50 * 1024 * 1024, // 50 MB
  maxBodyLength: 50 * 1024 * 1024,
});

export const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/api",
  withCredentials: true,
});
