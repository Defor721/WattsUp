"use client";

import { create } from "zustand";

import {
  exchangeSocialToken,
  loginWithEmailAndPassword,
} from "@/auth/authService";
import { fetchCurrentUser } from "@/services/userService";
import { deleteCookie } from "@/utils/cookieHelper";

interface User {
  businessNumber: number;
  businessType: string;
  companyName: string;
  corporateNumber: number | null;
  email: string;
  personalId: number | null;
  provider: null | string;
  signupType: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  redirectTo: string;
  error: boolean;
  message: string | null;
  actions: {
    nativeLogin: (email: string, password: string) => Promise<void>;
    socialLogin: (code: string) => Promise<void>;
    fetchCurrentUser: () => Promise<void>;
    resetLoginState: () => void;
  };
}

export const useLoginStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  redirectTo: "/",
  error: false,
  message: null,
  actions: {
    async nativeLogin(email: string, password: string) {
      try {
        const { accessToken } = await loginWithEmailAndPassword(
          email,
          password,
        );

        set({
          accessToken: accessToken,
          redirectTo: "/",
          error: false,
          message: null,
        });
      } catch (error: any) {
        set({
          redirectTo: "/login",
          error: true,
          message:
            error.response.data.message ||
            "잘못된 로그인 시도입니다. 옳바른 방법으로 다시 시도해주세요.",
        });
      }
    },

    async socialLogin(code: string) {
      try {
        const { accessToken, redirectTo } = await exchangeSocialToken(code);

        set({
          accessToken: accessToken,
          redirectTo: redirectTo || "/",
          error: false,
          message: null,
        });
      } catch (error: any) {
        set({
          redirectTo: error.response.data.redirectTo || "/login",
          error: true,
          message:
            error.response.data.message ||
            "잘못된 로그인 시도입니다. 옳바른 방법으로 다시 시도해주세요.",
        });
      }
    },

    async fetchCurrentUser() {
      try {
        const user = await fetchCurrentUser();
        set((state) => {
          if (state.user?.email === user.userData.email) {
            return state;
          }
          return { ...state, user: user.userData };
        });
      } catch (error: any) {
        deleteCookie("accessToken");
        set({
          user: null,
          message:
            error.response.data.message ||
            "잘못된 로그인 시도입니다. 옳바른 방법으로 다시 시도해주세요.",
        });
      }
    },

    resetLoginState: () => {
      set({
        user: null,
        accessToken: null,
        redirectTo: "/",
        error: false,
        message: null,
      });
    },
  },
}));
