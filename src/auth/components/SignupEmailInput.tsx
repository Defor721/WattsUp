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
import { isValidEmail } from "@/utils";

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
  const [isEmailValidState, setIsEmailValidState] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [isEmailCodeLoading, setIsEmailCodeLoading] = useState(false);
  const [isEmailVerificationLoading, setIsEmailValificationLoading] =
    useState(false);

  const isSendButtonDisabled =
    isEmailVerificationLoading ||
    cooldown > 0 ||
    isEmailCodeLoading ||
    !isEmailValidState ||
    isEmailVerified;

  const isVerifyButtonDisabled =
    isEmailVerificationLoading || emailCode.length !== 6 || !isEmailValidState;

  const isEmailCodeSended = !isEmailVerified && cooldown > 0 && !emailCode;

  const isEmailCodeEntered = !isEmailVerified && cooldown <= 0 && !emailCode;

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
      await verifyEmailCode({ email, emailCode });
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
    setIsEmailValidState(isValidEmail(email));
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
      {/* 이메일 입력 안내 */}
      <div className="text-sm text-gray-500">
        {!isEmailValidState && email.trim() !== "" && (
          <div className="text-red-600">
            올바른 형식의 이메일을 입력해주세요.
          </div>
        )}
        {isEmailValidState && (
          <div className="text-green-500">올바른 형식의 이메일입니다.</div>
        )}
      </div>
      {/* 이메일 인증코드 섹션 */}
      <div className="flex flex-col gap-2">
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
            className={`w-[62px] rounded bg-blue-600 p-2 text-white hover:bg-blue-700 disabled:bg-gray-400`}
            type="button"
            onClick={handleSendEmailCode}
            disabled={isSendButtonDisabled}
          >
            {cooldown > 0 ? `${cooldown}초` : "전송"}
          </Button>
        </div>
        {/* 인증코드 안내 메시지 */}
        <div className="text-sm text-gray-500">
          {emailCode && !isEmailVerified && (
            <div>
              6자리를 모두 입력 후{" "}
              <span className="font-semibold text-blue-600">이메일 확인</span>{" "}
              버튼을 눌러주세요.
            </div>
          )}
          {isEmailVerified && (
            <div className="text-green-500">이메일 인증을 완료했습니다.</div>
          )}
          {isEmailCodeSended && (
            <>
              인증코드가 전송되었습니다.{" "}
              <span className="font-semibold text-blue-600">메일함</span>을
              확인해주세요.
            </>
          )}
          {isEmailCodeEntered && (
            <>
              이메일을 입력하고{" "}
              <span className="font-semibold text-blue-600">전송</span> 버튼을
              눌러주세요.
            </>
          )}
        </div>
      </div>
      {/* 이메일 인증 섹션 */}
      {isEmailVerified ? (
        <Button
          className="rounded bg-gray-600 p-2 text-white"
          type="button"
          onClick={resetEmailInfo}
        >
          이메일 변경
        </Button>
      ) : (
        <Button
          className={`rounded bg-mainColor p-2 text-white disabled:border-none disabled:bg-gray-400 dark:border-1`}
          type="button"
          onClick={handleValidEmail}
          disabled={isVerifyButtonDisabled}
        >
          {isEmailVerificationLoading ? "확인 중..." : "이메일 확인"}
        </Button>
      )}
    </div>
  );
}
