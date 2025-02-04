"use client";

import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

interface ReasonItemProps {
  title: string;
  onClick: () => void;
}

export const ReasonItem = ({ title, onClick }: ReasonItemProps) => {
  return (
    <motion.div
      className="relative cursor-pointer rounded-lg p-2 transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-800"
      onClick={onClick}
    >
      <h3 className="text-lg font-semibold text-gray-400 transition-colors duration-300 hover:text-gray-800 dark:text-gray-500 dark:hover:text-gray-300">
        {title}
      </h3>
      <motion.div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <ChevronRight className="h-5 w-5 text-gray-400 dark:text-gray-500" />
      </motion.div>
    </motion.div>
  );
};
