"use client";

import { useAuthStore } from "@/auth/store";

export default function Home() {
  const accessToken = useAuthStore((state) => state.accessToken);
  console.log(`accessToken: `, accessToken);
  return <div>대시보드 페이지</div>;
}
