import React, { ReactNode } from "react";

function AdminLayout({ children }: { children: ReactNode }) {
  return <div className="p-3 lg:w-full">{children}</div>;
}

export default AdminLayout;
