"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuthStore } from "@/auth/useAuthStore";

export default function LoginErrorPage() {
  const router = useRouter();
  const { message } = useAuthStore();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    const redirectTimer = setTimeout(() => {
      router.push("/login");
    }, 5000);

    return () => {
      clearInterval(timer);
      clearTimeout(redirectTimer);
    };
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-6 rounded p-6">
        <h1 className="text-4xl font-extrabold">로그인 실패</h1>
        <p className="mt-4 text-base">{message}</p>
        <p className="mt-4 text-xl">
          <span className="font-bold">{countdown}</span> 초 후 로그인 화면으로
          이동합니다.
        </p>
      </div>
    </div>
  );
}
