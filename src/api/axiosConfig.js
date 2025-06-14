import axios from "axios";

const instance = axios.create({
  baseURL: "http://chessbackend-production.up.railway.app",
  withCredentials: true, // 👈 this is crucial for sending cookies like JSESSIONID
});

export default instance;
