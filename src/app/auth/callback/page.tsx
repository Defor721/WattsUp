"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { useEffect } from "react";

/**
 * API 라우트에 POST 요청으로 서버에 인증 코드 전달
 */
const handleCodeExchange = async (
  code: string,
  router: ReturnType<typeof useRouter>
) => {
  try {
    const response = await fetch("/api/auth/exchange", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ authorizationCode: code }),
    });

    const data = await response.json();

    // 성공 시 리다이렉트 처리
    if (data.user) {
      router.push("/"); // 리다이렉트할 경로
    }
  } catch (error) {
    console.error("Authorization Code를 교환중 에러가 발생했습니다.", error);
  }
};

/**
 * Authorized redirect URIs로 code를 성공적으로 받아왔다면 토큰 요청
 */
export default function AuthCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const code = searchParams.get("code"); // 인증 코드 추출
    if (code) handleCodeExchange(code, router);
  }, [router, searchParams]);

  return <div>로그인 처리 중...</div>;
}
