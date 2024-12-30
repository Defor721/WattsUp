"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { useAuthStore } from "@/auth/useAuthStore";
import { useDialog } from "@/hooks/useDialog";
import useAccessToken from "@/auth/useAccessToken";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showDialog, DialogComponent } = useDialog();
  const { setAccessToken, resetAccessToken } = useAccessToken();

  const {
    accessToken,
    error,
    message,
    redirectTo,
    actions: { socialLogin, resetLoginState },
  } = useAuthStore();

  useEffect(() => {
    const code = searchParams.get("code");
    if (code) socialLogin(code);
  }, [searchParams]);

  useEffect(() => {
    if (accessToken) {
      setAccessToken(accessToken);
      resetLoginState();
      router.push(redirectTo);
    }
  }, [accessToken]);

  // 에러 상태 감지 시 모달 표시
  useEffect(() => {
    if (error && message) {
      showDialog({
        title: "로그인 안내",
        description: message,
        confirmText: "확인",
        onConfirm: () => {
          router.push(redirectTo);
          resetAccessToken();
          resetLoginState();
        },
      });
    }
  }, [error]);

  return (
    <>
      <DialogComponent />
    </>
  );
}
