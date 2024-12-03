"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

const handleCodeExchange = async (code: string) => {
  try {
    // API 라우트에 POST 요청으로 인증 코드 전달
    const response = await fetch("/api/auth/exchange", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }),
    });

    const data = await response.json();
    // console.log("User Info:", data);

    // // 성공 시 리다이렉트 처리
    // if (data.user) {
    //   window.location.href = "/dashboard"; // 리다이렉트할 경로
    // }
  } catch (error) {
    console.error("Error exchanging code:", error);
  }
};

export default function AuthCallbackPage() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("code"); // 인증 코드 추출
    if (code) handleCodeExchange(code); // 인증 코드를 서버로 전달
  }, [searchParams]);

  return <div>로그인 처리 중...</div>;
}
