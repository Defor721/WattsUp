"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { Triangle } from "react-loader-spinner";

import { useAuthStore } from "@/auth/useAuthStore";
import useAccessToken from "@/auth/hooks/useAccessToken";
import { AUTH_MESSAGES } from "@/constants";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { setAccessToken } = useAccessToken();

  const {
    accessToken,
    message,
    redirectTo,
    actions: { socialLogin, resetAuthState },
  } = useAuthStore();

  useEffect(() => {
    const handleSocialLogin = async () => {
      const code = searchParams.get("code");
      const error = searchParams.get("error");

      if (error) router.push("/login/error");

      if (code) {
        try {
          await socialLogin(code);
        } catch (error) {
          console.error(error);
          router.push("/login/error");
        }
      }
    };

    handleSocialLogin();
  }, [searchParams]);

  useEffect(() => {
    if (message) {
      if (message === AUTH_MESSAGES.EMAIL_REGISTERED_AS_NATIVE) {
        router.push("/login/error");
        return;
      }
      if (accessToken) {
        setAccessToken(accessToken);
      }
      router.push(redirectTo);
      resetAuthState();
    }
  }, [message]);

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center">
        <Triangle
          visible={true}
          height="80"
          width="80"
          color="#4fa94d"
          ariaLabel="triangle-loading"
          wrapperStyle={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "20vh",
            width: "100vw",
          }}
        />
        <p className="mt-4 text-lg">
          로그인 처리 중입니다. 잠시만 기다려주세요...
        </p>
      </div>
    </div>
  );
}
