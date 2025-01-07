import { Dispatch, SetStateAction, useEffect } from "react";

import { Input, Label } from "@/components/shadcn";
import { isValidPassword } from "@/utils";

import EyeButton from "./EyeButton";
import XCircleButton from "./XCircleButton";

interface PasswordInputProps {
  passwordLabel?: string;
  password: string;
  showPassword: boolean;
  showMessage?: boolean;
  isPasswordValid?: boolean;
  setPassword: Dispatch<SetStateAction<string>>;
  setShowPassword: Dispatch<SetStateAction<boolean>>;
  setIsPasswordValid: Dispatch<SetStateAction<boolean>>;
}

export default function PasswordInput({
  passwordLabel = "비밀번호",
  password,
  showPassword = false,
  showMessage,
  isPasswordValid = true,
  setPassword,
  setShowPassword,
  setIsPasswordValid,
}: PasswordInputProps) {
  useEffect(() => {
    setIsPasswordValid(isValidPassword(password));
  }, [password, setIsPasswordValid]);

  return (
    <>
      <Label htmlFor="password">{passwordLabel}</Label>
      <div className="relative">
        <Input
          className={`h-[44px] pr-20 dark:ring-offset-0 ${!isPasswordValid && password.trim() !== "" ? "border-red-600 focus:ring-transparent" : "focus:border-blue-500 focus:ring-transparent"}`}
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
        <EyeButton
          show={showPassword}
          setShow={setShowPassword}
          right={password ? 40 : 4}
        />
        {password && <XCircleButton reset={setPassword} right={1} />}
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
