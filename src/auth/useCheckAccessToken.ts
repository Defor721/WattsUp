"use client";

import { useEffect } from "react";

import { useAuthStore } from "./authStore";
import { fetchCurrentUser } from "./authService";

export default function useCheckAccessToken() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const { resetAccessToken } = useAuthStore((state) => state.actions);

  useEffect(() => {
    const verifyAccessToken = async () => {
      if (!accessToken) return;

      try {
        await fetchCurrentUser();
      } catch (error) {
        console.error(error);
        resetAccessToken();
      }
    };
    verifyAccessToken();
  }, [accessToken, resetAccessToken]);
}
