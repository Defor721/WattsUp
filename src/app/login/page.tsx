import GoogleLoginButton from "@/auth/components/GoogleLoginButton";

export default function Page() {
  return (
    <div>
      {/* 간편 로그인 헤더 */}
      <div>간편 로그인</div>
      {/* 간편 로그인 버튼 */}
      <GoogleLoginButton />
    </div>
  );
}
