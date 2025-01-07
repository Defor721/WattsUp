/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import Link from "next/link";
import { ReactNode, useState } from "react";

import { Button, CardContent, CardFooter } from "@/components/shadcn";
import { FindPasswordPopup } from "@/auth/components/common/FindPassword";
import { useAuthStore } from "@/auth/useAuthStore";

import GoogleLoginButton from "./GoogleLoginButton";
import EmailInput from "../common/EmailInput";
import PasswordInput from "../common/PasswordInput";

interface DividerProps {
  children?: React.ReactNode;
}

function Divider({ children }: DividerProps) {
  return (
    <div className="my-1 flex w-full items-center text-sm">
      <div
        className={`flex-grow border-t ${
          children ? "mr-4" : ""
        } border-gray-300`}
      ></div>
      {children && (
        <span className="text-gray-500 dark:text-gray-300">{children}</span>
      )}
      <div
        className={`flex-grow border-t ${
          children ? "ml-4" : ""
        } border-gray-300`}
      ></div>
    </div>
  );
}

export default function LoginForm() {
  const {
    actions: { nativeLogin },
  } = useAuthStore();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<ReactNode>("");
  const [, setIsPasswordValid] = useState(false);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
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
      console.error("nativeLogin 실패:", error);
      setErrorMessage(error.message || "로그인 중 오류가 발생했습니다.");
    }
  };

  return (
    <form className="flex flex-col gap-6">
      <CardContent className="flex flex-col gap-5 p-0">
        {/* 이메일 섹션 */}
        <EmailInput email={email} setEmail={setEmail} />
        {/* 비밀번호 섹션 */}
        <div className="flex flex-col gap-2">
          <PasswordInput
            password={password}
            showPassword={showPassword}
            setPassword={setPassword}
            setShowPassword={setShowPassword}
            setIsPasswordValid={setIsPasswordValid}
          />
        </div>
      </CardContent>
      {/* 에러 메시지 */}
      {errorMessage && (
        <p className="text-center text-sm text-red-500">{errorMessage}</p>
      )}
      <CardFooter className="flex flex-col gap-4 px-0">
        <Button
          className={`h-[44px] w-full bg-mainColor text-white dark:border-1`}
          onClick={handleLogin}
        >
          로그인
        </Button>
        <Divider>또는</Divider>
        {/* 구글 로그인 버튼 */}
        <GoogleLoginButton />
        {/* 비밀번호 및 회원가입 링크 */}
        <div className="mt-3 flex items-center text-center text-sm">
          {/* 왼쪽 텍스트 */}
          <div className="flex-grow text-right">
            <FindPasswordPopup>
              <p className="inline-block cursor-pointer text-sm underline">
                비밀번호 찾기
              </p>
            </FindPasswordPopup>
          </div>
          {/* 구분선 */}
          <span className="mx-2 text-gray-500">|</span>
          {/* 오른쪽 텍스트 */}
          <div className="flex-grow text-left">
            <Link href={"/signup"} className="text-sm underline">
              회원가입
            </Link>
          </div>
        </div>
      </CardFooter>
    </form>
  );
}
