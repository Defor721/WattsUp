import React from "react";

import { Card } from "@/components/shadcn";

interface KPICardProps {
  title: string;
  value: string | number;
  unit: string;
  backgroundColor: string;
}

const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  unit,
  backgroundColor,
}) => {
  return (
    <Card className="flex items-center gap-2 border-none bg-cardBackground-light p-cardPadding dark:bg-cardBackground-dark">
      <div
        className="h-full w-2"
        style={{ backgroundColor: backgroundColor }}
      />
      {/* Title and Value Section */}
      <div className="flex-1">
        <p className="text-sm font-semibold">{title}</p>
        <div className="flex items-center gap-1">
          <p className="text-xl font-bold">{value}</p>
          <span className="text-lg font-bold">{unit}</span>
        </div>
      </div>
    </Card>
  );
};

export default KPICard;
