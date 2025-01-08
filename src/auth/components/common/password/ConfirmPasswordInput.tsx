import { Dispatch } from "react";

import { Input, Label } from "@/components/shadcn";

import EyeButton from "../ui/EyeButton";
import XCircleButton from "../ui/XCircleButton";

interface ConfirmPasswordInputProps {
  confirmPasswordLabel?: string;
  confirmPassword: string;
  showConfirmPassword: boolean;
  isConfirmPasswordValid: boolean;
  setConfirmPassword: Dispatch<React.SetStateAction<string>>;
  setShowConfirmPassword: Dispatch<React.SetStateAction<boolean>>;
}

export default function ConfirmPasswordInput({
  confirmPasswordLabel,
  confirmPassword,
  showConfirmPassword,
  isConfirmPasswordValid,
  setConfirmPassword,
  setShowConfirmPassword,
}: ConfirmPasswordInputProps) {
  return (
    <>
      <Label htmlFor="confirmPassword">
        {confirmPasswordLabel || "비밀번호 확인"}
      </Label>
      <div className="relative">
        <Input
          className={`h-[44px] pr-20 dark:ring-offset-0 ${!isConfirmPasswordValid && confirmPassword.trim() !== "" ? "border-red-600 focus:ring-transparent" : "focus:border-blue-500 focus:ring-transparent"}`}
          type={showConfirmPassword ? "text" : "password"}
          id="confirmPassword"
          name="confirmPassword"
          placeholder="비밀번호 확인을 위해 다시 입력해주세요."
          maxLength={16}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        {confirmPassword && (
          <XCircleButton reset={setConfirmPassword} right={1} />
        )}
        <EyeButton
          show={showConfirmPassword}
          setShow={setShowConfirmPassword}
          right={confirmPassword ? 40 : 1}
        />
      </div>
      {!isConfirmPasswordValid && confirmPassword.trim() !== "" && (
        <div className="text-sm text-red-500">
          비밀번호가 일치하지 않습니다.
        </div>
      )}
    </>
  );
}
