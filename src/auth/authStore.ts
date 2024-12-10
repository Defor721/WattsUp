"use client";

import { create } from "zustand";

import { setCookie, getCookie, deleteCookie } from "@/utils/cookieHelper";

import { exchangeSocialToken } from "./authService";

interface AuthState {
  accessToken: string | null;
  user: any | null;
  actions: {
    loginWithSocialToken: (code: string) => Promise<string | undefined>;
    setAccessToken: (token: string, expiresIn: number) => void;
    resetAccessToken: () => void;
    setUser: (user: any) => void;
  };
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: getCookie("access_token"),
  user: null,
  actions: {
    async loginWithSocialToken(code: string) {
      // **응답 데이터 타입 지정**
      const response = await exchangeSocialToken(code);

      const { access_token, expires_in, redirectTo, user, message } = response;

      // **409 처리: 오류 발생 시 리다이렉트 반환**
      if (message && redirectTo) {
        console.warn("409 에러 발생:", message);
        return redirectTo; // 리다이렉트 경로 반환
      }

      // **로그인 성공 검증**
      if (!access_token || !user) {
        throw new Error("로그인 실패: 필수 정보가 없습니다.");
      }

      // **Access Token 및 상태 관리**
      setCookie("access_token", access_token, Number(expires_in));
      set({ accessToken: access_token, user });

      console.log("로그인 성공, redirectTo:", redirectTo);
      return redirectTo || "/";
    },

    setAccessToken: (token: string, expiresIn: number) => {
      setCookie("access_token", token, expiresIn);
      set({ accessToken: token });
    },

    resetAccessToken: () => {
      deleteCookie("access_token");
      set({ accessToken: null });
    },

    setUser: (user) => set({ user }),
  },
}));
