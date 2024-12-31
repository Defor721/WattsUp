import { Button } from "@/components/shadcn";

interface EmailVerificationButtonProps {
  isEmailVerified: boolean;
  isEmailVerificationLoading: boolean;
  isVerifyButtonDisabled: boolean;
  resetEmailInfo: () => void;
  handleVerifyEmail: () => void;
}

export default function EmailVerificationButton({
  isEmailVerified,
  isEmailVerificationLoading,
  isVerifyButtonDisabled,
  resetEmailInfo,
  handleVerifyEmail,
}: EmailVerificationButtonProps) {
  if (isEmailVerified) {
    return (
      <Button
        className="rounded bg-gray-600 p-2 text-white"
        type="button"
        onClick={resetEmailInfo}
      >
        이메일 재인증
      </Button>
    );
  }

  return (
    <Button
      className={`rounded bg-mainColor p-2 text-white disabled:border-none disabled:bg-gray-400 dark:border-1`}
      type="button"
      onClick={handleVerifyEmail}
      disabled={isVerifyButtonDisabled}
    >
      {isEmailVerificationLoading ? "확인 중..." : "이메일 인증"}
    </Button>
  );
}
