import { motion } from "framer-motion"; // 애니메이션 라이브러리

import { Card } from "../shadcn";

type TradingStatsData = {
  bidCount: number; // 누적 입찰 수
  todaySmpData: {
    거래량: number;
    거래일: string;
    종가: number;
    최고가: number;
    최저가: number;
    평균가: number;
  }; // SMP 평균가
  todayRecData: {
    거래일: string;
    최고가: number;
    최소가: number;
    평균가: number;
  }; // REC 평균가
  totalSupply: number; // 총 공급량
  smpIncrease: number; // 전일대비 smp 증가량
  recIncrease: number; // 전일대비 rec 증가량
};

interface TradingStatsProps {
  stats: TradingStatsData | null;
}

export default function TradingStats({ stats }: TradingStatsProps) {
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
        />
        <StatItem
          title="REC 평균가"
          value={`${(stats?.todayRecData?.평균가 ?? 0) / 1000} 원/kwh`}
        />
        <StatItem
          title="총 공급량"
          value={`${stats?.totalSupply.toLocaleString()} kWh`}
        />
      </div>
    </motion.div>
  );
}

function StatItem({ title, value }: { title: string; value: string | number }) {
  return (
    <Card className="rounded-lg border-none bg-cardBackground-light p-cardPadding dark:border-none dark:bg-cardBackground-dark">
      <p className="text-sm font-medium text-gray-600 dark:text-gray-200">
        {title}
      </p>
      <p className="text-2xl font-bold text-gray-800 dark:text-white">
        {value}
      </p>
    </Card>
  );
}
