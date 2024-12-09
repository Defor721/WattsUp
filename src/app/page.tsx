"use client";

import { useAuthStore } from "@/auth/authStore";

export default function Home() {
  const user = useAuthStore((state) => state.user);
  const access = useAuthStore((state) => state.accessToken);
  return (
    <div className="relative h-screen">
      {/* 비디오를 상단에 고정 */}
      <div className="absolute left-0 top-0 z-10 h-[50vh] w-[50vh]">
        <video
          src="/assets/videos/head-image.mp4"
          autoPlay
          loop
          muted
          className="h-full w-full object-cover"
        />
        {/* 비디오 위에 헤더 텍스트 */}
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <h1 className="text-5xl font-bold text-white">Watts_uP</h1>
        </div>
        <div>user: {user?.email}</div>
        <div>access: {access}</div>
      </div>
    </div>
  );
}
