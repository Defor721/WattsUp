import { motion } from "framer-motion";
import { Card } from "../shadcn";
import Loading from "@/app/loading";
import { SupplyData } from "./Main";

type TradingStatsData = {
  bidCount: number;
  todaySmpData: {
    거래량: number;
    거래일: string;
    종가: number;
    최고가: number;
    최저가: number;
    평균가: number;
    전일대비변화: number;
  };
  todayRecData: {
    거래일: string;
    최고가: number;
    최소가: number;
    평균가: number;
  };
  totalSupply: number;
  smpIncrease?: number;
  recIncrease?: number;
};

interface TradingStatsProps {
  stats: TradingStatsData | null;
  supply: SupplyData[];
  selectedRegion: string;
}

export default function TradingStats({
  stats,
  supply,
  selectedRegion,
}: TradingStatsProps) {
  const findData = supply.find((item) => item.region === selectedRegion);

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      className="w-full"
    >
      <div className="grid grid-cols-1 gap-cardGap md:grid-cols-2 xl:grid-cols-4">
        <StatItem title="누적 입찰 수" value={stats?.bidCount || 0} />
        <StatItem
          title="SMP 평균가"
          value={`${stats?.todaySmpData.평균가.toLocaleString()} 원/kWh`}
          change={stats?.smpIncrease}
        />
        <StatItem
          title="REC 평균가"
          value={`${((stats?.todayRecData?.평균가 ?? 0) / 1000).toFixed(2)} 원/kWh`}
          change={stats?.recIncrease}
        />
        <StatItem
          title={`${findData?.region} 총 공급량`}
          value={`${findData?.supply.toLocaleString()} kWh`}
        />
      </div>
    </motion.div>
  );
}

function StatItem({
  title,
  value,
  change,
}: {
  title: string;
  value: string | number;
  change?: number;
}) {
  const changeColor = change && change > 0 ? "text-red-500" : "text-blue-500";
  const changeSymbol = change && change > 0 ? "▲" : "▼";

  return (
    <Card className="rounded-lg border-none bg-cardBackground-light p-cardPadding dark:border-none dark:bg-cardBackground-dark">
      <p className="text-sm font-medium text-gray-600 dark:text-gray-200">
        {title}
      </p>
      <div className="flex items-center">
        <p className="text-2xl font-bold text-gray-800 dark:text-white">
          {value}
        </p>
        {change !== undefined && (
          <span className={`ml-2 text-sm ${changeColor}`}>
            {changeSymbol} {Math.abs(change).toFixed(2)}
          </span>
        )}
      </div>
    </Card>
  );
}
