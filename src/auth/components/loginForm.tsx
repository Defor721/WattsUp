"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { IoIosArrowBack } from "react-icons/io";
import { useTheme } from "next-themes";

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
import { FindPasswordPopup } from "@/auth/components/FindPassword";
import { useAuthStore } from "@/auth/useAuthStore";
import { useDialog } from "@/hooks/use-dialog";

import useAccessToken from "../useAccessToken";
import GoogleLoginButton from "./GoogleLoginButton";

export default function LoginForm() {
  const router = useRouter();
  const { showDialog, DialogComponent } = useDialog();
  const { resetAccessToken } = useAccessToken();
  const { theme } = useTheme();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isValid, setIsValid] = useState<boolean>(true);

  const {
    error,
    message,
    redirectTo,
    actions: { nativeLogin, resetLoginState },
  } = useAuthStore();

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

  const handlePrevClick = () => {
    router.back();
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
    <Card className="relative flex flex-col p-5">
      <button onClick={handlePrevClick}>
        <IoIosArrowBack
          size={"20px"}
          className="absolute left-1 top-2 opacity-50 hover:cursor-pointer hover:opacity-80"
        />
      </button>
      {/* 로그인 헤더 */}
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">로그인</CardTitle>
        <CardDescription>로그인을 위한 정보를 입력해주세요.</CardDescription>
      </CardHeader>
      {/* 로그인 컨텐츠 */}
      <CardContent className="grid gap-6">
        {/* 이메일 섹션 */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">이메일</Label>
          <Input
            id="email"
            type="email"
            placeholder="이메일을 입력하세요."
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>
        {/* 비밀번호 섹션 */}
        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="password">비밀번호</Label>
            <FindPasswordPopup>
              <p className="inline-block cursor-pointer text-sm underline">
                비밀번호를 잊으셨나요?
              </p>
            </FindPasswordPopup>
          </div>
          <div className="relative mt-2">
            <Input
              // className="text-black"
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="비밀번호를 입력하세요."
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
            <Button
              size={"icon"}
              className="absolute right-1 top-[9px] z-10 -translate-y-1/4 bg-transparent hover:bg-transparent"
              onClick={togglePassword}
            >
              {showPassword ? (
                <EyeOff className="text-muted-foreground h-5 w-5 opacity-70" />
              ) : (
                <Eye className="text-muted-foreground h-5 w-5 opacity-70" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>

      {/* 로그인 푸터 */}
      <CardFooter className="mt-2 flex flex-col gap-2">
        <Button
          className={`w-full bg-[#070f26] text-white dark:border-1`}
          onClick={handleLogin}
          disabled={!isValid}
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

        <GoogleLoginButton
          className={`w-full bg-[#070f26] text-white dark:border-1`}
        />

        <div className="text-center text-sm">
          계정이 없으신가요?
          <Link href={"/signup"} className="ml-2 text-sm underline">
            회원가입
          </Link>
        </div>
      </CardFooter>
      <DialogComponent />
    </Card>
    // <div className="w-[200px] bg-gray-200">
    //   <button className="bg-rose-500 text-green-500 dark:bg-blue-500 dark:text-purple-500">
    //     글씨 테스트입니다.
    //   </button>
    //   <button className="bg-black text-green-500 dark:bg-yellow-500 dark:text-purple-500">
    //     글씨 테스트입니다.
    //   </button>
    // </div>
  );
}
