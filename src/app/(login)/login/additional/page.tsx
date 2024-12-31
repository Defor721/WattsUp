"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IoIosArrowBack, IoMdInformationCircleOutline } from "react-icons/io";
import Link from "next/link";

import { businessInfoVerification } from "@/auth/authService";
import { useAuthStore } from "@/auth/useAuthStore";
import useAccessToken from "@/auth/useAccessToken";
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/shadcn";

export default function AdditionalPage() {
  const router = useRouter();
  const { setAccessToken } = useAccessToken();
  const {
    accessToken,
    redirectTo,
    actions: { socialSignup, resetLoginState },
  } = useAuthStore();

  const [principalName, setPrincipalName] = useState("");
  const [businessNumber, setBusinessNumber] = useState("");
  const [startDate, setStartDate] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [isBusinessLoading, setIsBusinessLoading] = useState(false);
  const [isBusinessValid, setIsBusinessValid] = useState(false);
  const [businessStatusMessage, setBusinessStatusMessage] = useState("");

  const [businessType, setBusinessType] = useState<"corporate" | "individual">(
    "corporate",
  );
  const [corporateNumber, setCorporateNumber] = useState("");
  const [personalId, setPersonalId] = useState("");

  const handleCheckBusinessNumber = async () => {
    setIsBusinessLoading(true);
    setBusinessStatusMessage("");
    setIsBusinessValid(false);
    try {
      await businessInfoVerification(
        businessNumber,
        startDate,
        principalName,
        companyName,
        corporateNumber,
      );
      setIsBusinessValid(true);
      setBusinessStatusMessage("유효한 사업자 등록번호입니다.");
    } catch (error: any) {
      setBusinessStatusMessage(
        error.response.data.message || `서버 오류가 발생했습니다.`,
      );
      setIsBusinessValid(false);
    } finally {
      setIsBusinessLoading(false);
    }
  };

  const resetBusinessInfo = () => {
    setBusinessNumber("");
    setStartDate("");
    setPrincipalName("");
    setIsBusinessValid(false);
    setCompanyName("");
    setBusinessStatusMessage("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      socialSignup({
        businessNumber,
        startDate,
        principalName,
        companyName,
        businessType,
        corporateNumber,
        personalId,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (accessToken) {
      setAccessToken(accessToken);
      resetLoginState();
      router.push(redirectTo);
    }
  }, [accessToken]);

  {
    /* TODO: 아래 인풋 예시 주석 모두 지울것 */
    /* 사업자 번호: 1118194369 */
    /* 개업일자: 20221201 */
    // 상호: (주)터빈크루
    /* 대표자 성명: 전기은 */
  }

  return (
    <Card className="relative flex flex-col p-5">
      <Link href={"/login"}>
        <IoIosArrowBack
          size={"20px"}
          className="absolute left-1 top-2 opacity-50 hover:cursor-pointer hover:opacity-80"
        />
      </Link>
      <CardHeader>
        <CardTitle>추가 정보 입력</CardTitle>
        <CardDescription>로그인을 위한 정보를 입력해주세요.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="flex flex-col gap-5">
          <TooltipProvider>
            {/* 사업자 번호 및 대표자 성명 검증 */}
            <div className="flex flex-col gap-2">
              <Tooltip>
                <div className="flex items-center gap-1">
                  <Label htmlFor="principalName">대표자 성명</Label>
                  <TooltipTrigger>
                    <IoMdInformationCircleOutline />
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    외국인 사업자의 경우에는 영문명 입력해주세요.
                  </TooltipContent>
                </div>
              </Tooltip>
              <Input
                id="principalName"
                name="principalName"
                placeholder="대표자 이름을 입력해주세요."
                value={principalName}
                onChange={(e) => setPrincipalName(e.target.value)}
                required
                disabled={isBusinessValid}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Tooltip>
                <div className="flex items-center gap-1">
                  <Label htmlFor="businessNumber">사업자 번호</Label>
                  <TooltipTrigger>
                    <IoMdInformationCircleOutline />
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    {
                      "'-' 기호를 제외한 사업자 번호 10자리를 입력해주세요. 예) 0123456789"
                    }
                  </TooltipContent>
                </div>
              </Tooltip>
              <Input
                id="businessNumber"
                name="businessNumber"
                placeholder="사업자번호 10자리를 입력해주세요."
                value={businessNumber}
                onChange={(e) => setBusinessNumber(e.target.value)}
                required
                disabled={isBusinessValid}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Tooltip>
                <div className="flex items-center gap-1">
                  <Label htmlFor="startDate">개업일자</Label>
                  <TooltipTrigger>
                    <IoMdInformationCircleOutline />
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    {`YYYYMMDD 포맷으로 개업일자 8자리를 입력해주세요. 예) 20241229`}
                  </TooltipContent>
                </div>
              </Tooltip>
              <Input
                id="startDate"
                name="startDate"
                placeholder="YYYYMMDD"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                disabled={isBusinessValid}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Tooltip>
                <div className="flex items-center gap-1">
                  <Label htmlFor="companyName">상호명</Label>
                  <TooltipTrigger>
                    <IoMdInformationCircleOutline />
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    {
                      "상호를 입력해주세요. 주식회사인 경우 예: (주)회사명, 주식회사 회사명"
                    }
                  </TooltipContent>
                </div>
              </Tooltip>
              <Input
                id="companyName"
                name="companyName"
                placeholder="(주)터빈크루"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
                disabled={isBusinessValid}
              />
            </div>
          </TooltipProvider>

          {isBusinessValid ? (
            <button
              type="button"
              onClick={resetBusinessInfo}
              className="mt-2 rounded bg-gray-600 p-2 text-white hover:bg-gray-700"
            >
              사업자번호 수정
            </button>
          ) : (
            <button
              className={`mt-2 rounded p-2 text-white ${
                isBusinessLoading
                  ? "bg-gray-400"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
              type="button"
              onClick={handleCheckBusinessNumber}
              disabled={isBusinessLoading}
            >
              {isBusinessLoading ? "확인 중..." : "사업자번호 확인"}
            </button>
          )}
          {businessStatusMessage && (
            <p
              className={`mt-2 font-semibold ${
                isBusinessValid ? "text-green-500" : "text-red-500"
              }`}
            >
              {businessStatusMessage}
            </p>
          )}

          {/* 법인등록번호 및 주민등록번호 검증 */}
          <div className="flex flex-col gap-4">
            <div className="flex gap-3">
              <div className="flex gap-1">
                <input
                  id="corporate"
                  type="radio"
                  name="businessType"
                  value="corporate"
                  checked={businessType === "corporate"}
                  onChange={() => setBusinessType("corporate")}
                />
                <Label htmlFor="corporate">법인 사업자</Label>
              </div>
              <div className="flex gap-1">
                <input
                  id="individual"
                  type="radio"
                  name="businessType"
                  value="individual"
                  checked={businessType === "individual"}
                  onChange={() => setBusinessType("individual")}
                />
                <Label htmlFor="individual">개인 사업자</Label>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {businessType === "corporate" ? (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="corporateNumber">법인등록번호</Label>
                  <Input
                    id="corporateNumber"
                    type="text"
                    name="corporateNumber"
                    placeholder="법인등록번호 13자리를 입력해주세요."
                    value={corporateNumber}
                    onChange={(e) => setCorporateNumber(e.target.value)}
                  />
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="personalId">주민등록번호</Label>
                  <Input
                    id="personalId"
                    type="text"
                    name="personalId"
                    placeholder="주민등록번호 앞 6자리를 입력해주세요."
                    value={personalId}
                    onChange={(e) => setPersonalId(e.target.value)}
                  />
                </div>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          {/* 제출 */}
          <Button
            type="submit"
            disabled={!isBusinessValid}
            className={`w-full bg-mainColor text-white disabled:border-none disabled:bg-gray-400 dark:border-1`}
          >
            제출
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
