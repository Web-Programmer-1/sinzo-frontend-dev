import axios from "axios";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 401) {
      console.error("Unauthorized. Please login again.");
    }

    if (status === 403) {
      console.error("Forbidden access.");
    }

    return Promise.reject(error);
  }
);