"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useCallback } from "react";

import { exchangeSocialToken } from "@/auth/authService";
import { useAuthStore } from "@/auth/authStore";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAccessToken, setUser, resetAccessToken } = useAuthStore(
    (state) => state.actions,
  );

  const handleSocialLogin = useCallback(
    async (code: string) => {
      try {
        const { access_token, expires_in, redirectTo, user, message } =
          await exchangeSocialToken(code);

        if (message) {
          console.error("로그인 실패:", message);
          router.push("/login");
          return;
        }

        if (redirectTo) {
          router.push(redirectTo);
          return;
        }

        if (access_token && user) {
          setAccessToken(access_token, Number(expires_in));
          setUser(user);
          router.push("/");
        }
      } catch (error) {
        console.error("로그인 처리 중 에러 발생:", error);
        resetAccessToken();
        router.push("/login");
      }
    },
    [setAccessToken, setUser, resetAccessToken, router],
  );

  useEffect(() => {
    const code = searchParams.get("code");
    if (code) handleSocialLogin(code);
  }, [handleSocialLogin, searchParams]);

  return <div>로그인 처리 중...</div>;
}
