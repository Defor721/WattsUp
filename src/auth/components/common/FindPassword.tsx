"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Button,
} from "@/components/shadcn";
import { useUserStore } from "@/stores/useUserStore";

import PasswordSection from "./PasswordSection";
import EmailSection from "./EmailSection";

interface Props {
  children: React.ReactNode;
}

function FindPasswordPopup({ children }: Props) {
  const router = useRouter();
  const {
    message,
    actions: { changePassword, resetUserState },
  } = useUserStore();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [isNewPasswordValid, setIsNewPasswordValid] = useState(false);
  const [isConfirmNewPasswordValid, setIsConfirmNewPasswordValid] =
    useState(false);

  const handleSendConfirmEmail = async () => {
    try {
      await changePassword(newPassword);
      setIsDialogOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!isDialogOpen) {
      // 다이얼로그 닫힐 때 상태 초기화
      setIsEmailVerified(false);
      setNewPassword("");
      setIsNewPasswordValid(false);
      setIsConfirmNewPasswordValid(false);
      resetUserState();
    }
  }, [isDialogOpen, resetUserState]);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="flex w-[200] flex-col gap-8">
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
          <Button
            type="button"
            className="border-1 border-black dark:border-white"
            onClick={() => setIsDialogOpen(false)}
          >
            취소
          </Button>
          <Button
            type="button"
            className="bg-[#070f26] dark:border-1"
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

export { FindPasswordPopup };
