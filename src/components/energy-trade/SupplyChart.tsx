"use client"; // 클라이언트 컴포넌트 설정

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"; // Recharts 컴포넌트
import { motion } from "framer-motion"; // Framer Motion

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/shadcn/card"; // UI 카드 컴포넌트
import {
  formatNumberWithDecimal,
  formatNumberWithoutDecimal,
} from "@/hooks/useNumberFormatter";

// 데이터 타입 정의
interface SupplyData {
  region: string; // 지역 이름
  supply: number; // 전력 공급량
}

interface SupplyChartProps {
  selectedRegion: string; // 선택된 지역
  onBarClick: (region: string) => void; // 바 클릭 핸들러
  supply: SupplyData[];
}

// SupplyChart 컴포넌트
export default function SupplyChart({
  selectedRegion,
  onBarClick,
  supply,
}: SupplyChartProps) {
  return (
    <div className="w-full">
      <Card className="border-0 shadow-none dark:shadow-none">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            지역별 전력 공급량
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={supply}
              barSize={30}
              margin={{ top: 20, right: 20, bottom: 20, left: 0 }}
            >
              <XAxis dataKey="region" tick={{ fontSize: 12 }} />
              <YAxis
                tick={{ fontSize: 12 }}
                tickFormatter={formatNumberWithoutDecimal}
              />
              <Tooltip
                formatter={(value: number) =>
                  `${formatNumberWithDecimal(value)} kWh`
                }
                labelStyle={{
                  color: "#111", // 각 데이터 항목 텍스트는 흰색
                }}
              />
              <Legend />

              <Bar
                dataKey="supply"
                name="공급량"
                fill="rgb(15,30,75)"
                radius={[4, 4, 0, 0]}
                onClick={(data) => onBarClick(data.region)} // 바 클릭 시 선택된 지역 업데이트
                shape={(props: any) => {
                  const { x, y, width, height, payload } = props;
                  const isSelected = payload.region === selectedRegion;

                  return isSelected ? (
                    // 선택된 경우 깜빡이는 애니메이션 추가
                    <motion.rect
                      x={x}
                      y={y}
                      width={width}
                      height={height}
                      fill="#f59e0b" // 선택된 바의 색상
                      onClick={() => onBarClick(payload.region)}
                      style={{ cursor: "pointer" }}
                      animate={{
                        opacity: [0.6, 1, 0.6], // 깜빡거리는 효과
                      }}
                      transition={{
                        duration: 1, // 1초 동안 깜빡임
                        repeat: Infinity, // 무한 반복
                      }}
                    />
                  ) : (
                    // 기본 막대
                    <rect
                      x={x}
                      y={y}
                      width={width}
                      height={height}
                      fill="#1e3b97" // 기본 바의 색상
                      onClick={() => onBarClick(payload.region)} // 클릭 이벤트 추가
                      style={{ cursor: "pointer" }}
                    />
                  );
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
