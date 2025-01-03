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
import useAccessToken from "@/auth/useAccessToken";
import LoginForm from "@/auth/components/login/loginForm";
import ArrowBack from "@/components/common/ArrowBack";

export default function LoginPage() {
  const router = useRouter();
  const { setAccessToken } = useAccessToken();

  const {
    accessToken,
    redirectTo,
    actions: { resetLoginState },
  } = useAuthStore();

  useEffect(() => {
    resetLoginState();
  }, []);

  useEffect(() => {
    if (accessToken) {
      setAccessToken(accessToken);
      resetLoginState();
      router.push(redirectTo);
    }
  }, [accessToken]);

  return (
    <div className="mx-auto my-20 w-[400px]">
      <Card className="relative flex flex-col p-5">
        <ArrowBack path={"/"} />
        {/* 로그인 헤더 */}
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">로그인</CardTitle>
          <CardDescription>로그인을 위한 정보를 입력해주세요.</CardDescription>
        </CardHeader>
        {/* 로그인 컨텐츠 */}
        <LoginForm />
      </Card>
    </div>
  );
}
