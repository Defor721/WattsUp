"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
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
    actions: { nativeSignup },
  } = useAuthStore();

  // 추가 정보 상태들
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [password, setPassword] = useState("");
  const [isBusinessValid, setIsBusinessValid] = useState(false);
  const [businessType, setBusinessType] = useState<"corporate" | "individual">(
    "corporate",
  );
  const [corporateNumber, setCorporateNumber] = useState("");
  const [personalId, setPersonalId] = useState("");

  const isSubmitButtonDisabled = !isEmailVerified && !isBusinessValid;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    nativeSignup({ password, businessType, corporateNumber, personalId });

    router.push("/signup/additional");
  };

  const handlePrevClick = () => {
    router.back();
  };

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
          <SignupPasswordInput password={password} setPassword={setPassword} />
          {/* 법인등록번호 및 주민등록번호 검증 섹션 */}
          <SignupBusinessNumberInput
            isBusinessValid={isBusinessValid}
            setIsBusinessValid={setIsBusinessValid}
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
            disabled={!isBusinessValid}
            className={`w-full bg-mainColor text-white disabled:border-none disabled:bg-gray-400`}
          >
            가입하기
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

export default Signup;
