import React from "react";

import { Card } from "@/components/shadcn";

interface KPICardProps {
  title: string;
  value: string | number;
  unit: string;
  backgroundColor: string;
  iconColor: string;
}

const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  unit,
  backgroundColor,
  iconColor,
}) => {
  return (
    <Card className="flex items-center gap-2 border-none bg-cardBackground-light p-cardPadding dark:bg-cardBackground-dark">
      <div
        className="h-full w-2"
        style={{ backgroundColor: backgroundColor }}
      />

      {/* 텍스트 섹션 */}
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-xl font-bold">
          {value.toLocaleString()} <span className="text-base">{unit}</span>
        </p>
      </div>
    </Card>
  );
};

export default KPICard;
