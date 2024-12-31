import React from "react";

import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/shadcn";

interface KPICardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  backgroundColor: string;
  iconColor?: string;
}

const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  icon,
  backgroundColor,
  iconColor = "#FFFFFF",
}) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className="flex cursor-pointer items-center justify-between rounded-lg p-4 shadow-md transition-transform hover:scale-105"
          style={{ backgroundColor }}
        >
          <div className="flex flex-col">
            <span className="text-lg font-bold text-white">{title}</span>
            <span className="text-xl font-extrabold text-white">{value}</span>
          </div>
          <div
            className="flex h-12 w-12 items-center justify-center rounded-full"
            style={{ backgroundColor: iconColor }}
          >
            {icon}
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent side="top" align="center">
        More details about <strong>{title}</strong>
      </TooltipContent>
    </Tooltip>
  );
};

export default KPICard;
