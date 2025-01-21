"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

import Main from "@/components/admin/data-management/Main";
import Title from "@/components/ui/Title";
import { useUserStore } from "@/stores/useUserStore";
import Loading from "@/app/loading";

function DataManageMent() {
  const { user } = useUserStore();
  const router = useRouter();

  // useEffect(() => {
  //   if (user.role !== "admin") {
  //     router.push("/");
  //   }
  // }, [router, user.role]);

  if (!user) return <Loading />;

  return (
    <div className="mx-auto max-w-[1920px] p-5 xl:p-10">
      <Title title="데이터 관리" />
      <Main />
    </div>
  );
}

export default DataManageMent;
