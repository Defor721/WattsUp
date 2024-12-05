"use client";

import LoginButton from "@/auth/components/LoginButton";
import GoogleLoginButton from "@/auth/components/GoogleLoginButton";

export default function LoginPage() {
  return (
    <div>
      {/* 일반 로그인 헤더 */}
      <div>일반 로그인</div>
      {/* 일반 로그인 버튼 */}
      <LoginButton />
      {/* 간편 로그인 헤더 */}
      <div>간편 로그인</div>
      {/* 간편 로그인 버튼 */}
      <GoogleLoginButton />
    </div>
  );
}
