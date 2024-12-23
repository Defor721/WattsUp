// "use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import Introduce from "@/components/mainpage/introduce/Introduce";
import VideoPart from "@/components/mainpage/video/VideoPart";
import FeaturesPart from "@/components/mainpage/features/Features";
import RenewableEnergyIntro from "@/components/mainpage/renewable/renewable";

export default function Home() {
  return (
    <div className="relative mx-auto min-h-screen w-full bg-white sm:w-[640px] md:w-[768px] lg:w-[1024px] xl:w-[1460px]">
      {/* 비디오 섹션 */}
      <VideoPart />

      {/* 컨텐츠 컨테이너 */}
      <div className="w-full">
        {/* 소개 섹션 */}
        <section className="">
          <Introduce />
        </section>

        {/* 재생 가능 에너지 소개 */}
        <section className="bg-gray-50">
          <RenewableEnergyIntro />
        </section>

        {/* 주요 기능 섹션 */}
        <section className="bg-gray-100">
          <FeaturesPart />
        </section>
      </div>
    </div>
  );
}
