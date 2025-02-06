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
import { useAuthStore } from "@/auth/useAuthStore";
import PasswordInput from "@/auth/components/common/password/PasswordInput";
import { useUserStore } from "@/stores/useUserStore";
import useAccessToken from "@/auth/hooks/useAccessToken";

interface WithdrawalAccountModalProps {
  children: React.ReactNode;
}

function WithdrawalAccountModal({ children }: WithdrawalAccountModalProps) {
  const router = useRouter();
  const {
    message,
    isError,
    actions: { withdrawalAccount, resetAuthState },
  } = useAuthStore();
  const {
    actions: { resetUserState },
  } = useUserStore();
  const { resetAccessToken } = useAccessToken();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [isCurrentPasswordValid, setIsCurrentPasswordValid] = useState(false);

  const handlewithdrawalAccount = async () => {
    try {
      await withdrawalAccount(password);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!isDialogOpen) {
      setPassword("");
      resetAuthState();
    }
  }, [isDialogOpen, resetAuthState]);

  useEffect(() => {
    if (!isError && message === "회원 탈퇴가 완료되었습니다.") {
      resetUserState();
      resetAccessToken();
      setIsDialogOpen(false);
      router.push("/");
    }
  }, [message, isError, router, resetUserState, resetAccessToken]);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-[480px] select-none gap-8 bg-white dark:bg-subColor">
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
