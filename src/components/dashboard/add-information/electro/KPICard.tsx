import React from "react";

import { Card } from "@/components/shadcn";

interface KPICardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  backgroundColor: string; // 카드 배경색
  iconColor: string; // 아이콘 배경색
}

const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  icon,
  backgroundColor,
  iconColor,
}) => {
  return (
    <Card className="flex items-center gap-2 border-none bg-cardBackground-light p-cardPadding dark:bg-cardBackground-dark">
      <div
        className="h-full w-2"
        style={{ backgroundColor: backgroundColor }}
      />

      {/* 제목 및 값 */}
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-base font-bold">{value}</p>
      </div>
    </Card>
  );
};

export default KPICard;
