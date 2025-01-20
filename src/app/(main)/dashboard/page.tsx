import React from "react";

import DashboardMain from "@/components/dashboard/main/Main";
import Title from "@/components/ui/Title";

export default function Page() {
  return (
    <div className="mx-auto max-w-[1920px] p-5 xl:p-10">
      <Title title="대시보드" />
      <DashboardMain />
    </div>
  );
}
