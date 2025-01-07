/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Button,
  DialogClose,
  TooltipProvider,
} from "@/components/shadcn";
import { useUserStore } from "@/stores/useUserStore";

import BusinessNumberSection from "../common/business/BusinessNumberSection";
import CorporateNumber from "../common/business/CorporateNumber";

interface FindPasswordPopupProps {
  children: React.ReactNode;
}

export default function FindEmailPopup({ children }: FindPasswordPopupProps) {
  const {
    loading,
    error,
    message,
    actions: { findEmail, resetUserState },
  } = useUserStore();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [businessNumber, setBusinessNumber] = useState("");
  const [isBusinessVerified, setIsBusinessVerified] = useState(false);
  const [corporateNumber, setCorporateNumber] = useState("");
  const [isEmailFound, setIsEmailFound] = useState(false);

  const handleSendConfirmEmail = async () => {
    try {
      await findEmail({ businessNumber, corporateNumber });
      setIsEmailFound(true);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!isDialogOpen) {
      setBusinessNumber("");
      setIsBusinessVerified(false);
      setCorporateNumber("");
      setIsEmailFound(false);
      resetUserState();
    }
  }, [isDialogOpen]);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="flex max-w-[480px] select-none flex-col gap-4">
        <DialogHeader>
          <DialogTitle>이메일을 잊으셨나요?</DialogTitle>
          <DialogDescription>
            가입 시 입력하신 정보로 이메일을 찾을 수 있습니다.
          </DialogDescription>
        </DialogHeader>
        <TooltipProvider>
          {/* 사업자 번호 */}
          <BusinessNumberSection
            businessNumber={businessNumber}
            isBusinessVerified={isBusinessVerified}
            isBusinessLoading={loading}
            setBusinessNumber={setBusinessNumber}
          />
          {/* 법인 등록번호 */}
          <CorporateNumber
            corporateNumber={corporateNumber}
            isBusinessVerified={isBusinessVerified}
            isBusinessLoading={loading}
            setCorporateNumber={setCorporateNumber}
          />
        </TooltipProvider>
        {message && (
          <p
            className={`text-center text-sm ${
              error ? "text-red-500" : "text-green-500"
            }`}
          >
            {message}
          </p>
        )}
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="ghost" className="border-1">
              취소
            </Button>
          </DialogClose>
          <Button
            type="button"
            className="bg-mainColor text-white dark:bg-white dark:text-subColor"
            onClick={handleSendConfirmEmail}
            disabled={loading || isEmailFound}
          >
            조회
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
