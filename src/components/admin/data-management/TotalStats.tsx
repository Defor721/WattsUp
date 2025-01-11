import React from "react";

import { Card } from "@/components/shadcn";
import { formatNumberWithoutDecimal } from "@/hooks/useNumberFormatter";

import { Stats } from "./Main";

interface TotalStatsProps {
  stats: Stats | null;
}

function TotalStats({ stats }: TotalStatsProps) {
  if (stats !== null) {
    return (
      <div className="gird-cols-2 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="border-none bg-cardBackground-light p-5 dark:bg-cardBackground-dark">
          <div className="text-sm font-semibold">총 거래된 금액</div>
          <div className="text-2xl font-bold">
            {formatNumberWithoutDecimal(stats.totalPrice)} 원
          </div>
        </Card>
        <Card className="border-none bg-cardBackground-light p-5 dark:bg-cardBackground-dark">
          <div className="text-sm font-semibold">총 수익</div>
          <div className="text-2xl font-bold">
            {formatNumberWithoutDecimal(stats.totalPrice * 0.02)} 원
          </div>
        </Card>
        <Card className="border-none bg-cardBackground-light p-5 dark:bg-cardBackground-dark">
          <div className="text-sm font-semibold">총 거래된 전력량</div>
          <div className="text-2xl font-bold">
            {formatNumberWithoutDecimal(stats.totalQuantity)} kWh
          </div>
        </Card>
        <Card className="border-none bg-cardBackground-light p-5 dark:bg-cardBackground-dark">
          <div className="text-sm font-semibold">총 거래 횟수</div>
          <div className="text-2xl font-bold">
            {formatNumberWithoutDecimal(stats.totalCount)} 회
          </div>
        </Card>
      </div>
    );
  }
}

export default TotalStats;
