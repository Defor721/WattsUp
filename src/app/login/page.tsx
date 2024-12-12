"use client";

import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from "@/components/shadcn";
import LoginButton from "@/auth/components/LoginButton";
import GoogleLoginButton from "@/auth/components/GoogleLoginButton";
import { FindPasswordPopup } from "@/auth/components/FindPassword";
import { useLoginStore } from "@/auth/useLoginStore";

export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isValid, setIsValid] = useState<boolean>(true);

  const { nativeLogin } = useLoginStore((state) => state.actions);

  const togglePassword = () => setShowPassword((prevState) => !prevState);

  const validateEmail = (email: string) => {
    return true;
  };

  const validatePassword = (password: string) => {
    return true;
  };

  const handleLogin = async () => {
    nativeLogin(email, password);
  };

  return (
    <Card className="w-[400px]">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">로그인</CardTitle>
        <CardDescription>로그인을 위한 정보를 입력해주세요.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">이메일</Label>
          <Input
            className="text-black"
            id="email"
            type="email"
            placeholder="이메일을 입력하세요."
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>
        <div className="relative grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">비밀번호</Label>
            <FindPasswordPopup>
              <p className="ml-auto inline-block cursor-pointer text-sm underline">
                비밀번호를 잊으셨나요?
              </p>
            </FindPasswordPopup>
          </div>
          <Input
            className="text-black"
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="비밀번호를 입력하세요."
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          <Button
            size={"icon"}
            className="absolute right-2 top-[38px] -translate-y-1/4 bg-transparent hover:bg-transparent"
            onClick={togglePassword}
          >
            {showPassword ? (
              <EyeOff className="text-muted-foreground h-5 w-5 text-black" />
            ) : (
              <Eye className="text-muted-foreground h-5 w-5 text-black" />
            )}
          </Button>
        </div>
      </CardContent>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t"></span>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background text-muted-foreground px-2">
            Or continue with
          </span>
        </div>
      </div>
      <CardFooter className="mt-6 flex flex-col">
        <Button
          className={`w-full ${isValid ? "bg-black" : "bg-gray-600"} text-white`}
          onClick={handleLogin}
          disabled={!isValid}
        >
          로그인
        </Button>
        <div className="mt-4 text-center text-sm">
          계정이 없으신가요?
          <Link href={"/signup"} className="ml-1 text-sm underline">
            회원가입
          </Link>
        </div>
      </CardFooter>
      <GoogleLoginButton />
    </Card>
  );
}
