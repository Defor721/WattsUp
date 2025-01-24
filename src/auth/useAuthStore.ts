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
        console.log(`check handleAction: `, response);
        if (response.resultType === "SUCCESS") {
          onSuccess(response.result);
        } else {
          console.log(`check handleAction not success: `, response);
          set({
            error: true,
            message: response.result?.message || "처리 중 오류가 발생했습니다.",
            loading: false,
          });
        }
      } catch (error: any) {
        console.log(`check handleAction error: `, error);
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
      const { actions } = useAuthStore.getState();
      await actions.handleAction(
        () => socialSignup(password),
        (result) => {
          console.log(`socialSignup: `, result.data.accessToken);
          set({
            accessToken: result.data.accessToken,
            message: result.message,
            redirectTo: "/",
            error: false,
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
              message: result.message,
              redirectTo: "/login/additional",
              error: false,
            });
          }
          if (result.data.resultCode === "LOGIN_SUCCESS") {
            set({
              accessToken: result.data.accessToken,
              message: result.message,
              redirectTo: "/",
              error: false,
            });
          }
        },
      );
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
      const { actions } = useAuthStore.getState();
      await actions.handleAction(
        () => loginWithEmailAndPassword(email, password),
        (result) => {
          set({
            accessToken: result.data.accessToken,
            redirectTo: "/",
            error: false,
            message: result.message,
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
            message: result.message,
            error: false,
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
            message: result.message,
            error: false,
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

// /** 소셜 회원가입 */
// async socialSignup(password) {
//   await useAuthStore.getState().actions.handleAction(
//     () => socialSignup(password),
//     (data) => {
//       set({
//         accessToken: data.accessToken,
//         redirectTo: "/",
//         error: false,
//         message: data.message,
//       });
//     },
//   );
// },

// /** 소셜 로그인 */
// async socialLogin(code: string) {
//   await useAuthStore.getState().actions.handleAction(
//     () => exchangeSocialToken(code),
//     (data) => {
//       if (data.message === "추가 정보 입력이 필요합니다.") {
//         set({
//           accessToken: null,
//           message: data.message,
//           redirectTo: "/login/additional",
//           error: false,
//         });
//       } else {
//         set({
//           accessToken: data.accessToken,
//           redirectTo: "/",
//           message: data.message,
//           error: false,
//         });
//       }
//     },
//   );
// },

// /** 일반 회원가입 */
// async nativeSignup(password) {
//   await useAuthStore.getState().actions.handleAction(
//     () => nativeSignup({ password }),
//     (data) => {
//       set({
//         redirectTo: "/login",
//         error: false,
//         message: data.message,
//       });
//     },
//   );
// },

// /** 일반 로그인 */
// async nativeLogin(email: string, password: string) {
//   await useAuthStore.getState().actions.handleAction(
//     () => loginWithEmailAndPassword(email, password),
//     (data) => {
//       set({
//         accessToken: data.accessToken,
//         redirectTo: "/",
//         error: false,
//         message: data.message,
//       });
//     },
//   );
// },

// /** 로그아웃 */
// async logout() {
//   await useAuthStore.getState().actions.handleAction(
//     () => logout(),
//     (data) => {
//       set({
//         redirectTo: "/",
//         message: data.message,
//         error: false,
//       });
//     },
//   );
// },

// /** 회원 탈퇴 */
// async withdrawalAccount(password: string) {
//   await useAuthStore.getState().actions.handleAction(
//     () => deleteUser(password),
//     (data) => {
//       set({
//         redirectTo: "/",
//         message: data.message,
//         error: false,
//       });
//     },
//   );
// },
