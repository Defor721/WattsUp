import { Dispatch } from "react";

import { Input, Label } from "@/components/shadcn";

import EyeButton from "./EyeButton";

interface PasswordInputProps {
  passwordLabel?: string;
  password: string;
  showPassword: boolean;
  showMessage?: boolean;
  isPasswordValid?: boolean;
  setPassword: Dispatch<React.SetStateAction<string>>;
  setShowPassword: Dispatch<React.SetStateAction<boolean>>;
}

export default function PasswordInput({
  passwordLabel,
  password,
  showPassword,
  showMessage,
  isPasswordValid,
  setPassword,
  setShowPassword,
}: PasswordInputProps) {
  return (
    <>
      <Label htmlFor="password">{passwordLabel || "비밀번호"}</Label>
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          id="password"
          name="password"
          placeholder="비밀번호를 입력해주세요."
          maxLength={16}
          value={password}
          onChange={(e) => setPassword(e.target.value.replace(/\s/g, ""))}
          autoComplete="current-password"
          required
        />
        <EyeButton show={showPassword} setShow={setShowPassword} />
      </div>
      {showMessage && (
        <div className="text-sm text-red-500">
          {!isPasswordValid && password.trim() !== "" && (
            <>알파벳 대/소문자, 숫자, 특수문자 포함한 8~16자 조합</>
          )}
        </div>
      )}
    </>
  );
}
