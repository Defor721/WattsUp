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
import SignupEmailInput from "@/auth/components/SignupEmailInput";
import SignupPasswordInput from "@/auth/components/SignupPasswordInput";
import SignupBusinessNumberInput from "@/auth/components/SignupBusinessNumberInputProps";
import BusinessTypeInput from "@/auth/components/BusinessTypeInput";
import { useAuthStore } from "@/auth/useAuthStore";

function Signup() {
  const router = useRouter();
  const {
    message,
    actions: { nativeSignup },
  } = useAuthStore();

  // 추가 정보 상태들
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [password, setPassword] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(false);
  const [isBusinessVerified, setIsBusinessVerified] = useState(false);
  const [businessType, setBusinessType] = useState<"corporate" | "individual">(
    "corporate",
  );
  const [corporateNumber, setCorporateNumber] = useState("");
  const [personalId, setPersonalId] = useState("");

  const isSubmitButtonDisabled =
    !isEmailVerified ||
    !isPasswordValid ||
    !isConfirmPasswordValid ||
    !isBusinessVerified ||
    !(corporateNumber.length === 13 || personalId.length === 6);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    nativeSignup({ password, businessType, corporateNumber, personalId });

    // router.push("/");
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
    setBusinessType("corporate");
    setCorporateNumber("");
    setPersonalId("");
  };

  useEffect(() => {
    resetAllStates();
  }, []);

  {
    /* TODO: 아래 인풋 예시 주석 모두 지울것 */
    /* 사업자 번호: 1118194369 */
    /* 개업일자: 20221201 */
    /* 상호: (주)터빈크루 */
    /* 대표자 성명: 전기은 */
    /* 법인등록 번호: 2013110093748 */
  }

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
          {/* 사업자 선택 및 번호 입력 섹션 */}
          <BusinessTypeInput
            businessType={businessType}
            corporateNumber={corporateNumber}
            personalId={personalId}
            setBusinessType={setBusinessType}
            setCorporateNumber={setCorporateNumber}
            setPersonalId={setPersonalId}
          />
        </CardContent>
        <CardFooter>
          {/* 버튼 섹션 */}
          <Button
            type="submit"
            disabled={isSubmitButtonDisabled}
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
