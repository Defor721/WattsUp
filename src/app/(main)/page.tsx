"use client";

import { useEffect } from "react";
import $ from "jquery";

import "fullpage.js/dist/jquery.fullpage.css";
import "fullpage.js";
import VideoPart from "@/components/main/video/VideoPart";
import EnergyInfoPage from "@/components/main/renewable/renewable";
import FeaturesPart from "@/components/main/features/Features";

export default function Home() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      $(document).ready(() => {
        // fullpage.js 초기화
        $("#fullpage").fullpage({
          navigation: true,
          scrollingSpeed: 700,
          anchors: ["video", "energy", "features"],
        });
      });
    }

    return () => {
      if ($.fn.fullpage.destroy) {
        // 컴포넌트 언마운트 시 fullpage.js 제거
        $.fn.fullpage.destroy("all");
      }
    };
  }, []);

  return (
    <div id="fullpage">
      <div className="section" style={{ backgroundColor: "#e5e7eb" }}>
        <VideoPart />
      </div>
      <div className="section" style={{ backgroundColor: "#f3f4f6" }}>
        <EnergyInfoPage />
      </div>
      <div className="section" style={{ backgroundColor: "#ffffff" }}>
        <FeaturesPart />
      </div>
    </div>
  );
}
