"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect } from "react";

import { useAuthStore } from "@/auth/store";

/**
 * Authorized redirect URIs로 code를 성공적으로 받아왔다면 토큰 요청
 */
export default function AuthCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { fetchAccessToken } = useAuthStore((state) => state.actions);

  const exchangeCodeForToken = useCallback(
    async (code: string) => {
      try {
        await fetchAccessToken(code);
        router.push("/");
      } catch (error) {
        console.error("Error exchanging code for token:", error);
      }
    },
    [fetchAccessToken, router]
  );

  useEffect(() => {
    const code = searchParams.get("code");
    if (code) {
      exchangeCodeForToken(code);
    }
  }, [exchangeCodeForToken, searchParams]);

  return <div>로그인 처리 중...</div>;
}
