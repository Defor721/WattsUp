import { create } from "zustand";
import Cookies from "js-cookie";
import { AuthState } from "./type";
import ApiInstance from "@/lib/axios";

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: Cookies.get("accessToken") || null, // 쿠키에서 토큰 초기화
  actions: {
    setAccessToken: (token) => {
      Cookies.set("accessToken", token, {
        secure: true,
        sameSite: "Strict",
        expires: 7, // 7일 동안 유효
      });
      set({ accessToken: token });
    },
    resetAccessToken: () => {
      Cookies.remove("accessToken");
      set({ accessToken: null });
    },
    fetchAccessToken: async (code: string) => {
      try {
        const { data } = await ApiInstance.post("/api/auth/exchange", {
          authorizationCode: code,
        });

        // 쿠키와 Zustand 상태에 저장
        Cookies.set("accessToken", data.access_token, {
          secure: true,
          sameSite: "Strict",
          expires: 7,
        });
        set({ accessToken: data.access_token });
      } catch (error) {
        console.error(
          "Authorization Code를 교환중 에러가 발생했습니다.",
          error
        );
        throw error;
      }
    },
  },
}));
