"use client";

import { useCallback, useEffect } from "react";

import { useAuthStore } from "./store";

export default function useCheckAccessToken() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const { resetAccessToken } = useAuthStore((state) => state.actions);

  const fetchCurrentUser = useCallback(async () => {
    try {
      // 현재 유저 정보 조회 api 실핼
    } catch (error) {
      console.error(error);
      resetAccessToken();
    }
  }, [resetAccessToken]);

  useEffect(() => {
    fetchCurrentUser();
  }, [accessToken, fetchCurrentUser]);
}
