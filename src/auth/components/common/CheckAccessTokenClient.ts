"use client";

import useCheckAccessToken from "@/auth/hooks/useCheckAccessToken";

export default function CheckAccessTokenClient() {
  useCheckAccessToken(); // 클라이언트 전용 훅 호출

  return null; // UI가 필요 없으므로 아무것도 렌더링하지 않음
}
