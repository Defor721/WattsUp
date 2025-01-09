import React, { useEffect, useState } from "react";

import { Card } from "@/components/shadcn";
import { formatNumberWithoutDecimal } from "@/hooks/useNumberFormatter";

// 지역 데이터 타입 정의
interface Region {
  name: string;
  value: number;
}

function RegionValue2() {
  const [regions, setRegions] = useState<Region[]>([]);

  useEffect(() => {
    // 지역 데이터 정리
    const fetchTotalData = async () => {
      const response = await fetch("/api/trade/supply");
      const totalData = await response.json();
      const formattedRegions = Object.entries(totalData.result).map(
        ([name, value]) => ({
          name,
          value: Number(value),
        }),
      );
      setRegions(formattedRegions);
    };

    fetchTotalData();
  }, []);

  if (regions.length === 0) {
    return <div>로딩 중...</div>;
  }

  return (
    <Card className="w-[488px] border-none bg-cardBackground-light p-cardPadding dark:bg-cardBackground-dark">
      <div className="py-3 text-center text-lg font-semibold">
        지역별 전력 공급량
      </div>
      <div className="grid grid-cols-2 gap-4">
        {regions.map((region) => (
          <div
            key={region.name}
            className="flex items-center justify-between text-sm"
          >
            <span className="font-medium">{region.name}</span>
            <span>{formatNumberWithoutDecimal(region.value)} kWh</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
export default RegionValue2;
