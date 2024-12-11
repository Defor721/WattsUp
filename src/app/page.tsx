"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const links = [
    { title: "Explore Dashboard", href: "/dashboard" },
    { title: "Energy Analytics", href: "/energytrade" },
    { title: "Smart Trading", href: "/trading" },
    { title: "With Turbin Crew", href: "https://turbinecrew.co.kr/" },
  ];

  return (
    <div className="relative min-h-screen bg-gray-100">
      {/* Full-width video header with overlay links */}
      <div className="relative h-[60vh] w-full overflow-hidden">
        <video
          src="/assets/videos/istockphoto-1569244272-640_adpp_is.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-60" />

        {/* Grid of links */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <h1 className="mb-8 text-center">
            <span className="bg-gradient-to-r from-teal-200 to-blue-300 bg-clip-text text-[80px] font-bold text-transparent sm:text-[100px]">
              Watts_uP
            </span>
          </h1>
          <div className="grid w-full max-w-4xl grid-cols-2 gap-0 px-4 sm:px-0">
            {links.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="flex items-center justify-between bg-black bg-opacity-50 p-8 text-white transition-all duration-200 hover:bg-opacity-80"
              >
                <span className="text-xl font-semibold">{link.title}</span>
                <ArrowRight className="h-6 w-6" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Features section */}
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">
          Powerful Features for Energy Management
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {[
            {
              title: "Real-time Monitoring",
              description:
                "Track power generation and consumption in real-time with intuitive visualizations.",
              icon: "/assets/icons/monitor.svg",
            },
            {
              title: "Predictive Analytics",
              description:
                "Leverage AI-driven forecasts to optimize energy distribution and reduce costs.",
              icon: "/assets/icons/analytics.svg",
            },
            {
              title: "Smart Trading",
              description:
                "Automate energy trading decisions based on market trends and demand patterns.",
              icon: "/assets/icons/trading.svg",
            },
          ].map((feature, index) => (
            <div key={index} className="rounded-lg bg-white p-6 shadow-md">
              <Image
                src={feature.icon}
                alt={feature.title}
                width={48}
                height={48}
                className="mb-4"
              />
              <h3 className="mb-3 text-xl font-semibold text-gray-900">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
