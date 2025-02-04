"use client";

import type React from "react";
import HeroSection from "./HeroSection";
import FeatureCard from "./FeatureCard";
import { features } from "@/components/main/features/data/features";

const FeaturesPart: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col bg-gray-100 dark:bg-subColor">
      <HeroSection />
      <div className="flex flex-col items-center bg-gray-100 py-12 dark:bg-subColor">
        <div className="grid max-w-7xl grid-cols-1 gap-8 px-4 md:grid-cols-2 lg:px-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturesPart;
