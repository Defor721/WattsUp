import axios, { AxiosInstance } from "axios";
// import {
//   handleRequest,
//   handleRequestError,
//   handleResponse,
//   handleResponseError,
// } from "./interceptors";

const MOCK_BASE_URL =
  process.env.NEXT_PUBLIC_ENVIRONMENT === "development"
    ? "http://localhost:3000"
    : process.env.NEXT_PUBLIC_API_BASE_URL;

// axios 인스턴스 생성
const apiClient: AxiosInstance = axios.create({
  baseURL: MOCK_BASE_URL || "http://localhost:3000",
});

// 인터셉터
// apiClient.interceptors.request.use(handleRequest, handleRequestError);
// apiClient.interceptors.response.use(handleResponse, handleResponseError);

export default apiClient;
