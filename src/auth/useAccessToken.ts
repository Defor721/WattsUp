"use client";

import { getCookie, setCookie, deleteCookie } from "@/utils/cookieHelper";

/**
 * 액세스 토큰 관리 훅
 */
export default function useAccessToken() {
  // 현재 토큰 값 읽기
  const accessToken = getCookie("access_token");

  // 액세스 토큰 설정 함수
  const setAccessToken = (token: string, expires_in: number) => {
    setCookie("access_token", token, expires_in);
  };

  // 액세스 토큰 삭제 함수
  const resetAccessToken = () => {
    deleteCookie("access_token");
  };

  return {
    accessToken,
    setAccessToken,
    resetAccessToken,
  };
}
