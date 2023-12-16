import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:4001/api",
});

export const setAxiosInstanceToken = (token) => {
  axiosInstance.defaults.headers.common["Authorization"] = "Bearer " + token;
};
