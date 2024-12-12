"use client";

import { Button } from "@/components/shadcn";

export default function LoginButton() {
  /** 사용자를 Google 로그인 페이지로 리디렉트하여 인증과 권한 승인을 받음 */
  const handleLogin = () => {};

  return <Button onClick={handleLogin}>일반 로그인</Button>;
}
