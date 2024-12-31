import { Dispatch } from "react";

import { Input, Label } from "@/components/shadcn";

interface EmailInputProps {
  email: string;
  isEmailValid: boolean;
  isEmailVerified?: boolean;
  setEmail: Dispatch<React.SetStateAction<string>>;
}

export default function EmailInput({
  email,
  isEmailValid,
  isEmailVerified,
  setEmail,
}: EmailInputProps) {
  return (
    <>
      <Label htmlFor="email">이메일</Label>
      <Input
        id="email"
        type="email"
        placeholder="이메일을 입력해주세요."
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={isEmailVerified}
        required
      />
      {/* 이메일 입력 안내 */}
      <div className="text-sm text-gray-500">
        {!isEmailValid && email.trim() !== "" && (
          <div className="text-red-600">
            올바른 형식의 이메일을 입력해주세요.
          </div>
        )}
        {isEmailValid && (
          <div className="text-green-500">올바른 형식의 이메일입니다.</div>
        )}
      </div>
    </>
  );
}
