/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IoIosArrowBack } from "react-icons/io";
import Link from "next/link";

import { useAuthStore } from "@/auth/useAuthStore";
import useAccessToken from "@/auth/hooks/useAccessToken";
import {
  Button,
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/shadcn";
import BusinessNumberSection from "@/auth/components/common/business/BusinessInfoSection";
import PasswordSection from "@/auth/components/common/password/PasswordSection";

export default function AdditionalPage() {
  const router = useRouter();
  const { setAccessToken } = useAccessToken();
  const {
    accessToken,
    redirectTo,
    message,
    actions: { socialSignup, resetAuthState },
  } = useAuthStore();

  const [password, setPassword] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(false);
  const [principalName, setPrincipalName] = useState("");
  const [businessNumber, setBusinessNumber] = useState("");
  const [startDate, setStartDate] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [corporateNumber, setCorporateNumber] = useState("");
  const [isBusinessVerified, setIsBusinessVerified] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await socialSignup(password);
    } catch (error: any) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (accessToken) {
      setAccessToken(accessToken);
      resetAuthState();
      router.push(redirectTo);
    }
  }, [accessToken]);

  return (
    <div className="mx-auto my-20 select-none">
      <Card className="relative flex flex-col p-6">
        <Link href={"/login"}>
          <IoIosArrowBack
            size={"20px"}
            className="absolute left-1 top-2 opacity-50 hover:cursor-pointer hover:opacity-80"
          />
        </Link>
        <CardHeader className="px-0">
          <CardTitle>추가 정보 입력</CardTitle>
          <CardDescription>로그인을 위한 정보를 입력해주세요.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-0">
          {/* 비밀번호 섹션 */}
          <PasswordSection
            password={password}
            isPasswordValid={isPasswordValid}
            isConfirmPasswordValid={isConfirmPasswordValid}
            setPassword={setPassword}
            setIsPasswordValid={setIsPasswordValid}
            setIsConfirmPasswordValid={setIsConfirmPasswordValid}
          />
          {/* 사업자등록번호 및 법인등록번호 검증 섹션 */}
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
          {/* 에러 메시지 */}
          {message && (
            <p className="pt-6 text-center text-sm text-red-500">
              {message === "토큰이 만료되었습니다." ? (
                <>
                  인증 시간이 초과되었습니다. <br />
                  다시{" "}
                  <a
                    href="/login"
                    className="text-blue-500 underline hover:text-blue-700"
                  >
                    로그인 페이지
                  </a>
                  로 이동하여 이메일 및 사업자 인증을 진행해 주세요.
                </>
              ) : (
                message
              )}
            </p>
          )}
          <CardFooter className="px-0">
            {/* 제출 */}
            <Button
              type="submit"
              disabled={
                !isBusinessVerified ||
                !isConfirmPasswordValid ||
                !isPasswordValid
              }
              className={`h-[44px] w-full rounded bg-mainColor p-2 text-white disabled:border-none disabled:bg-gray-400 dark:border-1`}
            >
              가입하기
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
