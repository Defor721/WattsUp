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
    // TODO: 만료된 리프레시 토큰도 받아야 하는지 확인
    const checkAccessToken = async () => {
      try {
        if (!accessToken) return;
        await fetchCurrentUser();
      } catch (error) {
        resetAccessToken();
      }
    };
    checkAccessToken();
  }, [accessToken, fetchCurrentUser, resetAccessToken]);
}
