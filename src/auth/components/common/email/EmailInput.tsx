import React, { Dispatch } from "react";

import { Input, Label } from "@/components/shadcn";

import XCircleButton from "../ui/XCircleButton";

interface EmailInputProps {
  children?: React.ReactNode;
  email: string;
  isEmailValid?: boolean;
  isEmailVerified?: boolean;
  showMessage?: boolean;
  loading?: boolean;
  setEmail: Dispatch<React.SetStateAction<string>>;
}

export default function EmailInput({
  children,
  email,
  isEmailValid = true,
  isEmailVerified = false,
  showMessage = false,
  loading = false,
  setEmail,
}: EmailInputProps) {
  const shouldShowXCircleButton =
    email.trim() !== "" && !isEmailVerified && !loading;

  return (
    <div className="w-full space-y-2">
      {/* 이메일 라벨 */}
      <Label htmlFor="email">이메일</Label>
      {/* 입력 필드와 버튼 */}
      <div className="flex items-center justify-between gap-2">
        {/* 입력 필드 */}
        <div className="relative flex-grow">
          <Input
            id="email"
            type="email"
            placeholder="이메일을 입력해주세요."
            maxLength={320}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isEmailVerified || loading}
            autoComplete="email"
            required
            className={`h-[44px] flex-grow rounded border pr-10 dark:ring-offset-0 ${
              isEmailValid === false && email.trim() !== ""
                ? "focus:border-red-600 focus:ring-transparent"
                : "focus:border-blue-500 focus:ring-transparent"
            }`}
          />
          {shouldShowXCircleButton && (
            <XCircleButton reset={setEmail} right={1} />
          )}
        </div>
        {/* 버튼 */}
        {children}
      </div>
      {/* 이메일 입력 안내 메시지 */}
      {showMessage && (
        <div className="mt-1 text-sm text-gray-500">
          {!isEmailValid && email.trim() !== "" && (
            <div className="text-red-600">
              올바른 형식의 이메일을 입력해주세요.
            </div>
          )}
          {isEmailValid && (
            <div className="text-green-500">올바른 형식의 이메일입니다.</div>
          )}
        </div>
      )}
    </div>
  );
}
