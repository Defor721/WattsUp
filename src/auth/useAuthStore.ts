"use client";

import { create } from "zustand";

import {
  exchangeSocialToken,
  loginWithEmailAndPassword,
  nativeSignup,
  socialSignup,
} from "@/auth/authService";
import { fetchCurrentUser } from "@/services/userService";
import { deleteCookie } from "@/utils";

import { AuthState } from "./type";

const NULL_AUTH_STATE: Omit<AuthState, "actions"> = {
  user: null,
  accessToken: null,
  redirectTo: "/",
  error: false,
  message: null,
};

export const useAuthStore = create<AuthState>((set) => ({
  ...NULL_AUTH_STATE,
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
        const { accessToken, message } = await exchangeSocialToken(code);

        if (message === "추가 정보 입력이 필요합니다.") {
          set({
            accessToken: null,
            message,
            redirectTo: "/login/additional",
            error: true,
          });
        } else {
          set({
            accessToken,
            redirectTo: "/",
            message,
            error: false,
          });
        }
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

    async socialSignup({
      businessNumber,
      startDate,
      principalName,
      companyName,
      businessType,
      corporateNumber,
      personalId,
    }) {
      try {
        const { accessToken, message } = await socialSignup({
          businessNumber,
          startDate,
          principalName,
          companyName,
          businessType,
          corporateNumber,
          personalId,
        });
        set({
          accessToken,
          redirectTo: "/",
          error: false,
          message,
        });
      } catch (error: any) {
        set({
          redirectTo: "/additional",
          error: true,
          message:
            error.response.data.message ||
            "추가정보를 입력받아 로그인 처리 중 오류가 발생했습니다. 다시 시도해주세요.",
        });
      }
    },

    async nativeSignup({
      password,
      businessType,
      corporateNumber,
      personalId,
    }) {
      try {
        const { message } = await nativeSignup({
          password,
          businessType,
          corporateNumber,
          personalId,
        });
        set({
          redirectTo: "/login",
          error: false,
          message,
        });
      } catch (error: any) {
        set({
          redirectTo: "/signup",
          error: true,
          message:
            error.response.data.message ||
            "회원가입 처리 중 오류가 발생했습니다. 다시 시도해주세요.",
        });
      }
    },

    async fetchCurrentUser() {
      try {
        const user = await fetchCurrentUser();
        set((state) => {
          if (state.user?.email !== user.userData.email) {
            return { ...state, user: user.userData };
          }
          return state;
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

    resetLoginState: () => set(NULL_AUTH_STATE),
  },
}));
