import { Dispatch, useState } from "react";
import { IoMdInformationCircleOutline } from "react-icons/io";

import {
  Button,
  Input,
  Label,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/shadcn";

import { businessInfoVerification } from "../authService";

interface SignupBusinessNumberInputProps {
  isBusinessVerified: boolean;
  setIsBusinessVerified: Dispatch<React.SetStateAction<boolean>>;
}

export default function SignupBusinessNumberInput({
  isBusinessVerified,
  setIsBusinessVerified,
}: SignupBusinessNumberInputProps) {
  const [businessNumber, setBusinessNumber] = useState("");
  const [principalName, setPrincipalName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [isBusinessLoading, setIsBusinessLoading] = useState(false);
  const [businessStatusMessage, setBusinessStatusMessage] = useState("");

  const isBusinessButtonDisabled =
    isBusinessLoading ||
    businessNumber.length !== 10 ||
    startDate.length !== 8 ||
    !principalName ||
    !companyName;

  const handleCheckBusinessNumber = async () => {
    setIsBusinessLoading(true);
    setBusinessStatusMessage("");
    setIsBusinessVerified(false);
    try {
      await businessInfoVerification(
        businessNumber,
        startDate,
        principalName,
        companyName,
      );
      setIsBusinessVerified(true);
      setBusinessStatusMessage("유효한 사업자 등록번호입니다.");
    } catch (error: any) {
      setBusinessStatusMessage(
        error.response.data.message || `서버 오류가 발생했습니다.`,
      );
      setIsBusinessVerified(false);
    } finally {
      setIsBusinessLoading(false);
    }
  };

  const resetBusinessInfo = () => {
    // TODO: 주석 풀기
    // setBusinessNumber("");
    // setStartDate("");
    // setPrincipalName("");
    setIsBusinessVerified(false);
    // setCompanyName("");
    // setBusinessStatusMessage("");
  };

  return (
    <div className="flex flex-col gap-2">
      <TooltipProvider>
        {/* 사업자 번호 */}
        <div className="flex flex-col gap-2">
          <Tooltip>
            <div className="flex items-center gap-1">
              <Label htmlFor="businessNumber">사업자 번호</Label>
              <TooltipTrigger>
                <IoMdInformationCircleOutline />
              </TooltipTrigger>
              <TooltipContent side="right">
                {"'-' 기호를 제외한 사업자 번호 10자리를 입력해주세요."}
              </TooltipContent>
            </div>
          </Tooltip>
          <Input
            type={"text"}
            id="businessNumber"
            name="businessNumber"
            placeholder="0000000000"
            maxLength={10}
            value={businessNumber}
            onChange={(e) => {
              setBusinessNumber(e.target.value.replace(/[^0-9]/g, ""));
            }}
            required
            disabled={isBusinessVerified}
          />
        </div>
        {/* 개업일자 */}
        <div className="flex flex-col gap-2">
          <Tooltip>
            <div className="flex items-center gap-1">
              <Label htmlFor="startDate">개업일자</Label>
              <TooltipTrigger>
                <IoMdInformationCircleOutline />
              </TooltipTrigger>
              <TooltipContent side="right">
                {`YYYYMMDD 포맷으로 개업일자 8자리를 입력해주세요. 예) 20000101`}
              </TooltipContent>
            </div>
          </Tooltip>
          <Input
            type={"text"}
            id="startDate"
            name="startDate"
            placeholder="YYYYMMDD"
            maxLength={8}
            value={startDate}
            onChange={(e) =>
              setStartDate(e.target.value.replace(/[^0-9]/g, ""))
            }
            required
            disabled={isBusinessVerified}
          />
        </div>
        {/* 상호 */}
        <div className="flex flex-col gap-2">
          <Tooltip>
            <div className="flex items-center gap-1">
              <Label htmlFor="companyName">상호</Label>
              <TooltipTrigger>
                <IoMdInformationCircleOutline />
              </TooltipTrigger>
              <TooltipContent side="right">
                {
                  "주식회사인 경우 예: (주)회사명, 주식회사 회사명 으로 입력해주세요."
                }
              </TooltipContent>
            </div>
          </Tooltip>
          <Input
            type={"text"}
            id="companyName"
            name="companyName"
            placeholder="(주)테스트"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            required
            disabled={isBusinessVerified}
          />
        </div>
        {/* 대표자 성명 */}
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
            placeholder="홍길동"
            value={principalName}
            onChange={(e) => setPrincipalName(e.target.value)}
            required
            disabled={isBusinessVerified}
          />
        </div>
      </TooltipProvider>
      <div className="text-sm text-gray-500">
        {/* 사업가 번호 확인 메시지 */}
        {businessStatusMessage && (
          <p
            className={`text-sm ${
              isBusinessVerified ? "text-green-500" : "text-red-500"
            }`}
          >
            {businessStatusMessage}
          </p>
        )}
        {!businessStatusMessage && (
          <>
            <p>사업자 번호, 개업일자, 상호, 대표자 성명을 올바르게</p>
            <p>
              {" "}
              입력 후{" "}
              <span className="font-semibold text-blue-600">
                사업자번호 확인
              </span>{" "}
              버튼을 눌러주세요.
            </p>
          </>
        )}
      </div>
      {/* 사업가 번호 확인 버튼 */}
      {isBusinessVerified ? (
        <Button
          type="button"
          onClick={resetBusinessInfo}
          className="rounded bg-gray-600 p-2 text-white"
        >
          사업자번호 변경
        </Button>
      ) : (
        <Button
          className={`rounded bg-mainColor p-2 text-white disabled:border-none disabled:bg-gray-400 dark:border-1`}
          type="button"
          onClick={handleCheckBusinessNumber}
          disabled={isBusinessButtonDisabled}
        >
          {isBusinessLoading ? "확인 중..." : "사업자번호 확인"}
        </Button>
      )}
    </div>
  );
}
