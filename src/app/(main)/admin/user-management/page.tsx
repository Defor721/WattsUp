import React from "react";

import UserTable from "@/components/admin/user-management/UserTable";

function UserManagement() {
  return (
    <div className="mx-auto max-w-[1920px] p-5">
      <h1 className="mb-4 text-2xl font-bold">사용자 관리</h1>
      <UserTable />
    </div>
  );
}

export default UserManagement;
