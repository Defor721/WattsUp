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

interface CorporateNumber {
  corporateNumber: string;
  isBusinessVerified: boolean;
  isBusinessLoading: boolean;
  setCorporateNumber: Dispatch<SetStateAction<string>>;
}

export default function CorporateNumber({
  corporateNumber,
  isBusinessVerified,
  isBusinessLoading,
  setCorporateNumber,
}: CorporateNumber) {
  return (
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
      <div className="relative">
        <Input
          className={`h-[44px] pr-10 dark:ring-offset-0 ${corporateNumber.length !== 13 && corporateNumber.trim() !== "" ? "border-red-600 focus:ring-transparent" : "focus:border-blue-500 focus:ring-transparent"}`}
          id="corporateNumber"
          name="corporateNumber"
          placeholder="0000000000000"
          maxLength={13}
          value={corporateNumber}
          onChange={(e) =>
            setCorporateNumber(e.target.value.replace(/[^0-9]/g, ""))
          }
          required
          disabled={isBusinessVerified || isBusinessLoading}
        />
        {corporateNumber && !isBusinessLoading && !isBusinessVerified && (
          <XCircleButton reset={setCorporateNumber} right={1} />
        )}
      </div>
      <div className="text-sm text-gray-500">
        {corporateNumber.length !== 13 && corporateNumber.trim() !== "" && (
          <div className="text-red-600">
            법인등록번호 13자리 모두 입력해주셔야 합니다.
          </div>
        )}
      </div>
    </div>
  );
}
