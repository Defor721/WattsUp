interface VerificationMessageProps {
  isError: boolean;
  isEmailVerified: boolean;
  emailCode: string;
  isEmailCodeSended: () => boolean;
  isEmailCodeEntered: () => boolean;
}

export default function VerificationMessage({
  isError,
  isEmailVerified,
  emailCode,
  isEmailCodeSended,
  isEmailCodeEntered,
}: VerificationMessageProps) {
  if (isError) {
    return (
      <div className="text-red-600">
        실패하였습니다. 아래의 실패 사유를 참고해주세요.
      </div>
    );
  }

  if (!isEmailVerified && emailCode && !isError) {
    return (
      <div>
        6자리를 모두 입력 후{" "}
        <span className="font-semibold text-blue-600">이메일 인증</span> 버튼을
        눌러주세요.
      </div>
    );
  }

  if (isEmailVerified && !isError) {
    return <div className="text-green-500">이메일 인증을 완료했습니다.</div>;
  }

  if (isEmailCodeSended()) {
    return (
      <>
        인증코드가 전송되었습니다.{" "}
        <span className="font-semibold text-blue-600">메일함</span>을
        확인해주세요.
      </>
    );
  }

  if (isEmailCodeEntered()) {
    return (
      <>
        이메일을 입력하고{" "}
        <span className="font-semibold text-blue-600">전송</span> 버튼을
        눌러주세요.
      </>
    );
  }

  return null;
}
