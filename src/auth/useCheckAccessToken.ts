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
        console.log(error);
        resetAccessToken();
      }
    };
    checkAccessToken();
  }, [accessToken, resetAccessToken]);
}
