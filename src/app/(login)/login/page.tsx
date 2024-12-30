"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { Card } from "@/components/shadcn";
import GoogleLoginButton from "@/auth/components/GoogleLoginButton";
import { useAuthStore } from "@/auth/useAuthStore";
import useAccessToken from "@/auth/useAccessToken";
import LoginForm from "@/auth/components/loginForm";

export default function LoginPage() {
  const router = useRouter();
  const { setAccessToken } = useAccessToken();

  const {
    accessToken,
    redirectTo,
    actions: { resetLoginState },
  } = useAuthStore();

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

  return <LoginForm />;
}
