"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

import UserTable from "@/components/admin/user-management/UserTable";
import Title from "@/components/ui/Title";
import { useUserStore } from "@/stores/useUserStore";
import Loading from "@/app/loading";

function UserManagement() {
  const { user } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    if (user.role !== "admin") {
      router.push("/");
    }
  }, [router, user.role]);

  if (!user) return <Loading />;

  return (
    <div className="mx-auto max-w-[1920px] p-5 xl:p-10">
      <Title title="유저 관리" />
      <UserTable />
    </div>
  );
}

export default UserManagement;
