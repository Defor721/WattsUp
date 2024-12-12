"use client";

import { Button } from "@/components/shadcn";

const Google_OAUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";

export default function GoogleLoginButton() {
  const handleLogin = () => {
    const authUrl = `${Google_OAUTH_URL}?response_type=code&client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_REDIRECT_URI}&scope=openid email profile&access_type=offline&prompt=consent`;

    window.location.href = authUrl;
  };

  return <Button onClick={handleLogin}>Google로 로그인</Button>;
}
