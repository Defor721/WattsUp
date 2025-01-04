"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { Triangle } from "react-loader-spinner";

import { useAuthStore } from "@/auth/useAuthStore";
import useAccessToken from "@/auth/useAccessToken";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { setAccessToken } = useAccessToken();

  const {
    accessToken,
    error,
    message,
    redirectTo,
    actions: { socialLogin, resetAuthState },
  } = useAuthStore();

  useEffect(() => {
    const code = searchParams.get("code");
    const error = searchParams.get("error");
    if (code) socialLogin(code);
    if (error) router.push("/login");
  }, [searchParams]);

  useEffect(() => {
    if (accessToken) {
      setAccessToken(accessToken);
      resetAuthState();
      router.push(redirectTo);
    }
  }, [accessToken]);

  // 에러 상태 감지 시 모달 표시
  useEffect(() => {
    if (!error && message) {
      router.push(redirectTo);
    }

    if (error && message) {
      router.push(redirectTo);
    }
  }, [error, message]);

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center">
        <Triangle
          visible={true}
          height="80"
          width="80"
          color="#4fa94d"
          ariaLabel="triangle-loading"
          wrapperStyle={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "20vh",
            width: "100vw",
          }}
        />
        <p className="mt-4 text-lg">
          로그인 처리 중입니다. 잠시만 기다려주세요...
        </p>
      </div>
    </div>
  );
}
