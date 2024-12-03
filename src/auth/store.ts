import { create } from "zustand";

const useAuthStore = create((set) => ({
  user: null,
  // TODO: 타입 고치기
  setUser: (userData: unknown) => set({ user: userData }),
  clearUser: () => set({ user: null }),
}));

export default useAuthStore;
