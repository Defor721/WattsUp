import { Dispatch } from "react";

import { Input, Label } from "@/components/shadcn";

import EyeButton from "./EyeButton";

interface ConfirmPasswordInputProps {
  confirmPasswordLabel?: string;
  confirmPassword: string;
  showConfirmPassword: boolean;
  setConfirmPassword: Dispatch<React.SetStateAction<string>>;
  setShowConfirmPassword: Dispatch<React.SetStateAction<boolean>>;
}

export default function ConfirmPasswordInput({
  confirmPasswordLabel,
  confirmPassword,
  showConfirmPassword,
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
          type={showConfirmPassword ? "text" : "password"}
          id="confirmPassword"
          name="confirmPassword"
          placeholder="비밀번호 확인을 위해 다시 입력해주세요."
          maxLength={16}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <EyeButton
          show={showConfirmPassword}
          setShow={setShowConfirmPassword}
        />
      </div>
    </>
  );
}
