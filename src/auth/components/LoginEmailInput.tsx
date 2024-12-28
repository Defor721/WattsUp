"use client";

import { Dispatch, useEffect, useState } from "react";

import {
  Button,
  Input,
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  Label,
} from "@/components/shadcn";
import {
  sendVerificationEmail,
  verifyEmailCode,
} from "@/services/emailService";
import { toast } from "@/hooks/useToast";
import { isEmailValid } from "@/utils";

interface LoginEmailInputProps {
  isEmailVerified: boolean;
  setIsEmailVerified: Dispatch<React.SetStateAction<boolean>>;
}

export default function LoginEmailInput({
  isEmailVerified,
  setIsEmailVerified,
}: LoginEmailInputProps) {
  const [email, setEmail] = useState("");
  const [emailCode, setEmailCode] = useState("");
  const [isEmailValidState, setIsEmailValidState] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [isEmailCodeLoading, setIsEmailCodeLoading] = useState(false);
  const [isEmailVerificationLoading, setIsEmailValificationLoading] =
    useState(false);

  const isSendButtonDisabled =
    cooldown > 0 || isEmailCodeLoading || !isEmailValidState || isEmailVerified;

  const isVerifyButtonDisabled =
    isEmailVerificationLoading || emailCode.length !== 6 || !isEmailValidState;

  /** 이메일 인증 코드 전송 */
  const handleSendEmailCode = async () => {
    if (isSendButtonDisabled) return;
    try {
      setCooldown(60);
      setIsEmailCodeLoading(true);
      toast({
        title: "기입된 이메일로 인증코드를 보냈습니다.",
        description: "1분 내에 인증코드를 입력해주세요.",
      });
      await sendVerificationEmail({ email });
    } catch (error: any) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "인증 코드 전송에 실패했습니다.",
        description: "이메일 주소를 확인해주세요.",
      });
    } finally {
      setIsEmailCodeLoading(false);
    }
  };

  /** 이메일 인증 */
  const handleValidEmail = async () => {
    if (isVerifyButtonDisabled) return;
    try {
      setIsEmailValificationLoading(true);
      // await verifyEmailCode({ email, emailCode });
      setCooldown(0);
      setIsEmailVerified(true);
    } catch (error: any) {
      console.log(error);
      setIsEmailVerified(false);
    } finally {
      setIsEmailValificationLoading(false);
    }
  };

  const resetEmailInfo = () => {
    setEmail("");
    setEmailCode("");
    setIsEmailVerified(false);
  };

  useEffect(() => {
    if (cooldown === 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  useEffect(() => {
    if (email.trim() === "") {
      setIsEmailValidState(false);
      return;
    }
    setIsEmailValidState(isEmailValid(email));
  }, [email]);

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="email">이메일</Label>
      <Input
        id="email"
        type="email"
        placeholder="이메일을 입력해주세요."
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={isEmailVerified}
        required
      />
      <div className="text-sm text-gray-500">
        {!isEmailValidState && email.trim() !== "" && (
          <>올바른 이메일 형식을 입력해주세요.</>
        )}
      </div>
      <div className="flex flex-col items-center gap-2">
        <div className="flex gap-2">
          <InputOTP
            maxLength={6}
            value={emailCode}
            onChange={(value) => setEmailCode(value)}
            disabled={isEmailVerified}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
          <Button
            className={`w-[62px] rounded p-2 text-white ${
              isSendButtonDisabled
                ? "bg-gray-400"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
            type="button"
            onClick={handleSendEmailCode}
            disabled={isSendButtonDisabled}
          >
            {cooldown > 0 ? `${cooldown}초` : "전송"}
          </Button>
        </div>
        <div className="text-sm text-gray-500">
          {cooldown > 0 ? (
            <>인증코드가 전송되었습니다. 메일함을 확인해주세요.</>
          ) : (
            <>이메일 주소를 입력하고 전송 버튼을 눌러주세요.</>
          )}
        </div>
      </div>
      {/* 이메일 인증 섹션 */}
      {isEmailVerified ? (
        <Button
          className={`rounded p-2 text-white ${
            isEmailVerificationLoading
              ? "bg-gray-400"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
          type="button"
          onClick={resetEmailInfo}
        >
          이메일 수정
        </Button>
      ) : (
        <Button
          className={`rounded p-2 text-white ${
            isEmailVerificationLoading ||
            emailCode.length !== 6 ||
            !isEmailValidState
              ? "bg-gray-400"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
          type="button"
          onClick={handleValidEmail}
          disabled={
            isEmailVerificationLoading ||
            emailCode.length !== 6 ||
            !isEmailValidState
          }
        >
          {isEmailVerificationLoading ? "확인 중..." : "이메일 확인"}
        </Button>
      )}
    </div>
  );
}
