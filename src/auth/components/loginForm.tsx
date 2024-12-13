"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import {
  Button,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from "@/components/shadcn";
import { FindPasswordPopup } from "@/auth/components/FindPassword";
import { useLoginStore } from "@/auth/useLoginStore";
import { useDialog } from "@/hooks/use-dialog";

import useAccessToken from "../useAccessToken";

export default function LoginForm() {
  const router = useRouter();
  const { showDialog, DialogComponent } = useDialog();
  const { resetAccessToken } = useAccessToken();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isValid, setIsValid] = useState<boolean>(true);

  const {
    error,
    message,
    redirectTo,
    actions: { nativeLogin, resetLoginState },
  } = useLoginStore();

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

  // 에러 상태 감지 시 모달 표시
  useEffect(() => {
    if (error && message) {
      setShowPassword(false);
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
      <DialogComponent />
    </>
  );
}
