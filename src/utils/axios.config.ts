import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// Create an axios instance
export const axiosInstance = axios.create({
  baseURL,
});
