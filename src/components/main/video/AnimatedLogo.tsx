"use client";

import { motion } from "framer-motion";

export default function AnimatedLogo() {
  return (
    <motion.div
      initial={{ y: -200, opacity: 0 }}
      animate={{ y: 0, opacity: 0.7 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
      className="absolute inset-0 z-0 flex items-center justify-center"
    >
      <h1 className="text-center">
        <span className="bg-gradient-to-r from-teal-200 to-blue-300 bg-clip-text text-[100px] font-bold text-transparent opacity-80 sm:text-[200px] md:text-[250px] lg:text-[230px]">
          WattsUp
        </span>
      </h1>
    </motion.div>
  );
}
