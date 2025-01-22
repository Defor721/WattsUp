import { create } from "zustand";

import { NULL_USER, User } from "@/auth/type";
import {
  fetchCurrentUser,
  getEmailByCorporateNumber,
  updatePasswordByEmail,
  updatePasswordByPassword,
} from "@/services/userService";
import { updateCredit } from "@/services/tradeService";

interface Response {
  resultType: "SUCCESS" | "FAIL";
  result?: {
    message: string;
    errorCode?: string;
    data?: any;
  };
}

export interface changePasswordProps {
  currentPassword: string;
  newPassword: string;
}

export interface findEmailProps {
  businessNumber: string;
  corporateNumber: string;
}

export interface UserState {
  user: User;
  error: boolean;
  loading: boolean;
  message: string;
  actions: {
    handleAction(
      asyncFn: () => Promise<any>,
      onSuccess: (data: any) => void,
    ): unknown;
    fetchCurrentUser: () => Promise<void>;
    resetPassword: (newPassword: string) => Promise<void>;
    changePassword: ({
      currentPassword,
      newPassword,
    }: changePasswordProps) => Promise<void>;
    findEmail: ({
      businessNumber,
      corporateNumber,
    }: findEmailProps) => Promise<void>;
    chargeCredit: (charge: number) => Promise<void>;
    resetUserState: () => void;
  };
}

const NULL_USER_STATE: Omit<UserState, "actions"> = {
  user: NULL_USER,
  loading: false,
  error: false,
  message: "",
};

export const useUserStore = create<UserState>((set) => ({
  ...NULL_USER_STATE,
  actions: {
    /** 공통 액션 처리 함수 */
    async handleAction(
      asyncFn: () => Promise<Response>,
      onSuccess: (data: Response["result"]) => void,
    ) {
      const { loading } = useUserStore.getState();
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

    /** 현재 유저 데이터 조회 */
    async fetchCurrentUser() {
      const state = useUserStore.getState();
      if (state.loading) return;
      try {
        set({ loading: true });
        const user = await fetchCurrentUser();
        set((state) => {
          if (state.user !== user.userData) {
            return { ...state, user: user.userData };
          }
          return state;
        });
      } catch (error: any) {
        set({
          user: NULL_USER,
          error: true,
          message: error.response.data.message,
        });
        throw error;
      } finally {
        set({ loading: false });
      }
    },

    /** 비밀번호 리셋 */
    async resetPassword(newPassword: string) {
      try {
        set({ loading: true });
        await updatePasswordByEmail(newPassword);
        set({ error: false });
      } catch (error: any) {
        set({ error: true, message: error.response.data.message });
        throw error;
      } finally {
        set({ loading: false });
      }
    },

    /** 비밀번호 변경 */
    async changePassword({
      currentPassword,
      newPassword,
    }: changePasswordProps) {
      try {
        set({ loading: true });
        await updatePasswordByPassword({ currentPassword, newPassword });
        set({ error: false });
      } catch (error: any) {
        set({ error: true, message: error.response.data.message });
        throw error;
      } finally {
        set({ loading: false });
      }
    },

    /** 이메일 찾기 */
    async findEmail({ businessNumber, corporateNumber }: findEmailProps) {
      const { actions } = useUserStore.getState();
      await actions.handleAction(
        () =>
          getEmailByCorporateNumber({
            businessNumber,
            corporateNumber,
          }),
        (data) => {
          set({
            user: data.user,
            message: `${data.message} ${data.data.maskEmail}`,
            error: false,
          });
        },
      );
    },

    /** 크레딧 충전 */
    async chargeCredit(charge: number) {
      try {
        set({ loading: true });
        const data = await updateCredit(charge);
        set({
          message: `${data.message} ${data.data}`,
          error: false,
        });
      } catch (error: any) {
        set({ error: true, message: error.response.data.message });
        throw error;
      } finally {
        set({ loading: false });
      }
    },

    /** 스토어 상태 초기화 */
    resetUserState: () => set(NULL_USER_STATE),
  },
}));
