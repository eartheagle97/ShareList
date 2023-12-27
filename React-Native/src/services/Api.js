import axios from "axios";

const instance = axios.create({
  baseURL: "http://192.168.12.123:8080", // Replace with your backend API URL for mobile
  timeout: 5000, // Set your desired timeout
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      // Network error (e.g., no internet connection)
      console.error("Network Error:", error.message);
    } else {
      // Handle other errors
      console.error("Error Status:", error.response.status);
      console.error("Error Data:", error.response.data);
    }
    return Promise.reject(error);
  }
);

export default instance;
