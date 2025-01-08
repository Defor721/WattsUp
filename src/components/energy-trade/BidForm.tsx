"use client"; // Next.js의 client-side 컴포넌트임을 명시

import { useState, useEffect, FormEvent } from "react"; // React 훅과 타입 가져오기
import { motion } from "framer-motion"; // 애니메이션 라이브러리

// ShadCN UI 컴포넌트 가져오기
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/shadcn/card";
import { Input } from "@/components/shadcn/input";
import { Button } from "@/components/shadcn/button";
import { Label } from "@/components/shadcn/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn/select";
import { Regions } from "@/utils/regions"; // 지역 리스트 가져오기
import apiClient from "@/lib/axios";

// Regions 배열을 Select 컴포넌트에서 사용할 수 있는 옵션 형식으로 변환
const regionOptions = Regions.map((region) => ({
  value: region.toLowerCase(), // '시', '도' 제거 후 소문자로 변환
  label: region, // 원래 지역명을 label로 사용
}));

// API 호출 함수
const submitBid = async (price: number, region: string, quantity: number) => {
  try {
    const response = await apiClient.post("/api/trade/bid", {
      price,
      region,
      quantity,
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error("API Error:", error.response.data);
    } else {
      console.error("Unknown Error:", error.message);
    }
    throw new Error("서버와의 통신 중 문제가 발생했습니다.");
  }
};

interface BidFormProps {
  region: string;
  onRegionChange: (region: string) => void; // 셀렉터 변경 핸들러
}

// 입찰 폼 컴포넌트
export default function BidForm({ region, onRegionChange }: BidFormProps) {
  const [quantity, setQuantity] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 폼 제출 핸들러 함수
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // 폼 기본 동작 방지

    const totalPrice = +quantity * +price; // 수량과 단가를 곱해 총 가격 계산
    setIsSubmitting(true);
    try {
      await submitBid(totalPrice, region, quantity);
      alert("입찰이 성공적으로 제출되었습니다.");
      onRegionChange("");
      setQuantity(0);
      setPrice(0);
    } catch {
      alert("입찰 제출 중 문제가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="w-full"
      >
        <Card className="border-0">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">입찰하기</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 사용자 아이디*/}
              {/* <span>사용자 id</span> */}
              {/* 지역 선택 */}
              <div>
                <Label htmlFor="region" className="text-sm font-medium">
                  지역
                </Label>
                <Select value={region} onValueChange={onRegionChange}>
                  <SelectTrigger id="region">
                    <SelectValue placeholder="지역을 선택하세요" />
                  </SelectTrigger>
                  <SelectContent className="z-50 bg-white">
                    {regionOptions.map((region) => (
                      <SelectItem key={region.value} value={region.value}>
                        {region.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* 수량 입력 */}
              <div className="space-y-2">
                <Label htmlFor="quantity" className="text-sm font-medium">
                  수량 (kWh)
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  required
                  className="bg-transparent"
                />
              </div>
              {/* 단가 입력 */}
              <div className="space-y-2">
                <Label htmlFor="price" className="text-sm font-medium">
                  단가 (원/kWh)
                </Label>
                <Input
                  id="price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  required
                  className="bg-transparent"
                />
              </div>
              {/* 총 가격 표시 */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">총 가격 (원)</Label>
                <div className="text-lg font-bold">
                  {quantity && price
                    ? (+quantity * +price).toLocaleString()
                    : "0"}
                  원
                </div>
              </div>
              {/* 제출 버튼 */}
              <Button
                type="submit" // 버튼 타입: 제출
                disabled={isSubmitting} // 제출 중이면 비활성화
                className="w-full bg-mainColor text-white dark:bg-white dark:text-mainColor" ///90은 90% 불투명도를 의미(10% 투명).
              >
                {isSubmitting ? "제출 중..." : "입찰하기"}
                {/* 상태에 따라 버튼 텍스트 변경 */}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
