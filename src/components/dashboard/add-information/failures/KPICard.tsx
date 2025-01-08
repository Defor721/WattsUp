import React from "react";

import { Card } from "@/components/shadcn";

interface KPICardProps {
  title: string;
  value: string;
  backgroundColor: string;
}

const KPICard: React.FC<KPICardProps> = ({ title, value, backgroundColor }) => {
  return (
    <Card className="flex items-center gap-2 border-none bg-cardBackground-light p-cardPadding dark:bg-cardBackground-dark">
      <div
        className="h-full w-2"
        style={{ backgroundColor: backgroundColor }}
      />
      <div>
        <h3 className="text-sm font-semibold">{title}</h3>
        <p className="text-xl font-bold">{value}</p>
      </div>
    </Card>
  );
};

export default KPICard;
