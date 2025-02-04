"use client";

import { motion } from "framer-motion";
import type React from "react"; // Added import for React

interface AnimatedDescriptionProps {
  text: string;
}

const AnimatedDescription: React.FC<AnimatedDescriptionProps> = ({ text }) => (
  <motion.p
    className="mb-8 text-lg text-gray-600 dark:text-gray-300 lg:text-xl"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay: 0.2 }}
  >
    {text}
  </motion.p>
);

export default AnimatedDescription;
