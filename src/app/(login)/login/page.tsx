/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/shadcn";
import { useAuthStore } from "@/auth/useAuthStore";
import useAccessToken from "@/auth/hooks/useAccessToken";
import ArrowBack from "@/components/common/ArrowBack";
import LoginForm from "@/auth/components/login/LoginForm";

export default function LoginPage() {
  const router = useRouter();
  const { setAccessToken } = useAccessToken();

  const {
    accessToken,
    redirectTo,
    actions: { resetAuthState },
  } = useAuthStore();

  useEffect(() => {
    resetAuthState();
  }, []);

  useEffect(() => {
    if (accessToken) {
      setAccessToken(accessToken);
      resetAuthState();
      router.refresh();
      router.push(redirectTo);
    }
  }, [accessToken]);

  return (
    <Card className="relative flex select-none flex-col p-6">
      <ArrowBack path={"/"} />
      {/* 로그인 헤더 */}
      <CardHeader className="px-0">
        <CardTitle className="text-2xl">로그인</CardTitle>
        <CardDescription>로그인을 위한 정보를 입력해주세요.</CardDescription>
      </CardHeader>
      {/* 로그인 컨텐츠 */}
      <LoginForm />
    </Card>
  );
}
