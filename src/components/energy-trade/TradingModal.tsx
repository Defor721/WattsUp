import React from "react";
import { X } from "lucide-react";

import { Button } from "@/components/shadcn/button";
import { Card } from "@/components/shadcn/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/shadcn/tabs";
import { Input } from "@/components/shadcn/input";
import { Label } from "@/components/shadcn/label";

// 타입 정의: Modal의 열림 상태와 닫기 함수 타입 설정
type TradingModalProps = {
  isOpen: boolean; // Modal이 열려있는지 여부
  onClose: () => void; // Modal 닫기 함수
};

// TradingModal 컴포넌트 정의
export function TradingModal({ isOpen, onClose }: TradingModalProps) {
  // 매수 또는 매도 타입 상태 설정 (초기값은 "buy")
  const [orderType, setOrderType] = React.useState<"buy" | "sell">("buy");
  // 주문 수량 상태 설정
  const [orderAmount, setOrderAmount] = React.useState("");
  // 주문 가격 상태 설정
  const [orderPrice, setOrderPrice] = React.useState("");

  // Modal이 닫혀있으면 렌더링하지 않음
  if (!isOpen) return null;

  // 매수 또는 매도 버튼 클릭 시 호출되는 함수
  const handleOrder = (type: "buy" | "sell") => {
    // 콘솔에 주문 정보를 출력
    console.log(`Placing ${type} order for ${orderAmount} at ${orderPrice}`);
    onClose(); // Modal 닫기
  };

  // Modal UI 렌더링
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      {/* Card 컴포넌트를 사용하여 Modal의 구조 생성 */}
      <Card className="w-96 overflow-hidden rounded-lg bg-white shadow-xl">
        {/* 헤더 영역: Modal 제목과 닫기 버튼 */}
        <div className="flex items-center justify-between bg-[rgb(7,15,38)] p-4 text-white">
          <div className="w-8"></div> {/* 좌측 여백을 위한 빈 div */}
          <h2 className="text-xl font-bold">거래하기</h2>
          {/* 닫기 버튼 */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white transition-transform duration-200 hover:rotate-90 hover:bg-opacity-60"
          >
            <X className="h-4 w-4" /> {/* Lucide의 X 아이콘 사용 */}
          </Button>
        </div>

        {/* Modal 본문 */}
        <div className="p-6">
          {/* Tabs 컴포넌트: 매수와 매도 탭 */}
          <Tabs
            value={orderType} // 현재 선택된 탭
            onValueChange={(value) => setOrderType(value as "buy" | "sell")} // 탭 변경 시 상태 업데이트
            className="mb-6"
          >
            <TabsList className="grid w-full grid-cols-2">
              {/* 매수 탭 */}
              <TabsTrigger
                value="buy"
                className="data-[state=active]:bg-green-500 data-[state=active]:text-white"
              >
                매수
              </TabsTrigger>
              {/* 매도 탭 */}
              <TabsTrigger
                value="sell"
                className="data-[state=active]:bg-red-500 data-[state=active]:text-white"
              >
                매도
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* 주문 폼 */}
          <div className="space-y-4">
            <div>
              {/* 수량 입력 필드 */}
              <Label htmlFor="amount" className="mb-2 block">
                수량
              </Label>
              <Input
                id="amount"
                placeholder="0.00" // 입력 필드의 기본 텍스트
                value={orderAmount} // 입력값
                onChange={(e) => setOrderAmount(e.target.value)} // 입력값 변경 시 상태 업데이트
                className="w-full text-white"
              />
            </div>
            <div>
              {/* 가격 입력 필드 */}
              <Label htmlFor="price" className="mb-2 block">
                가격
              </Label>
              <Input
                id="price"
                placeholder="0" // 입력 필드의 기본 텍스트
                value={orderPrice} // 입력값
                onChange={(e) => setOrderPrice(e.target.value)} // 입력값 변경 시 상태 업데이트
                className="w-full text-white"
              />
            </div>

            {/* 주문 버튼 */}
            <Button
              className={`w-full ${
                orderType === "buy"
                  ? "bg-green-500 hover:bg-green-600" // 매수 시 녹색 버튼
                  : "bg-red-500 hover:bg-red-600" // 매도 시 빨간 버튼
              } text-white`}
              onClick={() => handleOrder(orderType)} // 클릭 시 handleOrder 호출
            >
              {orderType === "buy" ? "매수" : "매도"} {/* 버튼 텍스트 */}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
