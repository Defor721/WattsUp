import { Dispatch, useEffect } from "react";

import {
  Button,
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/shadcn";

interface OTPInputProps {
  emailCode: string;
  isEmailVerified: boolean;
  cooldown: number;
  isSendButtonDisabled: boolean;
  setCooldown: Dispatch<React.SetStateAction<number>>;
  setEmailCode: Dispatch<React.SetStateAction<string>>;
  handleSendEmailCode: () => void;
}

export default function OTPInput({
  emailCode,
  isEmailVerified,
  cooldown,
  isSendButtonDisabled,
  setCooldown,
  setEmailCode,
  handleSendEmailCode,
}: OTPInputProps) {
  const handleCooldownTimer = () => {
    if (cooldown > 0) {
      const timer = setInterval(() => {
        setCooldown((prev) => Math.max(prev - 1, 0));
      }, 1000);
      return () => clearInterval(timer);
    }
  };

  useEffect(handleCooldownTimer, [cooldown]);

  return (
    <div className="flex gap-2">
      <InputOTP
        maxLength={6}
        value={emailCode}
        onChange={(value) => setEmailCode(value.replace(/[^0-9]/g, ""))}
        disabled={isEmailVerified}
      >
        <InputOTPGroup>
          {[...Array(6)].map((_, index) => (
            <InputOTPSlot key={index} index={index} />
          ))}
        </InputOTPGroup>
      </InputOTP>
      <Button
        className={`w-[108px] rounded bg-blue-600 p-2 text-white hover:bg-blue-700 disabled:bg-gray-400`}
        type="button"
        onClick={handleSendEmailCode}
        disabled={isSendButtonDisabled}
      >
        {cooldown > 0 ? `${cooldown}초 뒤 활성화` : "인증코드 전송"}
      </Button>
    </div>
  );
}
