"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios"; // Axios를 가져오기

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

const regions = [
  { value: "seoul", label: "서울특별시" },
  { value: "busan", label: "부산광역시" },
  { value: "daegu", label: "대구광역시" },
  { value: "incheon", label: "인천광역시" },
  { value: "gwangju", label: "광주광역시" },
  { value: "daejeon", label: "대전광역시" },
  { value: "ulsan", label: "울산광역시" },
  { value: "sejong", label: "세종특별자치시" },
  { value: "gyeonggi", label: "경기도" },
  { value: "gangwon", label: "강원도" },
  { value: "chungbuk", label: "충청북도" },
  { value: "chungnam", label: "충청남도" },
  { value: "jeonbuk", label: "전라북도" },
  { value: "jeonnam", label: "전라남도" },
  { value: "gyeongbuk", label: "경상북도" },
  { value: "gyeongnam", label: "경상남도" },
  { value: "jeju", label: "제주특별자치도" },
];

// 입찰 API 호출 함수
const submitBid = async (region: string, quantity: number, price: number) => {
  const totalPrice = quantity * price;
  const response = await axios.post("/api/trade/bid", {
    region,
    price: totalPrice,
  });
  return response.data;
};

// 입찰 폼 컴포넌트
export default function BidForm() {
  const [region, setRegion] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await submitBid(region, Number(quantity), Number(price));
      alert("입찰이 성공적으로 제출되었습니다.");
      setRegion("");
      setQuantity("");
      setPrice("");
    } catch (error) {
      console.error("Failed to submit bid:", error);
      alert("입찰 제출 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">입찰하기</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 지역 선택 */}
            <div className="space-y-2">
              <Label htmlFor="region" className="text-sm font-medium">
                지역
              </Label>
              <Select value={region} onValueChange={setRegion} required>
                <SelectTrigger id="region">
                  <SelectValue placeholder="지역을 선택하세요" />
                </SelectTrigger>
                <SelectContent className="z-50 bg-white">
                  {regions.map((region) => (
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
                onChange={(e) => setQuantity(e.target.value)}
                required
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
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>

            {/* 총 가격 표시 */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">총 가격 (원)</Label>
              <div className="text-lg font-bold">
                {quantity && price
                  ? (Number(quantity) * Number(price)).toLocaleString()
                  : "0"}{" "}
                원
              </div>
            </div>

            {/* 제출 버튼 */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[rgb(13,23,53)] text-white hover:bg-[rgb(13,23,53)]/90"
            >
              {isSubmitting ? "제출 중..." : "입찰하기"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
