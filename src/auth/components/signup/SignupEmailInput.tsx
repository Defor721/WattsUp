"use client";

import { Dispatch, useEffect, useState } from "react";

import {
  sendVerificationEmail,
  verifyEmailCode,
} from "@/services/emailService";
import { toast } from "@/hooks/useToast";
import { isValidEmail } from "@/utils";

import VerificationMessage from "./VerificationMessage";
import EmailVerificationButton from "./EmailVerificationButton";
import OTPInput from "../common/OTPInput";
import EmailInput from "../common/EmailInput";

interface SignupEmailInputProps {
  isEmailVerified: boolean;
  setIsEmailVerified: Dispatch<React.SetStateAction<boolean>>;
}

export default function LoginEmailInput({
  isEmailVerified,
  setIsEmailVerified,
}: SignupEmailInputProps) {
  const [email, setEmail] = useState("");
  const [emailCode, setEmailCode] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [isEmailCodeLoading, setIsEmailCodeLoading] = useState(false);
  const [isEmailVerificationLoading, setIsEmailValificationLoading] =
    useState(false);
  const [isError, setIsError] = useState(false);

  const isSendButtonDisabled = () =>
    isEmailVerificationLoading ||
    cooldown > 0 ||
    isEmailCodeLoading ||
    !isEmailValid ||
    isEmailVerified;
  const isVerifyButtonDisabled = () =>
    isEmailVerificationLoading || emailCode.length !== 6 || !isEmailValid;
  const isEmailCodeSended = () =>
    !isEmailVerified && cooldown > 0 && !emailCode;
  const isEmailCodeEntered = () =>
    !isEmailVerified && cooldown <= 0 && !emailCode;

  const handleSendEmailCode = async () => {
    if (isSendButtonDisabled()) return;
    try {
      setCooldown(60);
      setIsEmailCodeLoading(true);
      setIsError(false);
      toast({
        title: "기입된 이메일로 인증코드를 보냈습니다.",
        description: "1분 내에 인증코드를 입력해주세요.",
      });
      await sendVerificationEmail({ email });
    } catch (error: any) {
      setIsError(true);
      toast({
        variant: "destructive",
        title: "인증 코드 전송에 실패했습니다.",
        description: `${error.response.data.message}`,
      });
    } finally {
      setIsEmailCodeLoading(false);
    }
  };

  // TODO: 에러 메시지 표시
  const handleVerifyEmail = async () => {
    if (isVerifyButtonDisabled()) return;
    try {
      setIsEmailValificationLoading(true);
      await verifyEmailCode({ email, emailCode });
      setIsError(false);
      setCooldown(0);
      setIsEmailVerified(true);
    } catch (error: any) {
      setIsError(true);
      setIsEmailVerified(false);
      toast({
        variant: "destructive",
        title: "이메일 확인에 실패했습니다.",
        description: `${error.response.data.message}`,
      });
    } finally {
      setIsEmailValificationLoading(false);
    }
  };

  const resetEmailInfo = () => {
    setEmailCode("");
    setIsEmailVerified(false);
  };

  const handleCooldownTimer = () => {
    if (cooldown > 0) {
      const timer = setInterval(() => {
        setCooldown((prev) => Math.max(prev - 1, 0));
      }, 1000);
      return () => clearInterval(timer);
    }
  };

  const validateEmail = () => {
    if (email.trim() === "") {
      setIsEmailValid(false);
    } else {
      setIsEmailValid(isValidEmail(email));
    }
  };

  useEffect(handleCooldownTimer, [cooldown]);
  useEffect(validateEmail, [email]);

  return (
    <div className="flex flex-col gap-2">
      {/* 이메일 입력 */}
      <EmailInput
        email={email}
        isEmailVerified={isEmailVerified}
        isEmailValid={isEmailValid}
        setEmail={setEmail}
      />
      {/* 이메일 인증코드 입력 */}
      <div className="flex flex-col gap-2">
        <OTPInput
          emailCode={emailCode}
          isEmailVerified={isEmailVerified}
          cooldown={cooldown}
          setEmailCode={setEmailCode}
          isSendButtonDisabled={isSendButtonDisabled()}
          handleSendEmailCode={handleSendEmailCode}
        />
        {/* 인증코드 안내 메시지 */}
        <div className="text-sm text-gray-500">
          <VerificationMessage
            isError={isError}
            isEmailVerified={isEmailVerified}
            emailCode={emailCode}
            isEmailCodeSended={isEmailCodeSended}
            isEmailCodeEntered={isEmailCodeEntered}
          />
        </div>
      </div>
      {/* 이메일 인증 버튼 */}
      <EmailVerificationButton
        isEmailVerified={isEmailVerified}
        isEmailVerificationLoading={isEmailVerificationLoading}
        isVerifyButtonDisabled={isVerifyButtonDisabled()}
        resetEmailInfo={resetEmailInfo}
        handleVerifyEmail={handleVerifyEmail}
      />
    </div>
  );
}
