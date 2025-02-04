"use client";

import { motion } from "framer-motion";
import type React from "react"; // Import React

interface AnimatedTitleProps {
  title: string;
  highlightedText: string;
}

const AnimatedTitle: React.FC<AnimatedTitleProps> = ({
  title,
  highlightedText,
}) => (
  <motion.h1
    className="mb-6 text-4xl font-bold lg:text-6xl"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
  >
    {title}
    <br />
    <span className="text-blue-600">{highlightedText}</span>
  </motion.h1>
);

export default AnimatedTitle;
