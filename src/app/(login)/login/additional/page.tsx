"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IoIosArrowBack } from "react-icons/io";
import Link from "next/link";

import { useAuthStore } from "@/auth/useAuthStore";
import useAccessToken from "@/auth/useAccessToken";
import {
  Button,
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/shadcn";
import BusinessNumberSection from "@/auth/components/common/BusinessNumberSection";

export default function AdditionalPage() {
  const router = useRouter();
  const { setAccessToken } = useAccessToken();
  const {
    accessToken,
    redirectTo,
    actions: { socialSignup, resetAuthState },
  } = useAuthStore();

  const [principalName, setPrincipalName] = useState("");
  const [businessNumber, setBusinessNumber] = useState("");
  const [startDate, setStartDate] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [corporateNumber, setCorporateNumber] = useState("");
  const [isBusinessVerified, setIsBusinessVerified] = useState(false);
  const [errorMessage, setErrorMessage] = useState<ReactNode>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await socialSignup({
        businessNumber,
        principalName,
        startDate,
        companyName,
        corporateNumber,
      });
    } catch (error: any) {
      setErrorMessage(error.message || "로그인 중 오류가 발생했습니다.");
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
    <div className="mx-auto my-20 w-[400px]">
      <Card className="relative flex flex-col p-5">
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
        <form onSubmit={handleSubmit}>
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
          {errorMessage && (
            <p className="pt-6 text-center text-sm text-red-500">
              {errorMessage}
            </p>
          )}
          <CardFooter className="px-0">
            {/* 제출 */}
            <Button
              type="submit"
              disabled={!isBusinessVerified}
              className={`w-full rounded bg-mainColor p-2 text-white disabled:border-none disabled:bg-gray-400 dark:border-1`}
            >
              제출
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
