"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useAuthStore } from "@/auth/useAuthStore";
import { toast } from "@/hooks/useToast";
import { Button, CardContent, CardFooter } from "@/components/shadcn";

import PasswordSection from "../common/PasswordSection";
import EmailSection from "../common/EmailSection";
import BusinessNumberSection from "../common/BusinessNumberSection";

export default function SignupForm() {
  const router = useRouter();
  const {
    actions: { nativeSignup, resetAuthState },
  } = useAuthStore();

  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [password, setPassword] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(false);
  const [isBusinessVerified, setIsBusinessVerified] = useState(false);
  const [businessNumber, setBusinessNumber] = useState("");
  const [principalName, setPrincipalName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [corporateNumber, setCorporateNumber] = useState("");

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

  const resetAllStates = () => {
    setIsEmailVerified(false);
    setPassword("");
    setIsPasswordValid(false);
    setIsConfirmPasswordValid(false);
    setIsBusinessVerified(false);
    resetAuthState();
  };

  useEffect(() => {
    resetAllStates();
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      <CardContent className="flex flex-col gap-5 p-0">
        {/* 이메일 섹션 */}
        <EmailSection
          isEmailVerified={isEmailVerified}
          setIsEmailVerified={setIsEmailVerified}
        />
        {/* 비밀번호 섹션 */}
        <PasswordSection
          password={password}
          isPasswordValid={isPasswordValid}
          isConfirmPasswordValid={isConfirmPasswordValid}
          setPassword={setPassword}
          setIsPasswordValid={setIsPasswordValid}
          setIsConfirmPasswordValid={setIsConfirmPasswordValid}
        />
        {/* 법인등록번호 및 주민등록번호 검증 섹션 */}
        <BusinessNumberSection
          isBusinessVerified={isBusinessVerified}
          businessNumber={businessNumber}
          principalName={principalName}
          startDate={startDate}
          companyName={companyName}
          corporateNumber={corporateNumber}
          setIsBusinessVerified={setIsBusinessVerified}
          setBusinessNumber={setBusinessNumber}
          setPrincipalName={setPrincipalName}
          setStartDate={setStartDate}
          setCompanyName={setCompanyName}
          setCorporateNumber={setCorporateNumber}
        />
      </CardContent>
      <CardFooter className="px-0">
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
  );
}
