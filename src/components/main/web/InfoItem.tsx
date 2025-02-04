"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import type { Info } from "@/components/main/web/types/info";

export const InfoItem = ({ title, description, icon }: Info) => {
  const router = useRouter();

  return (
    <motion.div
      className="group cursor-pointer overflow-hidden rounded-lg p-4 transition-all duration-300 hover:shadow-lg"
      whileHover={{ scale: 1.03 }}
      style={{ transformOrigin: "center" }}
      onClick={() => router.push("/introduce")}
    >
      <div className="flex flex-col items-center gap-2">
        <div className="text-gray-300">{icon}</div>
        <h3 className="text-center text-lg font-semibold">{title}</h3>
        <p className="mt-2 text-center text-sm text-slate-200 dark:text-gray-400">
          {description}
        </p>
      </div>
    </motion.div>
  );
};
