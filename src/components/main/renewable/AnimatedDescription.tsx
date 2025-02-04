"use client";

import { motion } from "framer-motion";

interface AnimatedDescriptionProps {
  text: string;
}

function AnimatedDescription({ text }: AnimatedDescriptionProps) {
  return (
    <motion.p
      className="mb-8 text-lg text-gray-600 dark:text-gray-300 lg:text-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      {text}
    </motion.p>
  );
}

export default AnimatedDescription;
