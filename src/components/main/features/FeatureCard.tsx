"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface Feature {
  title: string;
  description: string;
  image?: string;
  link: string;
  index: number; // 애니메이션 지연을 위한 인덱스
}

function FeatureCard({ title, description, image, link, index }: Feature) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: index * 0.2 }}
      viewport={{ once: true }}
      className="group overflow-hidden rounded-lg bg-white shadow-lg transition-shadow duration-300 hover:shadow-2xl"
    >
      <Link
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="relative block h-64 overflow-hidden"
      >
        <div className="relative h-64">
          <Image
            src={image || "/placeholder.svg"} // 기본 이미지 처리
            alt={title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <span className="flex items-center text-lg font-semibold text-white">
              자세히 보기 <ArrowRight className="ml-2" />
            </span>
          </div>
        </div>
      </Link>
      <div className="p-6">
        <h3 className="mb-2 text-xl font-semibold text-gray-900">{title}</h3>
        <p className="text-gray-700">{description}</p>
      </div>
    </motion.div>
  );
}

export default FeatureCard;
