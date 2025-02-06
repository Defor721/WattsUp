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
  isError: false,
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
            isError: true,
            message: response.result?.message || "처리 중 오류가 발생했습니다.",
            loading: false,
          });
        }
      } catch (error: any) {
        set({
          isError: true,
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
      const { actions } = useAuthStore.getState();
      await actions.handleAction(
        () => socialSignup(password),
        (result) => {
          set({
            accessToken: result.data.accessToken,
            message: result.data.userMessage,
            redirectTo: "/",
            isError: false,
          });
        },
      );
    },

    /** 소셜 로그인 */
    async socialLogin(code: string) {
      const { actions } = useAuthStore.getState();
      await actions.handleAction(
        () => exchangeSocialToken(code),
        (result) => {
          if (result.data.resultCode === "INFO_REQUIRED") {
            set({
              accessToken: null,
              message: result.data.userMessage,
              redirectTo: "/login/additional",
              isError: false,
            });
          }
          if (result.data.resultCode === "LOGIN_SUCCESS") {
            set({
              accessToken: result.data.accessToken,
              message: result.data.userMessage,
              redirectTo: "/",
              isError: false,
            });
          }
        },
      );
    },

    /** 일반 회원가입 */
    async nativeSignup(password) {
      await useAuthStore.getState().actions.handleAction(
        () => nativeSignup({ password }),
        (result) => {
          set({
            redirectTo: "/login",
            isError: false,
            message: result.data.userMessage,
          });
        },
      );
    },

    /** 일반 로그인 */
    async nativeLogin(email: string, password: string) {
      const { actions } = useAuthStore.getState();
      await actions.handleAction(
        () => loginWithEmailAndPassword(email, password),
        (result) => {
          set({
            accessToken: result.data.accessToken,
            redirectTo: "/",
            isError: false,
            message: result.data.userMessage,
          });
        },
      );
    },

    /** 로그아웃 */
    async logout() {
      const { actions } = useAuthStore.getState();
      await actions.handleAction(
        () => logout(),
        (result) => {
          set({
            redirectTo: "/",
            message: result.data.userMessage,
            isError: false,
          });
        },
      );
    },

    /** 회원 탈퇴 */
    async withdrawalAccount(password: string) {
      const { actions } = useAuthStore.getState();
      await actions.handleAction(
        () => deleteUser(password),
        (result) => {
          set({
            redirectTo: "/",
            message: result.data.userMessage,
            isError: false,
          });
        },
      );
    },

    /** message 변경 */
    setMessageState: (message) => set({ message }),

    /** 스토어 상태 초기화 */
    resetAuthState: () => set(NULL_AUTH_STATE),
  },
}));
