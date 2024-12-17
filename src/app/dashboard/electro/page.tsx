"use client";

import React from "react";
import { Users, UserPlus, Heart, MoreHorizontal } from "lucide-react";

import KPICard from "@/app/dashboard/electro/KPIcard";

const PowerDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <h1 className="mb-6 text-center text-4xl font-bold text-white">
        {"전력지표 대시보드"}
      </h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Users */}
        <KPICard
          title="Total Users"
          value={250}
          icon={<Users size={24} color="#A855F7" />} // 보라색
          backgroundColor="#1E1E2E" // 카드 배경
          iconColor="#A855F7" // 아이콘 배경색
        />

        {/* New Users */}
        <KPICard
          title="New Users"
          value={15}
          icon={<UserPlus size={24} color="#FACC15" />} // 노란색
          backgroundColor="#1E1E2E"
          iconColor="#FACC15"
        />

        {/* Top Users */}
        <KPICard
          title="Top Users"
          value={200}
          icon={<Heart size={24} color="#22C55E" />} // 초록색
          backgroundColor="#1E1E2E"
          iconColor="#22C55E"
        />

        {/* Other Users */}
        <KPICard
          title="Other Users"
          value={35}
          icon={<MoreHorizontal size={24} color="#3B82F6" />} // 파란색
          backgroundColor="#1E1E2E"
          iconColor="#3B82F6"
        />
      </div>
    </div>
  );
};

export default PowerDashboard;
