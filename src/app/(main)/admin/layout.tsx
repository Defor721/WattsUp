import React, { ReactNode } from "react";

function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <section className="m-3 bg-rose-300 p-3 lg:w-full">{children}</section>
  );
}

export default AdminLayout;
