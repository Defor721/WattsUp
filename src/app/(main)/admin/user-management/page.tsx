"use client";

import React, { useState } from "react";

import Loading from "@/app/loading";
import UserManageMentTable from "@/components/admin/user-management/Table";

function UserManagement() {
  const [loading, setLoading] = useState(false);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto py-4">
      <h1 className="mb-4 text-2xl font-bold">사용자 관리</h1>
      <UserManageMentTable />
    </div>
  );
}

export default UserManagement;
