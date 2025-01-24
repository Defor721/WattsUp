"use client";

import React, { useEffect, useState } from "react";
import { WalletCards } from "lucide-react";
import { useRouter } from "next/navigation";

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
    loading,
    actions: { chargeCredit, fetchCurrentUser },
  } = useUserStore();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [charge, setCharge] = useState("");
  const [error, setError] = useState("");

  const fixedAmounts = [1000, 10000, 100000, 1000000];
  const MAX_AMOUNT = 10000000;
  const MIN_AMOUNT = 1000;

  const handleFixedCharge = (amount: number) => {
    const newCharge = Math.min(Number(charge) + amount, MAX_AMOUNT);
    setCharge(String(newCharge));

    if (newCharge >= MAX_AMOUNT) {
      setError(`최대 충전 금액은 ${MAX_AMOUNT.toLocaleString()}원입니다.`);
    } else {
      setError("");
    }
  };

  const handleInputChange = (value: string) => {
    const numericValue = Number(value.replace(/[^0-9]/g, ""));
    if (numericValue > MAX_AMOUNT) {
      setError(`최대 충전 금액은 ${MAX_AMOUNT.toLocaleString()}원입니다.`);
      return;
    } else {
      setError("");
      setCharge(value.replace(/[^0-9]/g, ""));
    }
  };

  const handleChargeSubmit = async () => {
    if (Number(charge) < MIN_AMOUNT || Number(charge) > MAX_AMOUNT) {
      setError(
        `충전 금액은 ${MIN_AMOUNT.toLocaleString()}원 이상, ${MAX_AMOUNT.toLocaleString()}원 이하여야 합니다.`,
      );
      return;
    }
    try {
      await chargeCredit(Number(charge));
      setIsDialogOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
    if (!isDialogOpen) {
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
          크레딧 충전
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[480px] select-none gap-8 bg-white dark:bg-subColor">
        <DialogHeader className="gap-3">
          <DialogTitle>크레딧 충전</DialogTitle>
          <DialogDescription>
            충전할 금액을 선택하거나 입력 후 충전 버튼을 눌러주세요.
            <br />
            1회 최소충전금액은 1,000원이며 최대충전금액은 10,000,000 원입니다.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          {/* 크레딧 잔액 */}
          <div className="text-lg font-bold">
            크레딧 잔액: {user?.credit ? user.credit.toLocaleString() : "0"} 원
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
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="금액 입력"
              className="w-full rounded border border-gray-300 px-3 py-2"
            />
          </div>
          {/* 에러 메시지 */}
          {error && <p className="text-center text-sm text-red-500">{error}</p>}
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
            disabled={
              loading ||
              Number(charge) < MIN_AMOUNT ||
              Number(charge) > MAX_AMOUNT
            }
          >
            충전
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
