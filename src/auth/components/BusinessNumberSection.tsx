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
import { toast } from "@/hooks/useToast";

import { businessInfoVerification } from "../services/client/authService";

interface BusinessNumberSectionProps {
  isBusinessVerified: boolean;
  businessNumber: string;
  principalName: string;
  startDate: string;
  companyName: string;
  corporateNumber: string;
  setIsBusinessVerified: Dispatch<React.SetStateAction<boolean>>;
  setBusinessNumber: Dispatch<React.SetStateAction<string>>;
  setPrincipalName: Dispatch<React.SetStateAction<string>>;
  setStartDate: Dispatch<React.SetStateAction<string>>;
  setCompanyName: Dispatch<React.SetStateAction<string>>;
  setCorporateNumber: Dispatch<React.SetStateAction<string>>;
}

export default function BusinessNumberSection({
  isBusinessVerified,
  businessNumber,
  principalName,
  startDate,
  companyName,
  corporateNumber,
  setIsBusinessVerified,
  setBusinessNumber,
  setPrincipalName,
  setStartDate,
  setCompanyName,
  setCorporateNumber,
}: BusinessNumberSectionProps) {
  const [isBusinessLoading, setIsBusinessLoading] = useState(false);
  const [businessStatusMessage, setBusinessStatusMessage] = useState("");

  const isBusinessButtonDisabled = () =>
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
        corporateNumber,
      );
      setIsBusinessVerified(true);
      setBusinessStatusMessage("유효한 사업자 등록번호입니다.");
    } catch (error: any) {
      setBusinessStatusMessage(
        "실패하였습니다. 아래의 실패 사유를 참고해주세요.",
      );
      setIsBusinessVerified(false);
      toast({
        variant: "destructive",
        title: "사업자번호 확인에 실패했습니다.",
        description: `${error.response.data.message}`,
      });
    } finally {
      setIsBusinessLoading(false);
    }
  };

  const resetBusinessInfo = () => {
    setIsBusinessVerified(false);
    setBusinessStatusMessage("");
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
          <div className="text-sm text-gray-500">
            {businessNumber.length !== 10 && businessNumber.trim() !== "" && (
              <div className="text-red-600">
                사업자 번호 10자리 모두 입력해주셔야 합니다.
              </div>
            )}
          </div>
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
          <div className="text-sm text-gray-500">
            {startDate.length !== 8 && startDate.trim() !== "" && (
              <div className="text-red-600">
                개업일자 8자리 모두 입력해주셔야 합니다.
              </div>
            )}
          </div>
        </div>
        {/* 상호 */}
        <div className="mb-2 flex flex-col gap-2">
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
            maxLength={30}
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            required
            disabled={isBusinessVerified}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Tooltip>
            <div className="flex items-center gap-1">
              <Label htmlFor="corporateNumber">법인등록번호</Label>
              <TooltipTrigger>
                <IoMdInformationCircleOutline />
              </TooltipTrigger>
              <TooltipContent side="right">
                {"'-' 기호를 제외한 법인등록번호 13자리를 입력해주세요."}
              </TooltipContent>
            </div>
          </Tooltip>
          <Input
            id="corporateNumber"
            name="corporateNumber"
            placeholder="0000000000000"
            maxLength={13}
            value={corporateNumber}
            onChange={(e) =>
              setCorporateNumber(e.target.value.replace(/[^0-9]/g, ""))
            }
            required
            disabled={isBusinessVerified}
          />
          <div className="text-sm text-gray-500">
            {corporateNumber.length !== 13 && corporateNumber.trim() !== "" && (
              <div className="text-red-600">
                법인등록번호 13자리 모두 입력해주셔야 합니다.
              </div>
            )}
          </div>
        </div>
        {/* 대표자 성명 */}
        <div className="mb-2 flex flex-col gap-2">
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
            maxLength={50}
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
                사업자번호 인증
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
          사업자번호 재인증
        </Button>
      ) : (
        <Button
          className={`rounded bg-mainColor p-2 text-white disabled:border-none disabled:bg-gray-400 dark:border-1`}
          type="button"
          onClick={handleCheckBusinessNumber}
          disabled={isBusinessButtonDisabled()}
        >
          {isBusinessLoading ? "확인 중..." : "사업자번호 인증"}
        </Button>
      )}
    </div>
  );
}
