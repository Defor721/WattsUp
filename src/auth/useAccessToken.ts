"use client";

import { deleteCookie, getCookie, setCookie } from "@/utils";

/**
 * 액세스 토큰 관리 훅
 */
export default function useAccessToken() {
  // 현재 토큰 값 읽기
  const accessToken = getCookie("accessToken");

  // 액세스 토큰 설정 함수
  const setAccessToken = (token: string) => {
    setCookie("accessToken", token);
  };

  // 액세스 토큰 삭제 함수
  const resetAccessToken = () => {
    deleteCookie("accessToken");
  };

  return {
    accessToken,
    setAccessToken,
    resetAccessToken,
  };
}
