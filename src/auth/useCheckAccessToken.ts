"use client";

import { useEffect } from "react";

import { fetchCurrentUser } from "@/services/userService";

import useAccessToken from "./useAccessToken";

export default function useCheckAccessToken(): void {
  const { accessToken, resetAccessToken } = useAccessToken();

  useEffect(() => {
    const checkAccessToken = async () => {
      try {
        await fetchCurrentUser();
      } catch (error) {
        console.log("토큰 유효성 확인 중 에러 발생", error);
        resetAccessToken();
      }
    };
    checkAccessToken();
  }, [accessToken, resetAccessToken]);
}
