"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { useLoginStore } from "@/auth/useLoginStore";
import { useDialog } from "@/hooks/use-dialog";
import useAccessToken from "@/auth/useAccessToken";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showDialog, DialogComponent } = useDialog();
  const { setAccessToken, resetAccessToken } = useAccessToken();

  const accessToken = useLoginStore((state) => state.accessToken);
  const error = useLoginStore((state) => state.error);
  const message = useLoginStore((state) => state.message);
  const redirectTo = useLoginStore((state) => state.redirectTo);
  const expiresIn = useLoginStore((state) => state.expiresIn);
  const { socialLogin, resetLoginState } = useLoginStore(
    (state) => state.actions,
  );

  useEffect(() => {
    const code = searchParams.get("code");
    if (code) socialLogin(code);
  }, [searchParams]);

  useEffect(() => {
    if (accessToken && expiresIn !== null) {
      setAccessToken(accessToken, expiresIn);
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
          resetLoginState(); // 상태 초기화
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
