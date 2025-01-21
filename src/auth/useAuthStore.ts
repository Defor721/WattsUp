"use client";

import { create } from "zustand";

import {
  deleteUser,
  exchangeSocialToken,
  loginWithEmailAndPassword,
  logout,
  nativeSignup,
  socialSignup,
} from "@/auth/services/client/authService";

import { AuthState } from "./type";

interface Response {
  resultType: "SUCCESS" | "FAIL";
  result?: {
    message: string;
    errorCode?: string;
    data?: any;
  };
}

const NULL_AUTH_STATE: Omit<AuthState, "actions"> = {
  accessToken: null,
  redirectTo: "/",
  error: false,
  message: null,
  loading: false,
};

export const useAuthStore = create<AuthState>((set) => ({
  ...NULL_AUTH_STATE,
  actions: {
    /** 공통 액션 처리 함수 */
    async handleAction(
      asyncFn: () => Promise<Response>,
      onSuccess: (data: Response["result"]) => void,
    ) {
      const { loading } = useAuthStore.getState();
      if (loading) return;
      try {
        set({ loading: true });
        const response = await asyncFn();
        if (response.resultType === "SUCCESS") {
          onSuccess(response.result);
        } else {
          set({
            error: true,
            message: response.result?.message || "처리 중 오류가 발생했습니다.",
            loading: false,
          });
        }
      } catch (error: any) {
        set({
          error: true,
          message:
            error.response.data.result.data.reason ||
            "알 수 없는 오류가 발생했습니다.",
          loading: false,
        });
      } finally {
        set({ loading: false });
      }
    },

    /** 소셜 회원가입 */
    async socialSignup(password) {
      const state = useAuthStore.getState();
      if (state.loading) return;
      try {
        set({ loading: true });
        const { accessToken, message } = await socialSignup(password);
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

    /** 소셜 로그인 */
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

    /** 일반 회원가입 */
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

    /** 일반 로그인 */
    async nativeLogin(email: string, password: string) {
      console.log(`check nativeLogin`);
      const { actions } = useAuthStore.getState();
      await actions.handleAction(
        () => loginWithEmailAndPassword(email, password),
        (data) => {
          set({
            accessToken: data.accessToken,
            redirectTo: "/",
            error: false,
            message: data.message,
          });
        },
      );
    },

    /** 로그아웃 */
    async logout() {
      await useAuthStore.getState().actions.handleAction(
        () => logout(),
        (data) => {
          set({
            redirectTo: "/",
            message: data.message,
            error: false,
          });
        },
      );
    },

    /** 회원 탈퇴 */
    async withdrawalAccount(password: string) {
      const state = useAuthStore.getState();
      if (state.loading) return;
      try {
        set({ loading: true });
        const { message } = await deleteUser(password);

        set({
          redirectTo: "/",
          message,
          error: false,
        });
      } catch (error: any) {
        throw new Error(
          error.response?.data?.message || "잘못된 회원탈퇴 시도입니다.",
        );
      } finally {
        set({ loading: false });
      }
    },

    /** message 변경 */
    setMessageState: (message) => set({ message }),

    /** 스토어 상태 초기화 */
    resetAuthState: () => set(NULL_AUTH_STATE),
  },
}));
