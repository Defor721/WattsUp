// "use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import Introduce from "@/components/mainpage/introduce/Introduce";
import VideoPart from "@/components/mainpage/video/VideoPart";
import FeaturesPart from "@/components/mainpage/features/Features";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#fff]">
      <VideoPart />
      <Introduce />
      <FeaturesPart />
    </div>
  );
}
