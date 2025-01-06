"use client";

import React, { useEffect, useState } from "react";
import { Settings } from "lucide-react";

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
import PasswordSection from "@/auth/components/common/PasswordSection";
import PasswordInput from "@/auth/components/common/PasswordInput";
import { useUserStore } from "@/stores/useUserStore";

function Modal() {
  const {
    message,
    actions: { changePassword, resetUserState },
  } = useUserStore();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [isCurrentPasswordValid, setIsCurrentPasswordValid] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [isNewPasswordValid, setIsNewPasswordValid] = useState(false);
  const [isConfirmNewPasswordValid, setIsConfirmNewPasswordValid] =
    useState(false);

  const handleChangePassword = async () => {
    try {
      await changePassword({ currentPassword, newPassword });
      setIsDialogOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!isDialogOpen) {
      setNewPassword("");
      setCurrentPassword("");
      setIsNewPasswordValid(false);
      setIsConfirmNewPasswordValid(false);
      resetUserState();
    }
  }, [isDialogOpen, resetUserState]);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="bg-subColor text-white dark:bg-white dark:text-subColor"
        >
          <Settings className="mr-2 h-4 w-4" />
          비밀번호 변경
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[450px] gap-8 bg-white dark:bg-subColor">
        <DialogHeader className="gap-3">
          <DialogTitle>비밀번호 수정</DialogTitle>
          <DialogDescription>
            비밀번호 변경을 위해 현재 비밀번호와 새 비밀번호를 입력해 주세요.
          </DialogDescription>
        </DialogHeader>
        {/* 현재 비밀번호 */}
        <div className="flex flex-col gap-2">
          <PasswordInput
            passwordLabel="현재 비밀번호"
            password={currentPassword}
            showPassword={showCurrentPassword}
            isPasswordValid={isCurrentPasswordValid}
            showMessage={true}
            setPassword={setCurrentPassword}
            setShowPassword={setShowCurrentPassword}
            setIsPasswordValid={setIsCurrentPasswordValid}
          />
        </div>
        {/* 새 비밀번호 */}
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
          <DialogClose asChild>
            <Button variant="ghost" className="border-1">
              닫기
            </Button>
          </DialogClose>
          <Button
            onClick={handleChangePassword}
            className="bg-subColor text-white dark:bg-white dark:text-subColor"
            disabled={
              !isCurrentPasswordValid ||
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

export default Modal;
