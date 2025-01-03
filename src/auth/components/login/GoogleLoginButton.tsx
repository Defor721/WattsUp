"use client";

import Image from "next/image";

import { Button } from "@/components/shadcn";

const Google_OAUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";

export default function GoogleLoginButton() {
  const handleLogin = () => {
    const authUrl = `${Google_OAUTH_URL}?response_type=code&client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_REDIRECT_URI}&scope=openid email profile&prompt=consent`;

    window.location.href = authUrl;
  };

  return (
    <Button
      type="button"
      onClick={handleLogin}
      className={`flex w-full items-center justify-center gap-0 rounded-lg bg-google-bg px-2 py-2`}
    >
      <Image
        src={`/assets/logos/google/svg/neutral/web_neutral_sq_na.svg`}
        alt="Google Logo"
        width={30}
        height={18}
        className="mr-6"
      />
      <span className="text-google-text">Google 계정으로 로그인</span>
    </Button>
  );
}
