"use client";

import React, { useEffect, useState } from "react";
import { WalletCards } from "lucide-react";

import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/shadcn";
import { useUserStore } from "@/stores/useUserStore";

export default function ChargeCreditModal() {
  const {
    user,
    message,
    loading,
    actions: { chargeCredit, resetUserState },
  } = useUserStore();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [charge, setCharge] = useState("");

  const fixedAmounts = [1000, 10000, 100000, 1000000]; // 고정 금액 옵션

  // 고정 금액 버튼 클릭 시 기존 금액에 추가
  const handleFixedCharge = (amount: number) => {
    setCharge((prevCharge) => String(Number(prevCharge) + amount));
  };

  const handleChargeSubmit = async () => {
    try {
      await chargeCredit(charge);
      setIsDialogOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!isDialogOpen) {
      resetUserState();
      setCharge("");
    }
  }, [isDialogOpen]);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="bg-mainColor text-white dark:bg-white dark:text-subColor"
        >
          <WalletCards className="mr-2 h-4 w-4" />
          예치금 충전
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[480px] select-none gap-8 bg-white dark:bg-subColor">
        <DialogHeader className="gap-3">
          <DialogTitle>예치금 충전</DialogTitle>
          <DialogDescription>
            충전할 금액을 선택하거나 입력 후 충전 버튼을 눌러주세요.
            <br />
            최소충전 금액은 1000원입니다.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          {/* 예치금 잔액 */}
          <div className="text-lg font-bold">
            예치금 잔액: {user?.credit ? user.credit.toLocaleString() : "0"} 원
          </div>
          {/* 충전 금액 선택 */}
          <div className="flex justify-between">
            {fixedAmounts.map((amount) => (
              <Button
                key={amount}
                variant="outline"
                className="bg-mainColor text-white"
                onClick={() => handleFixedCharge(amount)}
              >
                + {amount.toLocaleString()}
              </Button>
            ))}
          </div>
          {/* 직접 입력 필드 */}
          <div className="mt-4 flex flex-col gap-2">
            <label htmlFor="direct-input" className="text-sm font-medium">
              직접 입력 (원)
            </label>
            <input
              id="direct-input"
              value={charge}
              onChange={(e) => {
                setCharge(e.target.value.replace(/[^0-9]/g, ""));
              }}
              placeholder="금액 입력"
              className="w-full rounded border border-gray-300 px-3 py-2"
            />
          </div>
          {/* 에러 메시지 */}
          {message && (
            <p className="text-center text-sm text-red-500">{message}</p>
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost" className="border-1">
              닫기
            </Button>
          </DialogClose>
          <Button
            onClick={handleChargeSubmit}
            className="bg-mainColor text-white dark:bg-white dark:text-subColor"
            disabled={loading || Number(charge) < 1000}
          >
            충전
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
