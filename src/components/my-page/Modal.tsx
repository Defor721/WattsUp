"use client";

import React, { useEffect, useState } from "react";
import { Settings } from "lucide-react";

import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
} from "@/components/shadcn";

function Modal() {
  const [open, setOpen] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [currentErrorMessage, setCurrentErrorMessage] = useState("");
  const [currentError, setCurrentError] = useState(false);

  const [isVerified, setIsVerified] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [newErrorMessage, setNewErrorMessage] = useState("");
  const [newError, setNewError] = useState(false);

  useEffect(() => {
    setCurrentError(false);
  }, [currentPassword]);

  useEffect(() => {
    setNewError(false);
  }, [newPassword, confirmNewPassword]);

  // 비밀번호 확인
  const handleVerifyPassword = async () => {
    console.log("비밀번호 확인");
    setIsVerified(true);

    // api 연결
    // try {
    //   const response = await fetch("/api/verify-password", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({ password: currentPassword }),
    //   });
    //   const result = await response.json();

    //   if (result.success) {
    //     setIsVerified(true);
    //     setCurrentError(false);
    //     setCurrentErrorMessage("");
    //   } else {
    //     setCurrentError(true);
    //     setCurrentErrorMessage("현재 비밀번호가 일치하지 않습니다.");
    //   }
    // } catch (error) {
    //   setCurrentError(true);
    //   setCurrentErrorMessage("비밀번호 확인 중 오류가 발생했습니다.");
    //   console.log("비밀번호 확인 에러: ", error);
    // }
  };

  // 비밀번호 변경
  const handleChangePassword = async () => {
    if (newPassword !== confirmNewPassword) {
      setNewError(true);
      setNewErrorMessage("새 비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    console.log("비밀번호 변경 로직 실행");
    // api 연결결
    // try {
    //   const response = await fetch("/api/change-password", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({ newPassword }),
    //   });
    //   const result = await response.json();

    //   if (result.success) {
    //     setNewError(false);
    //     alert("비밀번호가 성공적으로 변경되었습니다.");
    //   } else {
    //     setNewError(true);
    //     setNewErrorMessage("비밀번호 변경에 실패했습니다.");
    //   }
    // } catch (error) {
    //   setNewError(true);
    //   setNewErrorMessage("비밀번호 변경 중 오류가 발생했습니다.");
    //   console.log("비밀번호 변경 에러: ", error);
    // }
  };

  const handleResetState = () => {
    setCurrentPassword("");
    setCurrentError(false);
    setCurrentErrorMessage("");
    setIsVerified(false);
    setNewPassword("");
    setConfirmNewPassword("");
    setNewError(false);
    setNewErrorMessage("");
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) handleResetState();
        setOpen(isOpen);
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full border-[rgb(40,70,150)] hover:bg-slate-100 sm:w-auto"
        >
          <Settings className="mr-2 h-4 w-4" />
          비밀번호 수정
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[450px] gap-6 bg-white dark:bg-subColor">
        <DialogHeader className="gap-3">
          <DialogTitle>비밀번호 수정</DialogTitle>
          <DialogDescription>
            비밀번호를 변경하려면 아래 정보를 입력하세요.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-5">
          {!isVerified ? (
            <>
              <div className="flex flex-col gap-2">
                <Input
                  type="password"
                  placeholder="현재 비밀번호"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
                <div className="text-sm font-medium leading-none text-rose-500">
                  {currentError ? currentErrorMessage : null}
                </div>
              </div>
              <div className="flex justify-end">
                <Button
                  onClick={handleVerifyPassword}
                  className="bg-mainColor text-white dark:border-1"
                >
                  확인
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col gap-3">
                <Input
                  type="password"
                  placeholder="새 비밀번호"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <Input
                  type="password"
                  placeholder="새 비밀번호 확인"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                />
                <div className="text-sm font-medium leading-none text-rose-500">
                  {newError ? newErrorMessage : null}
                </div>
              </div>
              <div className="flex items-center justify-end gap-3">
                <DialogClose asChild>
                  <Button variant="ghost" className="">
                    닫기
                  </Button>
                </DialogClose>

                <Button
                  onClick={handleChangePassword}
                  className="bg-mainColor text-white dark:border-1"
                >
                  변경
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default Modal;
