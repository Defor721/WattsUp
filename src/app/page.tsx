"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch("/api/user");
        if (!response.ok) throw new Error("API 호출 실패");

        const data = await response.json();
        setUser(data); // 응답 결과 설정
        console.log("✅ API 응답:", data); // 성공 로그 추가
      } catch (error) {
        console.error("❌ API 오류:", error);
      }
    }

    fetchUser();
  }, []);

  console.log(user);

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
          {user ? (
            <p className="mt-4">유저 이름: {user.name}</p>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
    </div>
  );
}
