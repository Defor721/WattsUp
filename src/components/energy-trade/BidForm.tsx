import { useState, FormEvent } from "react";
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
import { toast } from "@/hooks/useToast";
import { formatNumberWithoutDecimal } from "@/hooks/useNumberFormatter";

import { SupplyData } from "./SupplyChart";

const regionOptions = Regions.map((region) => ({
  value: region.toLowerCase(),
  label: region,
}));

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
  isSubmitting: boolean;
  setIsSubmitting: any;
  smpPrice: number;
  recPrice: number;
  credits: number;
  setCredits: any;
  fetchUserCredits: any;
  supply: SupplyData[];
}

export default function BidForm({
  region,
  onRegionChange,
  isSubmitting,
  setIsSubmitting,
  smpPrice,
  credits,
  setCredits,
  fetchUserCredits,
  supply,
  recPrice,
}: BidFormProps) {
  const [quantity, setQuantity] = useState<number>(0);
  const selectedSupply =
    supply.find((item) => item.region === region)?.supply || 0;
  const roundedSupply = Math.round(selectedSupply);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (quantity <= 0) {
      toast({
        title: "입찰 실패",
        description: "수량은 0보다 커야 합니다.",
        variant: "destructive",
      });
      return;
    }

    const totalPrice = quantity * totalUnitPrice;
    if (totalPrice > credits) {
      toast({
        title: "입찰 실패",
        description: "보유 크레딧이 부족합니다.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await submitBid(totalPrice, region, quantity);
      toast({
        title: "입찰 성공",
        description: "입찰이 성공적으로 제출되었습니다.",
        variant: "success",
      });

      onRegionChange(regionOptions[0]?.value || ""); // 기본값 설정
      setQuantity(0);

      // 크레딧 업데이트
      const updatedCredits = await fetchUserCredits();
      setCredits(updatedCredits);
    } catch (error: any) {
      toast({
        title: "입찰 실패",
        description:
          error.response?.data?.message || "입찰 제출 중 문제가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalUnitPrice = smpPrice + recPrice / 1000; // SMP와 REC 가격 합산

  return (
    <div className="w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="w-full"
      >
        <Card className="border-0 shadow-none dark:shadow-none">
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
                  <SelectTrigger
                    id="region"
                    className="mt-2 bg-white dark:bg-transparent"
                  >
                    <SelectValue placeholder="지역을 선택하세요" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-cardBackground-dark">
                    {regionOptions.map((region) => (
                      <SelectItem
                        className="bg-white dark:bg-cardBackground-dark"
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
                  전력량 (kWh)
                </Label>
                <Input
                  id="quantity"
                  type="text"
                  value={quantity.toLocaleString()}
                  onChange={(e) => {
                    const value = e.target.value.replace(/,/g, "");
                    if (value === "") {
                      setQuantity(0);
                      return;
                    }
                    const numericValue = Number(value);
                    if (!isNaN(numericValue) && numericValue >= 0) {
                      if (numericValue > roundedSupply) {
                        toast({
                          title: "입력 제한",
                          description: `최대 ${roundedSupply.toLocaleString()} kWh까지만 입력할 수 있습니다.`,
                          variant: "destructive",
                        });
                        setQuantity(roundedSupply);
                      } else {
                        setQuantity(numericValue);
                      }
                    }
                  }}
                  required
                  className="bg-white dark:bg-transparent"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">단가 (원/kWh)</Label>
                <div className="text-lg font-bold">
                  {smpPrice.toLocaleString()} +{" "}
                  {(recPrice / 1000).toLocaleString()} ={" "}
                  <span className="text-primary">
                    {totalUnitPrice.toLocaleString()}
                  </span>{" "}
                  원
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">총 가격 (원)</Label>
                <div className="text-lg font-bold">
                  {quantity && totalUnitPrice
                    ? (quantity * totalUnitPrice).toLocaleString()
                    : "0"}{" "}
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
