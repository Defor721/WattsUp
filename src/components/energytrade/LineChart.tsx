// Recharts의 주요 컴포넌트를 가져옵니다.
import {
  LineChart, // 라인 차트를 생성하는 컴포넌트
  Line, // 데이터 라인을 정의하는 컴포넌트
  XAxis, // x축을 정의하는 컴포넌트
  YAxis, // y축을 정의하는 컴포넌트
  CartesianGrid, // 격자선을 생성하는 컴포넌트
  Tooltip, // 마우스 오버 시 세부 정보를 표시하는 툴팁
  Legend, // 범례(데이터 설명)를 표시하는 컴포넌트
  ResponsiveContainer, // 차트를 반응형으로 설정하는 컨테이너
} from "recharts";

// 사용자 정의 카드 컴포넌트를 가져옵니다.
import {
  Card, // 카드의 외곽을 정의
  CardContent, // 카드 내부의 콘텐츠 섹션
  CardHeader, // 카드 헤더 섹션
  CardTitle, // 카드 제목 텍스트
} from "@/components/shadcn/card";

// 데이터 타입 정의 (PowerSupplyData 타입)
import { PowerSupplyData } from "@/components/energytrade/mock/types";

// LineChartProps 인터페이스 정의: 데이터 속성 타입 지정
interface LineChartProps {
  data: PowerSupplyData[]; // PowerSupplyData 배열 타입
}

// 라인 차트 컴포넌트 정의
export function LineChartComponent({ data }: LineChartProps) {
  return (
    <Card className="mb-8">
      {" "}
      {/* 카드의 여백 설정 */}
      <CardHeader>
        <CardTitle>시간대별 전력 수요 및 공급 추이</CardTitle> {/* 카드 제목 */}
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          {" "}
          {/* 차트 높이 설정 */}
          <ResponsiveContainer width="100%" height="100%">
            {/* 반응형 차트 컨테이너 */}
            <LineChart
              data={data} // 차트에 시각화할 데이터 전달
              margin={{
                top: 5, // 위 여백
                right: 30, // 오른쪽 여백
                left: 20, // 왼쪽 여백
                bottom: 5, // 아래 여백
              }}
            >
              {/* 차트의 격자선 설정 (점선 스타일) */}
              <CartesianGrid strokeDasharray="3 3" />

              {/* X축 설정: 'time' 데이터를 기준으로 표시 */}
              <XAxis dataKey="time" />

              {/* Y축 기본 설정 (값 자동 설정) */}
              <YAxis />

              {/* 마우스 오버 시 데이터 툴팁 표시 */}
              <Tooltip />

              {/* 범례 설정: 차트 하단에 데이터 설명 표시 */}
              <Legend />

              {/* 데이터 라인: 공급 데이터 시각화 */}
              <Line
                type="monotone" // 선 스타일을 부드러운 곡선으로 설정
                dataKey="supply" // 공급 데이터 키
                stroke="#FF85A1" // 선 색상
                name="공급" // 범례 이름
              />

              {/* 데이터 라인: 수요 데이터 시각화 */}
              <Line
                type="monotone" // 선 스타일을 부드러운 곡선으로 설정
                dataKey="demand" // 수요 데이터 키
                stroke="#42C9FF" // 선 색상
                name="수요" // 범례 이름
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
