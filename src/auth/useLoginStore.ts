"use client";

import { create } from "zustand";

import { exchangeSocialToken } from "@/auth/authService";

interface AuthState {
  accessToken: string | null;
  expires_in: number | null;
  redirectTo: string;
  error: boolean;
  message: string | null;
  actions: {
    loginWithSocialCode: (code: string) => Promise<void>;
    reset: () => void;
  };
}

export const useLoginStore = create<AuthState>((set) => ({
  accessToken: null,
  expires_in: null,
  redirectTo: "/",
  error: false,
  message: null,
  actions: {
    async loginWithSocialCode(code: string) {
      try {
        const { access_token, expires_in, redirectTo } =
          await exchangeSocialToken(code);

        set({
          accessToken: access_token,
          expires_in: Number(expires_in),
          redirectTo: redirectTo || "/",
          error: false,
          message: null,
        });
      } catch (error: any) {
        set({
          redirectTo: error.response.data.redirectTo || "/login",
          error: true,
          message: error.response.data.message || "로그인 실패",
        });
      }
    },

    reset: () => {
      set({
        accessToken: null,
        redirectTo: "/",
        error: false,
        message: null,
      });
    },
  },
}));
