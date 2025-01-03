"use client";

import { create } from "zustand";

import {
  exchangeSocialToken,
  loginWithEmailAndPassword,
  nativeSignup,
  socialSignup,
} from "@/auth/services/client/authService";
import { fetchCurrentUser } from "@/services/userService";
import { deleteCookie } from "@/utils";

import { AuthState } from "./type";

const NULL_AUTH_STATE: Omit<AuthState, "actions"> = {
  user: null,
  accessToken: null,
  redirectTo: "/",
  error: false,
  message: null,
  loading: false,
};

export const useAuthStore = create<AuthState>((set) => ({
  ...NULL_AUTH_STATE,
  actions: {
    async socialSignup() {
      try {
        const { accessToken, message } = await socialSignup();
        set({
          accessToken,
          redirectTo: "/",
          error: false,
          message,
        });
      } catch (error: any) {
        throw new Error(
          error.response?.data?.message || "잘못된 소셜로그인 시도입니다.",
        );
      } finally {
        set({ loading: false });
      }
    },

    async socialLogin(code: string) {
      const state = useAuthStore.getState();
      if (state.loading) return;
      try {
        set({ loading: true });
        const { accessToken, message } = await exchangeSocialToken(code);

        if (message === "추가 정보 입력이 필요합니다.") {
          set({
            accessToken: null,
            message,
            redirectTo: "/login/additional",
            error: false,
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
          redirectTo: "/login/error",
          error: true,
          message:
            error.response.data.message ||
            "잘못된 로그인 시도입니다. 옳바른 방법으로 다시 시도해주세요.",
        });
      } finally {
        set({ loading: false });
      }
    },

    async nativeSignup(password) {
      const state = useAuthStore.getState();
      if (state.loading) return;
      try {
        set({ loading: true });
        const { message } = await nativeSignup({
          password,
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
        throw error;
      } finally {
        set({ loading: false });
      }
    },

    async nativeLogin(email: string, password: string) {
      const state = useAuthStore.getState();
      if (state.loading) return;
      try {
        const { accessToken, message } = await loginWithEmailAndPassword(
          email,
          password,
        );

        set({
          accessToken: accessToken,
          redirectTo: "/",
          message,
        });
      } catch (error: any) {
        throw new Error(
          error.response?.data?.message || "잘못된 로그인 시도입니다.",
        );
      } finally {
        set({ loading: false });
      }
    },

    async fetchCurrentUser() {
      const state = useAuthStore.getState();
      if (state.loading) return;
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
      } finally {
        set({ loading: false });
      }
    },

    resetLoginState: () => set(NULL_AUTH_STATE),
  },
}));
