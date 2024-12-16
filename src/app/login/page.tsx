"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { Card } from "@/components/shadcn";
import GoogleLoginButton from "@/auth/components/GoogleLoginButton";
import LoginForm from "@/auth/components/loginForm";
import { useLoginStore } from "@/auth/useLoginStore";
import useAccessToken from "@/auth/useAccessToken";

export default function LoginPage() {
  const router = useRouter();
  const { setAccessToken } = useAccessToken();

  const {
    accessToken,
    redirectTo,
    actions: { resetLoginState },
  } = useLoginStore();

  useEffect(() => {
    resetLoginState();
  }, []);

  useEffect(() => {
    if (accessToken) {
      setAccessToken(accessToken);
      resetLoginState();
      router.push(redirectTo);
    }
  }, [accessToken]);

  return (
    <Card className="w-[400px]">
      <LoginForm />
      <GoogleLoginButton />
    </Card>
  );
}
