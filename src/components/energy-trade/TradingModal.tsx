import React, { useEffect, useState } from "react";
import { X } from "lucide-react"; // 닫기 버튼 아이콘

// shadcn 컴포넌트 임포트
import { Button } from "@/components/shadcn/button";
import { Card } from "@/components/shadcn/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/shadcn/tabs";
import { Input } from "@/components/shadcn/input";
import { Label } from "@/components/shadcn/label";
import { ToastProvider } from "@/components/shadcn/toast"; // Toast 시스템의 Provider
import { useToast } from "@/hooks/use-toast"; // Toast 훅 사용

// 모달 Props 타입 정의
type TradingModalProps = {
  isOpen: boolean; // 모달이 열려있는지 여부
  onClose: () => void; // 모달을 닫는 함수
};

export function TradingModal({ isOpen, onClose }: TradingModalProps) {
  // 매수 또는 매도 타입 상태 (초기값: "buy")
  const [orderType, setOrderType] = useState<"buy" | "sell">("buy");

  // 주문 수량 상태
  const [orderAmount, setOrderAmount] = useState("");

  // 주문 가격 상태
  const [orderPrice, setOrderPrice] = useState("");

  // Toast 훅 사용 (알림 메시지 표시)
  const { toast } = useToast();

  // 모달이 닫힐 때 입력 필드를 초기화
  useEffect(() => {
    if (!isOpen) {
      setOrderType("buy"); // 기본 값 "매수"로 초기화
      setOrderAmount(""); // 수량 초기화
      setOrderPrice(""); // 가격 초기화
    }
  }, [isOpen]);

  // 모달이 열려있지 않으면 null 반환
  if (!isOpen) return null;

  // 주문 처리 함수
  const handleOrder = (type: "buy" | "sell") => {
    // 수량 입력값 검증
    if (!orderAmount || parseFloat(orderAmount) <= 0) {
      toast({
        title: "입력 오류", // 제목
        description: "수량을 올바르게 입력해주세요!", // 설명
        variant: "destructive", // 오류 스타일
      });
      return;
    }

    // 가격 입력값 검증
    if (!orderPrice || parseFloat(orderPrice) <= 0) {
      toast({
        title: "입력 오류", // 제목
        description: "가격을 올바르게 입력해주세요!", // 설명
        variant: "destructive", // 오류 스타일
      });
      return;
    }

    // 성공적으로 주문 처리 시 Toast 표시
    toast({
      title: "주문 완료", // 제목
      description: `${type === "buy" ? "매수" : "매도"} 주문: ${orderAmount}개, 가격: ${orderPrice}`,
      variant: "default", // 기본 스타일
      className: "bg-[rgb(7,15,38)]",
    });

    // 모달 닫기
    onClose();
  };

  return (
    // ToastProvider로 감싸 Toast가 동작하도록 설정
    <ToastProvider>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        {/* 모달 본체 */}
        <Card className="w-96 overflow-hidden rounded-lg bg-white shadow-xl">
          {/* 모달 헤더 */}
          <div className="flex items-center justify-between bg-[rgb(7,15,38)] p-4 text-white">
            {/* 좌측 빈 공간 */}
            <div className="w-8"></div>
            {/* 헤더 제목 */}
            <h2 className="text-xl font-bold">거래하기</h2>
            {/* 닫기 버튼 */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white transition-transform duration-200 hover:rotate-90 hover:bg-opacity-60"
            >
              <X className="h-8 w-8" />
            </Button>
          </div>

          {/* 모달 본문 */}
          <div className="p-6">
            {/* 매수/매도 선택 탭 */}
            <Tabs
              value={orderType}
              onValueChange={(value) => setOrderType(value as "buy" | "sell")} // 선택 시 상태 업데이트
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

            {/* 주문 입력 폼 */}
            <div className="space-y-4">
              <div>
                {/* 수량 입력 필드 */}
                <Label htmlFor="amount" className="mb-2 block">
                  수량
                </Label>
                <Input
                  id="amount"
                  placeholder="0"
                  value={orderAmount}
                  onChange={(e) => setOrderAmount(e.target.value)} // 입력값 변경
                  className="w-full text-white"
                  type="number"
                  min="0"
                  max="1000000"
                />
              </div>
              <div>
                {/* 가격 입력 필드 */}
                <Label htmlFor="price" className="mb-2 block">
                  가격
                </Label>
                <Input
                  id="price"
                  placeholder="000"
                  value={orderPrice}
                  onChange={(e) => setOrderPrice(e.target.value)} // 입력값 변경
                  className="w-full text-white"
                  type="number"
                  min="1000"
                  max="1000000"
                />
              </div>

              {/* 주문 버튼 */}
              <Button
                className={`w-full ${
                  orderType === "buy"
                    ? "bg-green-500 hover:bg-green-600" // 매수 버튼 스타일
                    : "bg-red-500 hover:bg-red-600" // 매도 버튼 스타일
                } text-white`}
                onClick={() => handleOrder(orderType)} // 클릭 시 주문 처리
              >
                {orderType === "buy" ? "매수" : "매도"}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </ToastProvider>
  );
}
