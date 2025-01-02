import React from "react";

import UserManageMentTable from "@/components/admin/user-management/Table";

function UserManagement() {
  return (
    <div className="container mx-auto py-4">
      <h1 className="mb-4 text-2xl font-bold">사용자 관리</h1>
      <UserManageMentTable />
    </div>
  );
}

export default UserManagement;
