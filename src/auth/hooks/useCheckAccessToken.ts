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
    console.log(`useCheckAccessToken useEffect`);
    const checkAccessToken = async () => {
      try {
        if (!accessToken) return;

        await fetchCurrentUser();
      } catch (error) {
        resetAccessToken();
      }
    };
    checkAccessToken();
  }, [accessToken, pathname]);
}
