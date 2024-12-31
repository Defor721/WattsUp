"use client";

import { useEffect } from "react";
import $ from "jquery";

import "fullpage.js/dist/jquery.fullpage.css";
import "fullpage.js"; // fullpage.js 로드
import VideoPart from "@/components/main/video/VideoPart";
import EnergyInfoPage from "@/components/main/renewable/renewable";
import FeaturesPart from "@/components/main/features/Features";

export default function Home() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      // fullpage.js 초기화
      $("#fullpage").fullpage({
        navigation: true, // 오른쪽 네비게이션 활성화
        scrollingSpeed: 700, // 스크롤 속도
        anchors: ["video", "energy", "features"], // 앵커 설정
      });
    }
  }, []);

  return (
    <div id="fullpage">
      <div className="section">
        <VideoPart />
      </div>
      <div className="section">
        <EnergyInfoPage />
      </div>
      <div className="section">
        <FeaturesPart />
      </div>
    </div>
  );
}
