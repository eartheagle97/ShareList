// src/services/api.js
import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8080", // Replace with your backend API URL
  timeout: 5000, // Set your desired timeout
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export default instance;