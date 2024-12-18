"use client";

import { useEffect } from "react";

import useAccessToken from "./useAccessToken";
import { useAuthStore } from "./useAuthStore";

export default function useCheckAccessToken(): void {
  const { accessToken, resetAccessToken } = useAccessToken();
  const {
    actions: { fetchCurrentUser },
  } = useAuthStore();

  useEffect(() => {
    const checkAccessToken = async () => {
      try {
        if (!accessToken) return;
        await fetchCurrentUser();
      } catch (error) {
        console.log("토큰 유효성 확인 중 에러 발생", error);
        resetAccessToken();
      }
    };
    checkAccessToken();
  }, [accessToken, fetchCurrentUser, resetAccessToken]);
}
