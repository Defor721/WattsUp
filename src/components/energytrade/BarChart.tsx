import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/shadcn/card";
import { PowerSupplyData } from "@/components/energytrade/mock/types";

// Props 타입 정의 (PowerSupplyData 배열을 받음)
interface BarChartProps {
  data: PowerSupplyData[]; // 전력 수급 데이터를 나타냄
}

// BarChartComponent: 바 차트를 렌더링하는 컴포넌트
export function BarChartComponent({ data }: BarChartProps) {
  return (
    // 전체 컴포넌트를 감싸는 카드
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>시간대별 전력수급 현황</CardTitle> {/* 카드 제목 */}
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          {/* 반응형 컨테이너 */}
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data} // 차트에 전달할 데이터
              margin={{
                top: 15, // 상단 여백
                right: 30, // 오른쪽 여백
                left: 20, // 왼쪽 여백
                bottom: 5, // 하단 여백
              }}
            >
              {/* 차트 배경 그리드 */}
              <CartesianGrid strokeDasharray="3 3" />
              {/* X축 (시간 데이터) */}
              <XAxis dataKey="time" />
              {/* Y축 */}
              <YAxis />
              {/* 마우스 오버 시 데이터 툴팁 */}
              <Tooltip />
              {/* 데이터 키 설명 */}
              <Legend />
              {/* 데이터 바: 공급 */}
              <Bar dataKey="supply" fill="#FF85A1" name="공급" barSize={15} />
              {/* 데이터 바: 수요 */}
              <Bar dataKey="demand" fill="#42C9FF" name="수요" barSize={15} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
