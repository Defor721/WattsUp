"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/shadcn";
import SignupEmailInput from "@/auth/components/signup/SignupEmailInput";
import SignupPasswordInput from "@/auth/components/SignupPasswordInput";
import SignupBusinessNumberInput from "@/auth/components/SignupBusinessNumberInput";
import { useAuthStore } from "@/auth/useAuthStore";
import { toast } from "@/hooks/useToast";

function Signup() {
  const router = useRouter();

  const {
    actions: { nativeSignup, resetLoginState },
  } = useAuthStore();

  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [password, setPassword] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(false);
  const [isBusinessVerified, setIsBusinessVerified] = useState(false);

  const isSubmitButtonDisabled = () =>
    !isEmailVerified ||
    !isPasswordValid ||
    !isConfirmPasswordValid ||
    !isBusinessVerified;

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      await nativeSignup(password);

      router.push("/login");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "회원가입에 실패했습니다.",
        description: `${error.response.data.message}`,
      });
    }
  };

  const handlePrevClick = () => {
    router.back();
  };

  const resetAllStates = () => {
    setIsEmailVerified(false);
    setPassword("");
    setIsPasswordValid(false);
    setIsConfirmPasswordValid(false);
    setIsBusinessVerified(false);
    resetLoginState();
  };

  useEffect(() => {
    resetAllStates();
  }, []);

  return (
    <Card className="relative flex flex-col p-5">
      <button onClick={handlePrevClick}>
        <IoIosArrowBack
          size={"20px"}
          className="absolute left-1 top-2 opacity-50 hover:cursor-pointer hover:opacity-80"
        />
      </button>
      <CardHeader>
        <CardTitle className="text-2xl">회원가입</CardTitle>
        <CardDescription>회원가입을 위한 정보를 입력해주세요.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="flex flex-col gap-5">
          {/* 이메일 섹션 */}
          <SignupEmailInput
            isEmailVerified={isEmailVerified}
            setIsEmailVerified={setIsEmailVerified}
          />
          {/* 비밀번호 섹션 */}
          <SignupPasswordInput
            password={password}
            isPasswordValid={isPasswordValid}
            isConfirmPasswordValid={isConfirmPasswordValid}
            setPassword={setPassword}
            setIsPasswordValid={setIsPasswordValid}
            setIsConfirmPasswordValid={setIsConfirmPasswordValid}
          />
          {/* 법인등록번호 및 주민등록번호 검증 섹션 */}
          <SignupBusinessNumberInput
            isBusinessVerified={isBusinessVerified}
            setIsBusinessVerified={setIsBusinessVerified}
          />
        </CardContent>
        <CardFooter>
          {/* 버튼 섹션 */}
          <Button
            type="submit"
            disabled={isSubmitButtonDisabled()}
            className={`w-full rounded bg-mainColor p-2 text-white disabled:border-none disabled:bg-gray-400 dark:border-1`}
          >
            가입하기
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

export default Signup;
