"use client";

import React, { useEffect, useState } from "react";
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
import PasswordInput from "@/auth/components/common/PasswordInput";
import { useAuthStore } from "@/auth/useAuthStore";

function WithdrawalAccountModal() {
  const router = useRouter();
  const {
    message,
    actions: { withdrawalAccount, resetAuthState },
  } = useAuthStore();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [isCurrentPasswordValid, setIsCurrentPasswordValid] = useState(false);

  const handlewithdrawalAccount = async () => {
    try {
      await withdrawalAccount(password);
      setIsDialogOpen(false);
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!isDialogOpen) {
      setPassword("");
      resetAuthState();
    }
  }, [isDialogOpen, resetAuthState]);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="bg-subColor text-white dark:bg-white dark:text-subColor"
        >
          회원탈퇴
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[450px] gap-8 bg-white dark:bg-subColor">
        <DialogHeader className="gap-3">
          <DialogTitle>회원탈퇴</DialogTitle>
          <DialogDescription>
            탈퇴 후에는 계정과 관련된 모든 데이터가 삭제되며 복구할 수 없습니다.
          </DialogDescription>
        </DialogHeader>
        {/* 비밀번호 입력 */}
        <div className="flex flex-col gap-2">
          <PasswordInput
            passwordLabel="현재 비밀번호"
            password={password}
            showPassword={showCurrentPassword}
            isPasswordValid={isCurrentPasswordValid}
            showMessage={true}
            setPassword={setPassword}
            setShowPassword={setShowCurrentPassword}
            setIsPasswordValid={setIsCurrentPasswordValid}
          />
        </div>
        {message && (
          <p className="text-center text-sm text-red-500">{message}</p>
        )}
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost" className="border-1">
              닫기
            </Button>
          </DialogClose>
          <Button
            onClick={handlewithdrawalAccount}
            className="bg-subColor text-white dark:bg-white dark:text-subColor"
            disabled={!isCurrentPasswordValid}
          >
            탈퇴
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default WithdrawalAccountModal;
