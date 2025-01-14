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
import { useState } from "react"; // 상태 관리

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/shadcn/card"; // UI 카드 컴포넌트
import { formatNumberWithoutDecimal } from "@/hooks/useNumberFormatter"; // 숫자 포맷팅

// 데이터 타입 정의
export interface SupplyData {
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
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null); // Hover 상태 관리

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
              margin={{ top: 20, right: 0, bottom: 10, left: 0 }}
            >
              <XAxis dataKey="region" tick={{ fontSize: 12 }} />
              <YAxis
                tick={{ fontSize: 12 }}
                tickFormatter={formatNumberWithoutDecimal}
              />
              <Tooltip
                formatter={(value: number) =>
                  `${formatNumberWithoutDecimal(value)} kWh`
                }
                labelStyle={{ color: "#111" }}
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
                  const isHovered = hoveredRegion === payload.region;

                  return (
                    <g
                      onMouseEnter={() => setHoveredRegion(payload.region)} // Hover 시작
                      onMouseLeave={() => setHoveredRegion(null)} // Hover 종료
                    >
                      {/* 화살표 UI (선택되지 않은 바에만 표시) */}
                      {!isSelected && isHovered && (
                        <motion.polygon
                          points={`${x + width / 2 - 6},${y - 20} ${x + width / 2 + 6},${y - 20} ${x + width / 2},${y - 10}`}
                          fill="#1e3b97"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      )}
                      {/* 선택된 바 */}
                      {isSelected ? (
                        <motion.rect
                          x={x}
                          y={y}
                          width={width}
                          height={height}
                          fill="#f59e0b"
                          onClick={() => onBarClick(payload.region)}
                          style={{ cursor: "pointer" }}
                          animate={{
                            opacity: [1, 0.6, 1], // 깜빡이는 효과
                          }}
                          transition={{
                            duration: 0.5, // 0.5초 동안 깜빡임
                            repeat: 2, // 2번 반복
                          }}
                        />
                      ) : (
                        // 기본 막대
                        <rect
                          x={x}
                          y={y}
                          width={width}
                          height={height}
                          fill="#1e3b97"
                          onClick={() => onBarClick(payload.region)}
                          style={{ cursor: "pointer" }}
                        />
                      )}
                    </g>
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
