import { Dispatch, useEffect, useState } from "react";

import { Input } from "@/components/shadcn";
import { isPasswordMatching, isValidPassword } from "@/utils";

import PasswordInput from "../common/PasswordInput";
import EyeButton from "../common/EyeButton";

interface SignupPasswordSectionProps {
  password: string;
  isPasswordValid: boolean;
  isConfirmPasswordValid: boolean;
  setPassword: Dispatch<React.SetStateAction<string>>;
  setIsPasswordValid: Dispatch<React.SetStateAction<boolean>>;
  setIsConfirmPasswordValid: Dispatch<React.SetStateAction<boolean>>;
}

export default function SignupPasswordSection({
  password,
  isPasswordValid,
  isConfirmPasswordValid,
  setPassword,
  setIsPasswordValid,
  setIsConfirmPasswordValid,
}: SignupPasswordSectionProps) {
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
        password={password}
        showPassword={showPassword}
        isPasswordValid={isPasswordValid}
        showMessage={true}
        setPassword={setPassword}
        setShowPassword={setShowPassword}
      />
      <div className="relative">
        <Input
          type={showConfirmPassword ? "text" : "password"}
          name="confirmPassword"
          placeholder="비밀번호를 다시 입력해주세요."
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
      <div className="text-sm text-red-500">
        {!isConfirmPasswordValid && confirmPassword.trim() !== "" && (
          <>비밀번호가 일치하지 않습니다.</>
        )}
      </div>
    </div>
  );
}
