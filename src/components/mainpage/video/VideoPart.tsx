"use client";

import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const slides = [
  {
    title: "Smart Energy Trading",
    subtitle: "Revolutionizing Power Exchange",
    description: "Experience the future of energy trading",
    cta: { text: "Explore More", href: "/trading" },
  },
  {
    title: "Real-Time Analytics",
    subtitle: "AI-Powered Insights",
    description: "Make data-driven decisions",
    cta: { text: "View Dashboard", href: "/dashboard" },
  },
  {
    title: "Sustainable Future",
    subtitle: "Green Energy Solutions",
    description: "Join the renewable revolution",
    cta: { text: "Learn More", href: "/about" },
  },
];

function VideoPart() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Video Background */}
      <video
        src="/assets/videos/istockphoto-1569244272-640_adpp_is.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Background WattsUp Logo */}
      <div className="absolute inset-0 z-0 flex items-center justify-center">
        <h1 className="text-center">
          <span className="bg-gradient-to-r from-teal-200 to-blue-300 bg-clip-text text-[200px] font-bold text-transparent opacity-70 sm:text-[300px]">
            WattsUp
          </span>
        </h1>
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50" />

      {/* Content */}
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="container mx-auto px-4"
          >
            <div className="text-center">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mb-4 text-xl font-light tracking-wider text-gray-300"
              >
                {slides[currentSlide].subtitle}
              </motion.p>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mb-6 text-7xl font-bold text-white"
              >
                {slides[currentSlide].title}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="mb-8 text-2xl font-light text-gray-300"
              >
                {slides[currentSlide].description}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                <Link
                  href={slides[currentSlide].cta.href}
                  className="group inline-flex items-center gap-2 rounded-full border border-white px-8 py-4 text-lg font-medium text-white transition-all hover:bg-white hover:text-black"
                >
                  {slides[currentSlide].cta.text}
                  <ArrowRight className="transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Slide Counter */}
        <div className="absolute bottom-8 right-8 font-light text-white">
          <span className="text-3xl">{currentSlide + 1}</span>
          <span className="text-xl opacity-50">/{slides.length}</span>
        </div>
      </div>
    </div>
  );
}

export default VideoPart;
