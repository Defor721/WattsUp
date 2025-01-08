import { useState, useEffect, FormEvent } from "react";
import { motion } from "framer-motion";

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
import { Regions } from "@/utils/regions";
import apiClient from "@/lib/axios";

const regionOptions = Regions.map((region) => ({
  value: region.toLowerCase(),
  label: region,
}));

const fetchUserCredits = async () => {
  try {
    const response = await apiClient.get("/api/users/credit");
    return response.data.credits || 0; // 크레딧 데이터 반환
  } catch (error: any) {
    console.error("크레딧 데이터 로드 실패:", error.message);
    return 0; // 실패 시 0으로 설정
  }
};

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
  onRegionChange: (region: string) => void;
}

export default function BidForm({ region, onRegionChange }: BidFormProps) {
  const [quantity, setQuantity] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [credits, setCredits] = useState<number>(0); // 크레딧 상태 추가

  useEffect(() => {
    // 컴포넌트 마운트 시 크레딧 데이터 가져오기
    const loadCredits = async () => {
      const userCredits = await fetchUserCredits();
      setCredits(userCredits);
    };
    loadCredits();
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (quantity <= 0 || price <= 0) {
      alert("수량과 단가는 0보다 커야 합니다.");
      return;
    }

    const totalPrice = quantity * price;
    if (totalPrice > credits) {
      alert("보유 크레딧이 부족합니다.");
      return;
    }

    setIsSubmitting(true);
    try {
      await submitBid(totalPrice, region, quantity);
      alert("입찰이 성공적으로 제출되었습니다.");
      onRegionChange(regionOptions[0]?.value || ""); // 기본값 설정
      setQuantity(0);
      setPrice(0);

      // 크레딧 업데이트
      const updatedCredits = await fetchUserCredits();
      setCredits(updatedCredits);
    } catch (error: any) {
      alert(
        error.response?.data?.message || "입찰 제출 중 문제가 발생했습니다.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
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
            <div className="mb-4">
              <Label className="text-sm font-medium">보유 크레딧</Label>
              <div className="text-lg font-bold">
                {credits.toLocaleString()} 원
              </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="region" className="text-sm font-medium">
                  지역
                </Label>
                <Select value={region} onValueChange={onRegionChange}>
                  <SelectTrigger id="region">
                    <SelectValue placeholder="지역을 선택하세요" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-subColor">
                    {regionOptions.map((region) => (
                      <SelectItem
                        className="bg-white dark:bg-subColor"
                        key={region.value}
                        value={region.value}
                      >
                        {region.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
              <div className="space-y-2">
                <Label className="text-sm font-medium">총 가격 (원)</Label>
                <div className="text-lg font-bold">
                  {quantity && price
                    ? (quantity * price).toLocaleString()
                    : "0"}
                  원
                </div>
              </div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-mainColor text-white dark:bg-white dark:text-mainColor"
              >
                {isSubmitting ? "제출 중..." : "입찰하기"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
