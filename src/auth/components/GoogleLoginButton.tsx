"use client";

import { Button } from "@/components/shadcn";

// 구글 OAuth 2.0의 endpoint
const Google_OAUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";

export default function GoogleLoginButton() {
  /** 사용자를 Google 로그인 페이지로 리디렉트하여 인증과 권한 승인을 받음 */
  const handleLogin = () => {
    // OAuth 2.0 endpoint에 필요한 파라미터
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID; // Google Cloud Console에서 생성된 클라이언트 ID
    const redirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI; // 인증이 완료된 후 Google이 사용자를 리디렉션할 URI
    const scope = "openid email profile"; // 애플리케이션이 요청하는 권한 범위
    const responseType = "code"; // 응답 유형

    // OAuth 2.0 endpoint에 필요한 파라미터를 넣어주어야 함
    // access_type 은 offline을 설정하면 리프레시 토큰을 받을 수 있음
    const authUrl = `
      ${Google_OAUTH_URL}?response_type=${responseType}&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&access_type=offline&prompt=consent
    `;

    window.location.href = authUrl;
  };

  return <Button onClick={handleLogin}>Google로 로그인</Button>;
}
