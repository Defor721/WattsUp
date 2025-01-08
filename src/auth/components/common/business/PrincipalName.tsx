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

interface PrincipalNameProps {
  principalName: string;
  isBusinessVerified: boolean;
  isBusinessLoading: boolean;
  setPrincipalName: Dispatch<SetStateAction<string>>;
}

export default function PrincipalName({
  principalName,
  isBusinessVerified,
  isBusinessLoading,
  setPrincipalName,
}: PrincipalNameProps) {
  return (
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
      <div className="relative">
        <Input
          className="h-[44px] pr-10 focus:border-blue-500 focus:ring-transparent dark:ring-offset-0"
          id="principalName"
          name="principalName"
          placeholder="홍길동"
          maxLength={50}
          value={principalName}
          onChange={(e) => setPrincipalName(e.target.value)}
          required
          disabled={isBusinessVerified || isBusinessLoading}
        />
        {principalName && !isBusinessLoading && !isBusinessVerified && (
          <XCircleButton reset={setPrincipalName} right={1} />
        )}
      </div>
    </div>
  );
}
