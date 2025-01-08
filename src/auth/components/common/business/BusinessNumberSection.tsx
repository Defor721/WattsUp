import { Dispatch, SetStateAction } from "react";
import { IoMdInformationCircleOutline } from "react-icons/io";

import {
  Input,
  Label,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/shadcn";

import XCircleButton from "../ui/XCircleButton";

interface BusinessNumberSectionProps {
  businessNumber: string;
  isBusinessVerified: boolean;
  isBusinessLoading: boolean;
  setBusinessNumber: Dispatch<SetStateAction<string>>;
}

export default function BusinessNumberSection({
  businessNumber,
  isBusinessVerified,
  isBusinessLoading,
  setBusinessNumber,
}: BusinessNumberSectionProps) {
  return (
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
      <div className="relative">
        <Input
          className={`h-[44px] pr-10 dark:ring-offset-0 ${businessNumber.length !== 10 && businessNumber.trim() !== "" ? "border-red-600 focus:ring-transparent" : "focus:border-blue-500 focus:ring-transparent"}`}
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
          disabled={isBusinessVerified || isBusinessLoading}
        />
        {businessNumber && !isBusinessLoading && !isBusinessVerified && (
          <XCircleButton reset={setBusinessNumber} right={1} />
        )}
      </div>
      <div className="text-sm text-gray-500">
        {businessNumber.length !== 10 && businessNumber.trim() !== "" && (
          <div className="text-red-600">
            사업자 번호 10자리 모두 입력해주셔야 합니다.
          </div>
        )}
      </div>
    </div>
  );
}
