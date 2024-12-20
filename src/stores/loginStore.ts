import { create } from "zustand";

export const useAuthStore = create((set) => {
  return {
    // isLogin: false,

    actions: {
      login: () => set({ isLogin: true }),
      logout: () => set({ isLogin: false }),
    },
  };
  interface LoginState {
    isLogin: boolean; // isLogin의 타입을 명확히 정의
  }
});
