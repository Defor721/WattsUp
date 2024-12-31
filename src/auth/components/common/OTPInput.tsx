import { Dispatch } from "react";

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
  setEmailCode: Dispatch<React.SetStateAction<string>>;
  handleSendEmailCode: () => void;
}

export default function OTPInput({
  emailCode,
  isEmailVerified,
  cooldown,
  isSendButtonDisabled,
  setEmailCode,
  handleSendEmailCode,
}: OTPInputProps) {
  return (
    <div className="flex gap-2">
      <InputOTP
        maxLength={6}
        value={emailCode}
        onChange={(value) => setEmailCode(value)}
        disabled={isEmailVerified}
      >
        <InputOTPGroup>
          {[...Array(6)].map((_, index) => (
            <InputOTPSlot key={index} index={index} />
          ))}
        </InputOTPGroup>
      </InputOTP>
      <Button
        className={`w-[62px] rounded bg-blue-600 p-2 text-white hover:bg-blue-700 disabled:bg-gray-400`}
        type="button"
        onClick={handleSendEmailCode}
        disabled={isSendButtonDisabled}
      >
        {cooldown > 0 ? `${cooldown}초` : "전송"}
      </Button>
    </div>
  );
}
