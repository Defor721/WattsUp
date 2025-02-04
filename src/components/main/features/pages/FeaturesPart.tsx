"use client";

import { features } from "@/components/main/features/data/features";
import HeroSection from "../HeroSection";
import FeatureCard from "../FeatureCard";

function FeaturesPart() {
  return (
    <div className="flex h-screen flex-col bg-gray-100 dark:bg-subColor">
      <HeroSection />

      <div className="flex flex-col items-center py-12">
        <div className="grid max-w-7xl grid-cols-1 gap-8 px-4 md:grid-cols-2 lg:px-8">
          {/* features 데이터 배열을 map()을 사용하여 FeatureCard로 렌더링 */}
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default FeaturesPart;
