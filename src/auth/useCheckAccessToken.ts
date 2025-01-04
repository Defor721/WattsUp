"use client";

import { useEffect } from "react";

import { useUserStore } from "@/stores/useUserStore";

import useAccessToken from "./useAccessToken";

export default function useCheckAccessToken(): void {
  const { accessToken, resetAccessToken } = useAccessToken();
  const {
    actions: { fetchCurrentUser },
  } = useUserStore();

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
