"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { slides } from "@/components/main/video/data/slides";
import BackgroundVideo from "../BackgroundVideo";
import AnimatedLogo from "../AnimatedLogo";
import SlideContent from "../SlideContent";
import SlideNavigation from "../SlideNavigation";

export default function VideoPart() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <BackgroundVideo />
      <AnimatedLogo />

      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={`slide-${currentSlide}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="container mx-auto px-4"
          >
            <SlideContent slide={slides[currentSlide]} />
          </motion.div>
        </AnimatePresence>

        <SlideNavigation
          totalSlides={slides.length}
          currentSlide={currentSlide}
          onSlideChange={setCurrentSlide}
        />
      </div>
    </div>
  );
}
