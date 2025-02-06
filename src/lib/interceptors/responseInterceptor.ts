import { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";

import { reissueToken } from "@/auth/services/client/authService";
import { setCookie } from "@/utils";

import apiClient from "../axios";

interface CustomErrorResponse {
  resultType: "SUCCESS" | "FAIL";
  result?: {
    errorCode?: string;
    message?: string;
    data?: any;
  };
}

let isRefreshing = false;
let failedQueue: Array<(token: string) => void> = [];

const logOnDev = (message: string) => {
  if (process.env.NEXT_PUBLIC_ENVIRONMENT === "development")
    console.log(message);
};

// 응답 인터셉터
export const handleResponse = (response: AxiosResponse): AxiosResponse => {
  const { method, url } = response.config;
  const { status } = response;
  logOnDev(`[API] ${method?.toUpperCase()} ${url} | Request ${status}`);

  return response;
};

// 응답 에러 핸들러
export const handleResponseError = async (error: AxiosError) => {
  const { message, response, config } = error;
  const { method, url } = config || {};

  if (!response) {
    logOnDev(
      `[API] ${method?.toUpperCase()} ${url} | Network Error: ${message}`,
    );
    return Promise.reject(error);
  }

  const { status, data } = response as AxiosResponse<CustomErrorResponse>;

  // 만료된 토큰 처리
  if (
    status === 401 &&
    data.result?.errorCode === "AUTH_EXPIRED" &&
    data.result.data.tokenHelper === "accessToken"
  ) {
    return handleTokenRefresh(config as InternalAxiosRequestConfig);
  }

  return Promise.reject(error);
};

// 토큰 갱신 처리
const handleTokenRefresh = async (config: InternalAxiosRequestConfig) => {
  if (!isRefreshing) {
    isRefreshing = true;

    try {
      const data = await reissueToken();

      const { accessToken } = data;

      // 토큰 저장
      setCookie("accessToken", accessToken);

      // 실패한 요청 다시 시도
      failedQueue.forEach((callback) => callback(accessToken));
      failedQueue = [];

      // 갱신된 토큰으로 요청 재시도
      config.headers.Authorization = `Bearer ${accessToken}`;
      return apiClient(config);
    } catch (error) {
      console.error("토큰 갱신 실패:", error);
      throw error;
    } finally {
      isRefreshing = false;
    }
  } else {
    return new Promise((resolve) => {
      failedQueue.push((token: string) => {
        config.headers.Authorization = `Bearer ${token}`;
        resolve(apiClient(config));
      });
    });
  }
};
