"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useCallback } from "react";

import { useAuthStore } from "@/auth/authStore";

/**
 * 구글에게 토큰을 받기 위한 임시 코드를 받는 콜백 페이지
 */
export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loginWithSocialToken } = useAuthStore((state) => state.actions);

  const handleSocialLogin = useCallback(
    async (code: string) => {
      try {
        const redirectTo = await loginWithSocialToken(code);

        router.push(redirectTo || "/");
      } catch (error: any) {
        if (error.response?.status === 409) {
          const redirectTo = error.response.data.redirectTo || "/login";
          router.push(`${redirectTo}?error=already_registered`);
        } else {
          console.error("로그인 실패:", error);
          router.push("/");
        }
      }
    },
    [loginWithSocialToken, router],
  );

  useEffect(() => {
    const code = searchParams.get("code");
    if (code) handleSocialLogin(code);
  }, [handleSocialLogin, searchParams]);

  return <div>로그인 처리 중...</div>;
}
