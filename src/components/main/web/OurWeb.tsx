"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { InfoItem } from "@/components/main/web/info-item";
import { ReasonItem } from "@/components/main/web/reason-item";
import { teamInfo } from "@/components/main/web/data/team-info";
import { reasons } from "@/components/main/web/data/reasons";
import type { Info } from "@/components/main/web/types/info";

export const OurWeb = () => {
  const [selectedReason, setSelectedReason] = useState<Info | null>(null);
  const router = useRouter();

  const teamInfoItems = useMemo(
    () =>
      teamInfo.map((info, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <InfoItem {...info} />
        </motion.div>
      )),
    [],
  );

  const reasonItems = useMemo(
    () =>
      reasons.map((reason, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center"
        >
          <ReasonItem
            title={reason.title}
            onClick={() => setSelectedReason(reason)}
          />
        </motion.div>
      )),
    [],
  );

  return (
    <motion.div
      className="flex min-h-screen flex-col items-center justify-center overflow-x-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.section className="w-full bg-slate-800 py-12 text-white">
        <motion.h1
          className="mb-8 text-center text-4xl font-bold"
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          <span className="bg-gradient-to-r from-teal-200 to-blue-300 bg-clip-text text-transparent">
            WattsUp
          </span>{" "}
          팀 소개
        </motion.h1>

        <motion.div
          className="mb-8 flex justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Button
            onClick={() => router.push("/introduce")}
            className="group flex h-14 items-center gap-2 rounded-full border-1 px-8 text-base text-white transition-all hover:bg-gray-500"
          >
            더 알아보기
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </motion.svg>
          </Button>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, staggerChildren: 0.1 }}
        >
          {teamInfoItems}
        </motion.div>
      </motion.section>

      <motion.section className="w-full">
        <motion.div
          className="mb-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="relative mx-auto mt-4 flex min-h-[140px] w-3/4 max-w-md items-center justify-center overflow-hidden rounded-md bg-gray-100 p-4 pt-4 dark:bg-gray-700">
            <AnimatePresence mode="wait">
              {selectedReason ? (
                <motion.div
                  key={selectedReason.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="text-center"
                >
                  <p className="py-0 text-center text-sm text-gray-400 dark:text-gray-500">
                    &gt; 우리는 왜 전력거래소 웹을 선택했을까?
                  </p>
                  <h3 className="text-lg font-semibold">
                    {selectedReason.title}
                  </h3>
                  <p
                    className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300"
                    style={{ whiteSpace: "pre-line" }}
                  >
                    {selectedReason.description}
                  </p>
                </motion.div>
              ) : (
                <p className="text-lg text-gray-400 dark:text-gray-500">
                  우리는 왜 전력거래소 웹을 선택했을까?
                </p>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        <motion.div
          className="grid gap-8 py-8 md:grid-cols-2 lg:grid-cols-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          {reasonItems}
        </motion.div>
      </motion.section>
    </motion.div>
  );
};

export default OurWeb;
