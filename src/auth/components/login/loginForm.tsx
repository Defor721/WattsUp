/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

import { Button, CardContent, CardFooter } from "@/components/shadcn";
import { FindPasswordPopup } from "@/auth/components/FindPassword";
import { useAuthStore } from "@/auth/useAuthStore";
import { useDialog } from "@/hooks/useDialog";

import useAccessToken from "../../useAccessToken";
import GoogleLoginButton from "./GoogleLoginButton";
import EmailInput from "../common/EmailInput";
import PasswordInput from "../common/PasswordInput";

export default function LoginForm() {
  const router = useRouter();

  const {
    message,
    actions: { nativeLogin },
  } = useAuthStore();

  const { showDialog, DialogComponent } = useDialog();
  const { resetAccessToken } = useAccessToken();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<ReactNode>("");

  const handleLogin = async () => {
    if (!email) {
      setErrorMessage(
        <>
          <strong className="font-bold">이메일</strong>을 입력해주세요.
        </>,
      );
      return;
    }

    if (!password) {
      setErrorMessage(
        <>
          <strong className="font-bold">비밀번호</strong>를 입력해주세요.
        </>,
      );
      return;
    }

    setErrorMessage("");

    try {
      await nativeLogin(email, password);
    } catch (error: any) {
      setErrorMessage(error.message || "로그인 중 오류가 발생했습니다.");
    }
  };

  return (
    <>
      <CardContent className="grid gap-6">
        {/* 이메일 섹션 */}
        <div className="flex flex-col gap-2">
          <EmailInput email={email} setEmail={setEmail} />
        </div>
        {/* 비밀번호 섹션 */}
        <div className="flex flex-col gap-2">
          <PasswordInput
            password={password}
            showPassword={showPassword}
            setPassword={setPassword}
            setShowPassword={setShowPassword}
          />
        </div>
      </CardContent>
      {/* 에러 메시지 */}
      {errorMessage && (
        <p className="text-center text-sm text-red-500">{errorMessage}</p>
      )}
      {/* 로그인 푸터 */}
      <CardFooter className="flex flex-col gap-4">
        <Button
          className={`w-full bg-[#070f26] text-white dark:border-1`}
          onClick={handleLogin}
        >
          로그인
        </Button>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t"></span>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background text-muted-foreground z-10 px-2">
              Or continue with
            </span>
          </div>
        </div>
        {/* 구글 로그인 버튼 */}
        <GoogleLoginButton />
        {/* 비밀번호 및 회원가입 링크 */}
        <div className="mt-3 flex text-center text-sm">
          <FindPasswordPopup>
            <p className="inline-block cursor-pointer text-sm underline">
              비밀번호 찾기
            </p>
          </FindPasswordPopup>
          <Link href={"/signup"} className="ml-2 text-sm underline">
            회원가입
          </Link>
        </div>
      </CardFooter>
      <DialogComponent />
    </>
  );
}
