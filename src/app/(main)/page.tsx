"use client";

import { useEffect } from "react";
import "fullpage.js/dist/jquery.fullpage.css"; // FullPage.js 기본 CSS
import $ from "jquery";
import "fullpage.js/dist/jquery.fullpage";

import VideoPart from "@/components/main/video/VideoPart";
import FeaturesPart from "@/components/main/features/Features";
import EnergyInfoPage from "@/components/main/renewable/renewable";

export default function Home() {
  useEffect(() => {
    // FullPage.js 초기화 (클라이언트에서만 실행)
    if (typeof window !== "undefined") {
      $("#fullpage").fullpage({
        // licenseKey: "OPEN-SOURCE-GPLV3-LICENSE",
        scrollingSpeed: 700,
        anchors: ["video", "energy", "features"], // 섹션 이름
        navigation: true, // 네비게이션 활성화
      });
    }

    return () => {
      // 컴포넌트 언마운트 시 FullPage.js 제거
      if (typeof window !== "undefined") {
        $.fn.fullpage.destroy("all");
      }
    };
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
