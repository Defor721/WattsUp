import axios, { AxiosInstance } from "axios";

const MOCK_BASE_URL =
  process.env.NEXT_PUBLIC_ENVIRONMENT === "development"
    ? "http://localhost:3000"
    : process.env.NEXT_PUBLIC_API_BASE_URL;

class ApiInstance {
  public static create(): AxiosInstance {
    const instance = axios.create({
      baseURL: MOCK_BASE_URL,
      withCredentials: true,
    });

    // 요청 인터셉터
    instance.interceptors.request.use(handleRequest, handleRequestError);
    // 응답 인터셉터
    instance.interceptors.response.use(handleResponse, handleResponseError);

    return instance;
  }
}

export default ApiInstance;
