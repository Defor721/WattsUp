"use client";

import { useState } from "react";

import LoginFormFooterLinks from "./LoginFormFooterLinks";
import { useAuthStore } from "@/auth/useAuthStore";
import GoogleLoginButton from "./GoogleLoginButton";
import EmailInput from "../common/email/EmailInput";
import PasswordInput from "../common/password/PasswordInput";
import Divider from "../common/ui/Divider";
import { Button, CardContent, CardFooter } from "@/components/shadcn";

export default function LoginForm() {
  const {
    message,
    actions: { nativeLogin, setMessageState },
  } = useAuthStore();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [, setIsPasswordValid] = useState(false);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email) {
      setMessageState("이메일을 입력해주세요.");
      return;
    }
    if (!password) {
      setMessageState("비밀번호를 입력해주세요.");
      return;
    }
    setMessageState("");
    try {
      await nativeLogin(email, password);
    } catch (error: any) {
      setMessageState(error.message || "로그인 중 오류가 발생했습니다.");
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
      {message && <p className="text-center text-sm text-red-500">{message}</p>}
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
        <LoginFormFooterLinks />
      </CardFooter>
    </form>
  );
}
