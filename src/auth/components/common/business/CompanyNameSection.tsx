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
import { VALIDATION_MESSAGES } from "@/constants";

interface CompanyNameSectionProps {
  companyName: string;
  isBusinessVerified: boolean;
  isBusinessLoading: boolean;
  setCompanyName: Dispatch<SetStateAction<string>>;
}

export default function CompanyNameSection({
  companyName,
  isBusinessVerified,
  isBusinessLoading,
  setCompanyName,
}: CompanyNameSectionProps) {
  return (
    <div className="mb-2 flex flex-col gap-2">
      <Tooltip>
        <div className="flex items-center gap-1">
          <Label htmlFor="companyName">상호</Label>
          <TooltipTrigger>
            <IoMdInformationCircleOutline />
          </TooltipTrigger>
          <TooltipContent side="right">
            {VALIDATION_MESSAGES.COMPANY_NAME_TOOLTIP}
          </TooltipContent>
        </div>
      </Tooltip>
      <div className="relative">
        <Input
          className="h-[44px] pr-10 focus:border-blue-500 focus:ring-transparent dark:ring-offset-0"
          type={"text"}
          id="companyName"
          name="companyName"
          placeholder="(주)테스트"
          maxLength={30}
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          required
          disabled={isBusinessVerified || isBusinessLoading}
        />
        {companyName && !isBusinessLoading && !isBusinessVerified && (
          <XCircleButton reset={setCompanyName} right={1} />
        )}
      </div>
    </div>
  );
}
