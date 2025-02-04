"use client";

import { motion } from "framer-motion";

interface AnimatedTitleProps {
  title: string;
  highlightedText: string;
}

function AnimatedTitle({ title, highlightedText }: AnimatedTitleProps) {
  return (
    <motion.h1
      className="mb-6 text-4xl font-bold lg:text-6xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      {title}
      <div>
        <span className="text-blue-600">{highlightedText}</span>
      </div>
    </motion.h1>
  );
}

export default AnimatedTitle;
