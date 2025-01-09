import React from "react";

import { Card } from "@/components/shadcn";

interface KPICardProps {
  title: string;
  value: string | number;
  backgroundColor: string; // 카드 배경색
  unit?: string;
}

const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  backgroundColor,
  unit,
}) => {
  return (
    <Card
      className={`flex items-center gap-2 border-none bg-cardBackground-light p-cardPadding dark:bg-cardBackground-dark`}
    >
      <div
        className="h-full w-2"
        style={{ backgroundColor: backgroundColor }}
      />
      <div>
        <div className="flex items-center gap-1">
          <p className="text-sm font-semibold">{title}</p>
          {unit && <p className="text-sm">({unit})</p>}
        </div>
        <p className="text-base font-bold">{value}</p>
      </div>
    </Card>
  );
};

export default KPICard;
