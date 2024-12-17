import { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";

import { reissueToken } from "@/auth/authService";
import { setCookie } from "@/utils/cookieHelper";

import apiClient from "../axios";

let isRefreshing = false;
let failedQueue: Array<(token: string) => void> = [];

// 응답 인터셉터
export const handleResponse = (response: AxiosResponse): AxiosResponse => {
  console.log(
    `[Response]: ${response.config.method?.toUpperCase()} ${
      response.config.url
    }`,
  );
  return response;
};

// 응답 에러 핸들러
export const handleResponseError = async (error: AxiosError) => {
  const { response, config } = error;

  if (!response) {
    console.error("[Network Error]:", error.message);
    return Promise.reject(error);
  }

  const { status, data } = response;

  // 만료된 토큰 처리
  if (status === 401 && data.message === "Token Expired") {
    return handleTokenRefresh(config as InternalAxiosRequestConfig);
  }

  // 기타 에러 처리
  switch (status) {
    case 400:
      console.error("잘못된 요청입니다.");
      break;
    case 403:
      console.error("권한이 없습니다.");
      break;
    case 404:
      console.error("찾을 수 없는 페이지입니다.");
      break;
    case 500:
      console.error("서버 오류입니다.");
      break;
    default:
      console.error(`에러 발생: ${status}, ${response.statusText}`);
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
