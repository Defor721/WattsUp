import { Dispatch, useEffect } from "react";

import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/shadcn";

interface OTPInputProps {
  children?: React.ReactNode;
  emailCode: string;
  isEmailVerified: boolean;
  cooldown: number;
  setCooldown: Dispatch<React.SetStateAction<number>>;
  setEmailCode: Dispatch<React.SetStateAction<string>>;
}

export default function OTPInput({
  children,
  emailCode,
  isEmailVerified,
  cooldown,
  setCooldown,
  setEmailCode,
}: OTPInputProps) {
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setInterval(() => {
        setCooldown((prev) => Math.max(prev - 1, 0));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [cooldown, setCooldown]);

  return (
    <div className="flex h-[44px] items-center justify-between gap-4">
      {/* OTP 입력 필드 */}
      <InputOTP
        maxLength={6}
        value={emailCode}
        onChange={(value) => setEmailCode(value.replace(/[^0-9]/g, ""))}
        disabled={isEmailVerified}
      >
        <InputOTPGroup>
          {[...Array(6)].map((_, index) => (
            <InputOTPSlot
              key={index}
              index={index}
              className="text-l text-center"
            />
          ))}
        </InputOTPGroup>
      </InputOTP>
      {/* 버튼 */}
      {children}
    </div>
  );
}
