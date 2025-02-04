"use client";

import Image from "next/image";
import { motion } from "framer-motion";

function HeroSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="relative flex min-h-[40vh] flex-col items-center justify-center text-center"
    >
      <Image
        src="/assets/images/earth.jpg"
        alt="Earth Icon"
        width={120}
        height={120}
        className="mx-auto mb-8"
      />
      <h1 className="mb-4 text-4xl font-bold">UNLEASH YOUR ENERGY</h1>
      <p className="text-xl">터빈크루와 함께 에너지의 미래를 열어가세요</p>
    </motion.div>
  );
}

export default HeroSection;
