"use client";

import { create } from "zustand";

import { AuthState } from "./type";
import ApiInstance from "@/lib/axios";
import { setCookie, getCookie, deleteCookie } from "@/utils/cookieHelper";

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: getCookie("access_token"),
  user: null,
  actions: {
    /** 쿠키 갱신 */
    fetchAccessToken: async (code: string) => {
      try {
        const { data } = await ApiInstance.post("/api/auth/exchange", {
          authorizationCode: code,
        });

        setCookie("access_token", data.access_token, data.expires_in);
        set({ accessToken: data.access_token });
      } catch (error) {
        console.error("Authorization Code를 교환중 에러가 발생했습니다.");
        throw error;
      }
    },
    /** 쿠키 변경 */
    setAccessToken: (token: string, expiresIn: number) => {
      setCookie("access_token", token, expiresIn);
      set({ accessToken: token });
    },
    /** 쿠키 삭제 */
    resetAccessToken: () => {
      deleteCookie("access_token");
      set({ accessToken: null });
    },
  },
}));
