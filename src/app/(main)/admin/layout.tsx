import React, { ReactNode } from "react";

function AdminLayout({ children }: { children: ReactNode }) {
  return <section className="p-3 lg:w-full">{children}</section>;
}

export default AdminLayout;
