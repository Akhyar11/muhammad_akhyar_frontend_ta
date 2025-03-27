import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

// Create an axios instance
export const axiosInstance = axios.create({
  baseURL,
});
