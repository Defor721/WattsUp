"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Slide } from "@/components/main/video/types/slide";

interface SlideContentProps {
  slide: Slide;
}

export default function SlideContent({ slide }: SlideContentProps) {
  return (
    <div className="text-center">
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mb-2 text-sm font-light tracking-wider text-gray-300 sm:mb-4 sm:text-base md:text-lg lg:text-xl"
      >
        {slide.subtitle}
      </motion.p>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mb-3 text-3xl font-bold text-white sm:mb-4 sm:text-4xl md:text-5xl lg:mb-6 lg:text-7xl"
      >
        {slide.title}
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="mb-4 text-base font-light text-gray-300 sm:mb-6 sm:text-lg md:text-xl lg:mb-8 lg:text-2xl"
      >
        {slide.description}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <Link
          href={slide.cta.href}
          className="group inline-flex items-center gap-2 rounded-full border border-white px-4 py-2 text-sm font-medium text-white transition-all hover:bg-white hover:text-black sm:px-6 sm:py-3 sm:text-base md:px-8 md:py-4 md:text-lg"
        >
          {slide.cta.text}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 sm:h-5 sm:w-5 md:h-6 md:w-6" />
        </Link>
      </motion.div>
    </div>
  );
}
