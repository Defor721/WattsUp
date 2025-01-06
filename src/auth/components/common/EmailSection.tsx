"use client";

import { Dispatch, useEffect, useState } from "react";

import {
  sendVerificationEmail,
  verifyEmailCode,
} from "@/services/emailService";
import { isValidEmail } from "@/utils";

import OTPInput from "./OTPInput";
import EmailInput from "./EmailInput";
import VerificationMessage from "../signup/VerificationMessage";
import EmailVerificationButton from "../signup/EmailVerificationButton";

interface SignupEmailInputProps {
  isEmailVerified: boolean;
  setIsEmailVerified: Dispatch<React.SetStateAction<boolean>>;
}

export default function EmailSection({
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
  const [errorMessage, setErrorMessage] = useState("");

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
      await sendVerificationEmail({ email });
    } catch (error: any) {
      setIsError(true);
      setErrorMessage(error.response.data.message);
    } finally {
      setIsEmailCodeLoading(false);
    }
  };

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
      setErrorMessage(error.response.data.message);
    } finally {
      setIsEmailValificationLoading(false);
    }
  };

  const validateEmail = () => {
    if (email.trim() === "") {
      setIsEmailValid(false);
    } else {
      setIsEmailValid(isValidEmail(email));
    }
  };

  useEffect(validateEmail, [email]);

  return (
    <div className="flex flex-col gap-2">
      {/* 이메일 입력 */}
      <EmailInput
        email={email}
        isEmailVerified={isEmailVerified}
        isEmailValid={isEmailValid}
        showMessage={true}
        setEmail={setEmail}
      />
      {/* 이메일 인증코드 입력 */}
      <div className="flex flex-col gap-2">
        <OTPInput
          emailCode={emailCode}
          isEmailVerified={isEmailVerified}
          cooldown={cooldown}
          setCooldown={setCooldown}
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
            errorMessage={errorMessage}
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
        setEmailCode={setEmailCode}
        setIsEmailVerified={setIsEmailVerified}
        handleVerifyEmail={handleVerifyEmail}
      />
    </div>
  );
}
