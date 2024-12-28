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
import { isEmailValid } from "@/utils/validation";

interface LoginEmailInputProps {
  email: string;
  setEmail: Dispatch<React.SetStateAction<string>>;
}

export default function LoginEmailInput({
  email,
  setEmail,
}: LoginEmailInputProps) {
  const [emailCode, setEmailCode] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [isEmailCodeLoading, setIsEmailCodeLoading] = useState(false);

  const [isEmailValifiedLoading, setIsEmailValifiedLoading] = useState(false);
  const [isEmailValified, setIsEmailValified] = useState(false);

  /** 이메일 인증 코드 전송 */
  const handleSendEmailCode = async () => {
    if (cooldown > 0 || !isEmailValid(email)) return;
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
  const handelValidEmail = async () => {
    try {
      setIsEmailValifiedLoading(true);
      await verifyEmailCode({ email, emailCode });
      setCooldown(0);
      setIsEmailValified(true);
    } catch (error: any) {
      console.log(error);
      setIsEmailValified(false);
    } finally {
      setIsEmailValifiedLoading(false);
    }
  };

  const resetEmailInfo = () => {
    setEmail("");
    setEmailCode("");
    setIsEmailValified(false);
  };

  useEffect(() => {
    if (cooldown === 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  return (
    <div className="flex flex-col gap-2">
      {/* TODO: 이메일 입력하면서 중복인지 아닌지 체크 구현할것 */}
      <Label htmlFor="email">이메일</Label>
      <Input
        id="email"
        type="email"
        placeholder="이메일을 입력해주세요."
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={isEmailValified}
        required
      />
      {/* 이메일 인증 코드 섹션 */}
      <div className="flex flex-col items-center gap-2">
        <div className="flex gap-2">
          <InputOTP
            maxLength={6}
            value={emailCode}
            onChange={(value) => setEmailCode(value)}
            disabled={isEmailValified}
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
              cooldown > 0 ||
              isEmailCodeLoading ||
              !isEmailValid(email) ||
              isEmailValified
                ? "bg-gray-400"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
            type="button"
            onClick={handleSendEmailCode}
            disabled={
              cooldown > 0 ||
              isEmailCodeLoading ||
              !isEmailValid(email) ||
              isEmailValified
            }
          >
            {cooldown > 0 ? `${cooldown}초` : "전송"}
          </Button>
        </div>
        <div className="text-center text-sm">
          {emailCode === "" ? (
            <>전송 버튼을 눌러 이메일로 전송된 코드를 입력해주세요.</>
          ) : (
            <>입력 코드: {emailCode}</>
          )}
        </div>
      </div>
      {/* 이메일 인증 섹션 */}
      {isEmailValified ? (
        <Button
          className={`rounded p-2 text-white ${
            isEmailValifiedLoading ||
            emailCode.length !== 6 ||
            !isEmailValid(email)
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
            isEmailValifiedLoading ||
            emailCode.length !== 6 ||
            !isEmailValid(email)
              ? "bg-gray-400"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
          type="button"
          onClick={handelValidEmail}
          disabled={
            isEmailValifiedLoading ||
            emailCode.length !== 6 ||
            !isEmailValid(email)
          }
        >
          {isEmailValifiedLoading ? "확인 중..." : "이메일 확인"}
        </Button>
      )}
    </div>
  );
}
