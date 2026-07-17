import axios from "axios";

const api = axios.create({
  baseURL: "https://6a4b368df5eab0bb6b62574e.mockapi.io"
});

export default api;