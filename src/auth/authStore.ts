"use client";

import { create } from "zustand";

import { setCookie, getCookie, deleteCookie } from "@/utils/cookieHelper";

import { AuthState } from "./type";

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: getCookie("access_token"),
  user: null,
  actions: {
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
    /** 유저 데이터 변경 */
    setUser: (user) => {
      set({ user });
    },
  },
}));
