"use client"; // 서버 컴포넌트 대신 클라이언트에서 실행됨.

import { motion } from "framer-motion";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/shadcn/card";
import { PowerSupplyData } from "@/components/energy-trade/mock/types";
// import React from "react";

interface StatusCardsProps {
  currentSupply: PowerSupplyData; // 컴포넌트 Props의 타입 정의. `currentSupply`는 PowerSupplyData 타입.
}

// React Functional Component로 StatusCards 정의
export const StatusCards: React.FC<StatusCardsProps> = ({ currentSupply }) => {
  // 예비율 계산: 공급에서 수요를 뺀 값을 수요로 나누고 백분율로 변환
  // React.FC를 사용하면 컴포넌트의 Props를 명시적으로 지정
  const reserveRate =
    ((currentSupply.supply - currentSupply.demand) / currentSupply.demand) *
    100;

  // Framer Motion에서 사용될 애니메이션 변형 설정
  const cardVariants = {
    hidden: { opacity: 0, y: 50 }, // 초기 상태: 투명도 0, 아래로 50px 이동
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }, // 애니메이션 상태: 투명도 1, 원래 위치로 이동
  };

  // 카드 데이터 배열: 제목과 값을 포함하는 각 카드의 정보를 정의
  const cards = [
    {
      title: "현재 수요", // 카드 제목
      value: `${currentSupply.demand.toLocaleString()} MW`, // 숫자를 지역화된 문자열로 변환
    },
    {
      title: "현재 공급",
      value: `${currentSupply.supply.toLocaleString()} MW`,
    },
    {
      title: "현재 예비력",
      value: `${(
        currentSupply.supply - currentSupply.demand
      ).toLocaleString()} MW`, // 공급 - 수요
    },
    { title: "현재 예비율", value: `${reserveRate.toFixed(2)}%` }, // 예비율을 소수점 2자리로 고정
  ];

  return (
    <>
      {cards.map((card, index) => (
        <motion.div
          key={index} // React에서 리스트 렌더링 시 고유한 키 필요
          initial="hidden" // 초기 상태: 애니메이션 변형에 따라 숨겨짐
          animate="visible" // 애니메이션 상태: 변형에 따라 표시
          variants={cardVariants} // 설정한 변형을 사용
          custom={index} // Framer Motion에서 커스텀 값 전달 (사용 가능)
        >
          {/* 카드 UI 구성 */}
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              {/* 카드 제목 */}
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* 카드 값 */}
              <div className="text-2xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </>
  );
};
