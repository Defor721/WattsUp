import { Dispatch, SetStateAction, useState } from "react";

import { Button, TooltipProvider } from "@/components/shadcn";
import { toast } from "@/hooks/useToast";
import { businessInfoVerification } from "@/auth/services/client/authService";

import BusinessNumberSection from "./BusinessNumberSection";
import StartDateSection from "./StartDateSection";
import CompanyNameSection from "./CompanyNameSection";
import CorporateNumber from "./CorporateNumber";
import PrincipalName from "./PrincipalName";

interface BusinessInfoSectionProps {
  isBusinessVerified: boolean;
  businessNumber: string;
  principalName: string;
  startDate: string;
  companyName: string;
  corporateNumber: string;
  setIsBusinessVerified: Dispatch<SetStateAction<boolean>>;
  setBusinessNumber: Dispatch<SetStateAction<string>>;
  setPrincipalName: Dispatch<SetStateAction<string>>;
  setStartDate: Dispatch<SetStateAction<string>>;
  setCompanyName: Dispatch<SetStateAction<string>>;
  setCorporateNumber: Dispatch<SetStateAction<string>>;
}

export default function BusinessInfoSection({
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
}: BusinessInfoSectionProps) {
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
        <BusinessNumberSection
          businessNumber={businessNumber}
          isBusinessVerified={isBusinessVerified}
          isBusinessLoading={isBusinessLoading}
          setBusinessNumber={setBusinessNumber}
        />
        {/* 개업일자 */}
        <StartDateSection
          startDate={startDate}
          isBusinessVerified={isBusinessVerified}
          isBusinessLoading={isBusinessLoading}
          setStartDate={setStartDate}
        />
        {/* 상호 */}
        <CompanyNameSection
          companyName={companyName}
          isBusinessVerified={isBusinessVerified}
          isBusinessLoading={isBusinessLoading}
          setCompanyName={setCompanyName}
        />
        {/* 법인 등록번호 */}
        <CorporateNumber
          corporateNumber={corporateNumber}
          isBusinessVerified={isBusinessVerified}
          isBusinessLoading={isBusinessLoading}
          setCorporateNumber={setCorporateNumber}
        />
        {/* 대표자 성명 */}
        <PrincipalName
          principalName={principalName}
          isBusinessVerified={isBusinessVerified}
          isBusinessLoading={isBusinessLoading}
          setPrincipalName={setPrincipalName}
        />
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
          className="h-[44px] rounded bg-gray-600 p-2 text-white"
        >
          사업자번호 재인증
        </Button>
      ) : (
        <Button
          className={`h-[44px] rounded bg-mainColor p-2 text-white disabled:border-none disabled:bg-gray-400 dark:border-1 dark:ring-offset-0`}
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
