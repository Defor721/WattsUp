import { create } from "zustand";

import { NULL_USER, User } from "@/auth/type";
import {
  fetchCurrentUser,
  getEmailByCorporateNumber,
  updatePasswordByEmail,
  updatePasswordByPassword,
} from "@/services/userService";
import { updateCredit } from "@/services/tradeService";

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
    chargeCredit: (charge: string) => Promise<void>;
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
      try {
        set({ loading: true });
        const data = await getEmailByCorporateNumber({
          businessNumber,
          corporateNumber,
        });
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

    /** 예치금 충전 */
    async chargeCredit(charge: string) {
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
