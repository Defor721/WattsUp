import { Dispatch, useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import { Button, Input, Label } from "@/components/shadcn";
import { isPasswordsMatching, isPasswordValid } from "@/utils";

interface SignupPasswordInputProps {
  password: string;
  setPassword: Dispatch<React.SetStateAction<string>>;
}

export default function SignupPasswordInput({
  password,
  setPassword,
}: SignupPasswordInputProps) {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isPasswordValidState, setIsPasswordValidState] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [isConfirmPasswordValidState, setIsConfirmPasswordValidState] =
    useState(false);

  useEffect(() => {
    setIsPasswordValidState(isPasswordValid(password));
  }, [password]);

  useEffect(() => {
    setIsConfirmPasswordValidState(
      isPasswordsMatching(password, confirmPassword),
    );
  }, [password, confirmPassword]);

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="password">비밀번호</Label>
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          id="password"
          name="password"
          placeholder="8~16자의 비밀번호를 입력해주세요."
          maxLength={16}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button
          type="button"
          size={"icon"}
          className="absolute right-1 top-[9px] z-10 -translate-y-1/4 bg-transparent hover:bg-transparent"
          onClick={() => setShowPassword((prevState) => !prevState)}
        >
          {showPassword ? (
            <Eye className="text-muted-foreground h-5 w-5 opacity-70" />
          ) : (
            <EyeOff className="text-muted-foreground h-5 w-5 opacity-70" />
          )}
        </Button>
      </div>
      <div className="text-sm text-red-500">
        {!isPasswordValidState && password.trim() !== "" && (
          <>공백을 제외한 알파벳 대/소문자, 숫자, 특수문자의 조합</>
        )}
      </div>
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
        <Button
          type="button"
          className="absolute right-1 top-[9px] z-10 -translate-y-1/4 bg-transparent hover:bg-transparent"
          size={"icon"}
          onClick={() => setShowConfirmPassword((prevState) => !prevState)}
        >
          {showConfirmPassword ? (
            <Eye className="text-muted-foreground h-5 w-5 opacity-70" />
          ) : (
            <EyeOff className="text-muted-foreground h-5 w-5 opacity-70" />
          )}
        </Button>
      </div>
      <div className="text-sm text-red-500">
        {!isConfirmPasswordValidState && confirmPassword.trim() !== "" && (
          <>비밀번호가 일치하지 않습니다.</>
        )}
      </div>
    </div>
  );
}
