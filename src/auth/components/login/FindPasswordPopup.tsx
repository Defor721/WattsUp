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
} from "@/components/shadcn";
import { useUserStore } from "@/stores/useUserStore";

import PasswordSection from "../common/password/PasswordSection";
import EmailSection from "../common/email/EmailSection";

interface FindPasswordPopupProps {
  children: React.ReactNode;
}

export default function FindPasswordPopup({
  children,
}: FindPasswordPopupProps) {
  const {
    message,
    actions: { resetPassword, resetUserState },
  } = useUserStore();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [isNewPasswordValid, setIsNewPasswordValid] = useState(false);
  const [isConfirmNewPasswordValid, setIsConfirmNewPasswordValid] =
    useState(false);

  const handleSendConfirmEmail = async () => {
    try {
      await resetPassword(newPassword);
      setIsDialogOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!isDialogOpen) {
      setIsEmailVerified(false);
      setNewPassword("");
      setIsNewPasswordValid(false);
      setIsConfirmNewPasswordValid(false);
      resetUserState();
    }
  }, [isDialogOpen]);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="flex max-w-[480px] select-none flex-col gap-8">
        <DialogHeader>
          <DialogTitle>비밀번호를 잊으셨나요?</DialogTitle>
          <DialogDescription>
            비밀번호 재설정을 위해 이메일 인증 후 새 비밀번호를 설정하세요.
          </DialogDescription>
        </DialogHeader>
        <EmailSection
          isEmailVerified={isEmailVerified}
          setIsEmailVerified={setIsEmailVerified}
        />
        <PasswordSection
          passwordLabel="새 비밀번호"
          confirmPasswordLabel="새 비밀번호 확인"
          password={newPassword}
          isPasswordValid={isNewPasswordValid}
          isConfirmPasswordValid={isConfirmNewPasswordValid}
          setPassword={setNewPassword}
          setIsPasswordValid={setIsNewPasswordValid}
          setIsConfirmPasswordValid={setIsConfirmNewPasswordValid}
        />
        {message && (
          <p className="text-center text-sm text-red-500">{message}</p>
        )}
        <DialogFooter>
          <DialogClose>
            <Button type="button" variant="ghost" className="border-1">
              취소
            </Button>
          </DialogClose>
          <Button
            type="button"
            className="bg-mainColor text-white dark:bg-white dark:text-subColor"
            onClick={handleSendConfirmEmail}
            disabled={
              !isEmailVerified ||
              !isNewPasswordValid ||
              !isConfirmNewPasswordValid
            }
          >
            변경
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
