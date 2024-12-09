import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-gray-100">
      {/* Full-width video header */}
      <div className="relative h-[70vh] w-full overflow-hidden">
        <video
          src="/assets/videos/istockphoto-1569244272-640_adpp_is.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50" />{" "}
        {/* Overlay for better text visibility */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
          <h1 className="mb-4 text-6xl font-bold">
            <span className="bg-gradient-to-r from-teal-200 to-blue-300 bg-clip-text text-[100px] font-bold text-transparent">
              Watts_uP
            </span>
          </h1>
          <p className="mb-8 w-full max-w-2xl bg-black p-2 text-xl">
            WITH_TURBIN_CREW
          </p>
          <Link
            href="/dashboard"
            className="flex items-center rounded-full bg-blue-300 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Explore Dashboard
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
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
            },
            {
              title: "Predictive Analytics",
              description:
                "Leverage AI-driven forecasts to optimize energy distribution and reduce costs.",
            },
            {
              title: "Smart Trading",
              description:
                "Automate energy trading decisions based on market trends and demand patterns.",
            },
          ].map((feature, index) => (
            <div key={index} className="rounded-lg bg-white p-6 shadow-md">
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
