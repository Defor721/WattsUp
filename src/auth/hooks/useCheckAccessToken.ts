/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

import { useUserStore } from "@/stores/useUserStore";

import useAccessToken from "./useAccessToken";

export default function useCheckAccessToken(): void {
  const pathname = usePathname();
  const { accessToken, resetAccessToken } = useAccessToken();
  const fetchCurrentUser = useUserStore(
    (state) => state.actions.fetchCurrentUser,
  );

  useEffect(() => {
    const checkAccessToken = async () => {
      try {
        if (!accessToken) return;

        await fetchCurrentUser();
      } catch (error) {
        console.log("에러임");
        resetAccessToken();
      }
    };
    checkAccessToken();
  }, [accessToken, pathname]);
}
