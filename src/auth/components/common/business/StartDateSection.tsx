import { IoMdInformationCircleOutline } from "react-icons/io";
import { Dispatch, SetStateAction } from "react";

import {
  Input,
  Label,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/shadcn";

import XCircleButton from "../ui/XCircleButton";
import { VALIDATION_MESSAGES, VALIDATION_NUMERIC } from "@/constants";

interface StartDateSectionProps {
  startDate: string;
  isBusinessVerified: boolean;
  isBusinessLoading: boolean;
  setStartDate: Dispatch<SetStateAction<string>>;
}

export default function StartDateSection({
  startDate,
  isBusinessVerified,
  isBusinessLoading,
  setStartDate,
}: StartDateSectionProps) {
  return (
    <div className="flex flex-col gap-2">
      <Tooltip>
        <div className="flex items-center gap-1">
          <Label htmlFor="startDate">개업일자</Label>
          <TooltipTrigger>
            <IoMdInformationCircleOutline />
          </TooltipTrigger>
          <TooltipContent side="right">
            {VALIDATION_MESSAGES.START_DATE_TOOLTIP}
          </TooltipContent>
        </div>
      </Tooltip>
      <div className="relative">
        <Input
          className={`h-[44px] pr-10 dark:ring-offset-0 ${startDate.length !== VALIDATION_NUMERIC.START_DATE_NUMBER_LENGTH && startDate.trim() !== "" ? "border-red-600 focus:ring-transparent" : "focus:border-blue-500 focus:ring-transparent"}`}
          type={"text"}
          id="startDate"
          name="startDate"
          placeholder="YYYYMMDD"
          maxLength={VALIDATION_NUMERIC.START_DATE_NUMBER_LENGTH}
          value={startDate}
          onChange={(e) => setStartDate(e.target.value.replace(/[^0-9]/g, ""))}
          required
          disabled={isBusinessVerified || isBusinessLoading}
        />
        {startDate && !isBusinessLoading && !isBusinessVerified && (
          <XCircleButton reset={setStartDate} right={1} />
        )}
      </div>
      <div className="text-sm text-gray-500">
        {startDate.length !== 8 && startDate.trim() !== "" && (
          <div className="text-red-600">
            {VALIDATION_MESSAGES.START_DATE_REQUIRED}
          </div>
        )}
      </div>
    </div>
  );
}
