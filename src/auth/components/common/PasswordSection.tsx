import { Dispatch, useEffect, useState } from "react";

import { isPasswordMatching, isValidPassword } from "@/utils";

import PasswordInput from "./PasswordInput";
import ConfirmPasswordInput from "./confirmPasswordInput";

interface PasswordSectionProps {
  passwordLabel?: string;
  confirmPasswordLabel?: string;
  password: string;
  isPasswordValid: boolean;
  isConfirmPasswordValid: boolean;
  setPassword: Dispatch<React.SetStateAction<string>>;
  setIsPasswordValid: Dispatch<React.SetStateAction<boolean>>;
  setIsConfirmPasswordValid: Dispatch<React.SetStateAction<boolean>>;
}

export default function PasswordSection({
  passwordLabel,
  confirmPasswordLabel,
  password,
  isPasswordValid,
  isConfirmPasswordValid,
  setPassword,
  setIsPasswordValid,
  setIsConfirmPasswordValid,
}: PasswordSectionProps) {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  useEffect(() => {
    setIsPasswordValid(isValidPassword(password));
  }, [password, setIsPasswordValid]);

  useEffect(() => {
    setIsConfirmPasswordValid(isPasswordMatching(password, confirmPassword));
  }, [password, confirmPassword, setIsConfirmPasswordValid]);

  return (
    <div className="flex flex-col gap-2">
      <PasswordInput
        passwordLabel={passwordLabel}
        password={password}
        showPassword={showPassword}
        isPasswordValid={isPasswordValid}
        showMessage={true}
        setPassword={setPassword}
        setShowPassword={setShowPassword}
      />
      <ConfirmPasswordInput
        confirmPasswordLabel={confirmPasswordLabel}
        showConfirmPassword={showConfirmPassword}
        confirmPassword={confirmPassword}
        setConfirmPassword={setConfirmPassword}
        setShowConfirmPassword={setShowConfirmPassword}
      />
      <div className="text-sm text-red-500">
        {!isConfirmPasswordValid && confirmPassword.trim() !== "" && (
          <>비밀번호가 일치하지 않습니다.</>
        )}
      </div>
    </div>
  );
}
