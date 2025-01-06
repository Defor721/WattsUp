import { create } from "zustand";

import { User } from "@/auth/type";
import {
  fetchCurrentUser,
  updatePasswordByEmail,
  updatePasswordByPassword,
} from "@/services/userService";

export interface changePasswordProps {
  currentPassword: string;
  newPassword: string;
}

export interface UserState {
  user: User | null;
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
    resetUserState: () => void;
  };
}

const NULL_USER_STATE: Omit<UserState, "actions"> = {
  user: null,
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
          if (state.user?.email !== user.userData.email) {
            return { ...state, user: user.userData };
          }
          return state;
        });
      } catch (error: any) {
        set({
          user: null,
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
      } finally {
        set({ loading: false });
      }
    },

    /** 스토어 상태 초기화 */
    resetUserState: () => set(NULL_USER_STATE),
  },
}));
