import { create } from "zustand";

export const useLoginStore = create((set) => {
  return {
    isLogin: false,

    actions: {
      login: () => set({ isLogin: true }),
      logout: () => set({ isLogin: false }),
    },
  };
});
