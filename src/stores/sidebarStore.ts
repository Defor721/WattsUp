import { create } from "zustand";

// 상태 타입 정의
type SidebarStore = {
  isOpen: boolean; // 사이드바 열림/닫힘 상태
  toggle: () => void; // 상태 토글 함수
  close: () => void; // 상태 닫기 함수
};

// Zustand 스토어 생성
export const useSidebarStore = create<SidebarStore>((set) => ({
  isOpen: true, // 초기값: 닫힘 상태
  toggle: () => set((state) => ({ isOpen: !state.isOpen })), // 상태 토글
  close: () => set({ isOpen: false }), // 상태 닫기
}));
